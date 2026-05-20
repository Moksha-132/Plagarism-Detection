from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
import os
import math
import re
import time
import secrets
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from report_pdf import create_pdf_report
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv


load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, 'database.db')
DATASET_DIR = os.path.join(os.path.dirname(BASE_DIR), 'dataset')

app = Flask(__name__)
CORS(app)

def connect_db():
    return sqlite3.connect(DATABASE_PATH)

def init_db():
    conn = connect_db()
    conn.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)')
    conn.execute('''CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        filename TEXT,
        plagiarism_score REAL,
        ai_score REAL,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        original_text TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )''')
    conn.execute('''CREATE TABLE IF NOT EXISTS reset_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        token TEXT,
        expires_at REAL
    )''')
    conn.commit()

def get_entropy_score(input_text):
    if not input_text or len(input_text.strip()) == 0:
        return 0  
    tokens = input_text.split()
    if not tokens:
        return 0    
    occ_map = {}
    for t in tokens:
        occ_map[t] = occ_map.get(t, 0) + 1
    val = 0
    for count in occ_map.values():
        p = count / len(tokens)
        val -= p * math.log2(p)
    return val

def scan_for_ai(content):
    raw_lines = content.split('\n')
    chunks = []
    for line in raw_lines:
        if len(line.strip()) > 150 and not any(c in line for c in ['{', '}', ';']):
            sentences = re.split(r'(?<=[.!?]) +', line)
            chunks.extend(sentences)
        else:
            chunks.append(line)
    scanned_lines = [] 
    overall_entropy = get_entropy_score(content)
    is_large_project = len(content) > 1000 or len(raw_lines) > 50
    is_complex = overall_entropy > 4.2
    use_project_mode = is_large_project and is_complex
    for c in chunks:
        clean_c = c.strip()      
        is_code_line = any(char in clean_c for char in ['(', ')', ':', '=', '[', ']', '{', '}', '<', '>', '/', ';'])  
        min_len = 25 if (use_project_mode and is_code_line) else 12
        if len(clean_c) < min_len:
            scanned_lines.append({'text': c, 'is_ai': False, 'score': 0})
            continue         
        e_score = get_entropy_score(c)
        threshold = 2.45 if is_code_line else 3.9  
        if use_project_mode and is_code_line:
             threshold = 1.5     
        flag_ai = e_score < threshold 
        pct = 0
        if flag_ai:
            pct = round(max(0, 100 - (e_score * (100/threshold))), 2)      
        scanned_lines.append({
            'text': c, 
            'is_ai': flag_ai,
            'score': pct
        })
    ai_count = sum(1 for line in scanned_lines if line['is_ai'])
    total_valid = sum(1 for line in scanned_lines if len(line['text'].strip()) > 5) 
    if total_valid > 0:
        final_score = round((ai_count / total_valid) * 100, 2)
    else:
        final_score = 0     
    return final_score, scanned_lines

@app.route('/register', methods=['POST'])
def register():
    payload = request.json
    db = connect_db()
    db.execute('INSERT INTO users (username, password) VALUES (?, ?)', (payload['username'], payload['password']))
    db.commit()
    return jsonify({'status': 'ok'}), 201

@app.route('/login', methods=['POST'])
def login():
    payload = request.json
    db = connect_db()
    row = db.execute('SELECT id, username FROM users WHERE username = ? AND password = ?', (payload['username'], payload['password'])).fetchone()
    if row:
        return jsonify({'id': row[0], 'username': row[1]})
    return jsonify({'error': 'invalid'}), 401

@app.route('/check', methods=['POST'])
def check():
    input_text = ""
    filename = None
    user_id = None
    if 'file' in request.files:
        file_obj = request.files['file']
        filename = file_obj.filename
        input_text = file_obj.read().decode('utf-8', errors='ignore')
        user_id = request.form.get('user_id')
    else:
        payload = request.json or {}
        input_text = payload.get('text', '')       
        user_id = payload.get('user_id')
        
    if not input_text:
        return jsonify({'error': 'No content provided'}), 400
    
    allowed = ('.txt', '.py', '.js', '.jsx', '.tsx', '.html', '.css', '.java', '.cpp', '.c')
    target_files = [f for f in os.listdir(DATASET_DIR) if f.lower().endswith(allowed)]   
    final_sim = 0
    if target_files:
        docs = []
        for f_name in target_files:
            f_path = os.path.join(DATASET_DIR, f_name)
            with open(f_path, 'r', encoding='utf-8', errors='ignore') as f_obj:
                docs.append(f_obj.read())      
        docs.append(input_text)
        vecs = TfidfVectorizer().fit_transform(docs).toarray()
        scores = cosine_similarity(vecs[-1:], vecs[:-1])[0]
        final_sim = round(max(scores) * 100, 2)     
    ai_pct, ai_details = scan_for_ai(input_text)

    if input_text.strip():
        if filename:
            name, ext = os.path.splitext(filename)
            clean_name = re.sub(r'[^a-zA-Z0-9_-]', '_', name)
            if not ext:
                ext = '.txt'
            save_name = f"user_{int(time.time())}_{clean_name}{ext}"
        else:
            save_name = f"user_{int(time.time())}.txt"
        
        try:
            with open(os.path.join(DATASET_DIR, save_name), 'w', encoding='utf-8') as f:
                f.write(input_text)
        except Exception as e:
            print("Error saving to dataset:", e)
    if user_id:
        try:
            db = connect_db()
            db.execute('''
                INSERT INTO history (user_id, filename, plagiarism_score, ai_score, original_text)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_id, filename or "Raw Text", final_sim, ai_pct, input_text))
            db.commit()
        except Exception as db_err:
            print("Error saving to history database:", db_err)

    return jsonify({
        'plagiarism_score': final_sim,
        'ai_score': ai_pct,
        'is_ai': ai_pct > 30,
        'ai_lines': ai_details,
        'original_text': input_text
    })

@app.route('/history/<int:user_id>', methods=['GET'])
def get_history(user_id):
    try:
        db = connect_db()
        cursor = db.execute('''
            SELECT id, filename, plagiarism_score, ai_score, timestamp, original_text 
            FROM history 
            WHERE user_id = ? 
            ORDER BY id DESC
        ''', (user_id,))
        rows = cursor.fetchall()
        history_list = []
        for r in rows:
            history_list.append({
                'id': r[0],
                'filename': r[1],
                'plagiarism_score': r[2],
                'ai_score': r[3],
                'timestamp': r[4],
                'original_text': r[5]
            })
        return jsonify(history_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/history/<int:scan_id>', methods=['DELETE'])
def delete_scan(scan_id):
    try:
        db = connect_db()
        db.execute('DELETE FROM history WHERE id = ?', (scan_id,))
        db.commit()
        return jsonify({'status': 'ok'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/report', methods=['POST'])
def build_report():
    try:
        req_data = request.json
        p_val = req_data.get('plagiarism_score', 0)
        a_val = req_data.get('ai_score', 0)
        a_lines = req_data.get('ai_lines', [])
        pdf_out = create_pdf_report(p_val, a_val, a_lines)
        return send_file(
            pdf_out,
            as_attachment=True,
            download_name="PlagCheck_Report.pdf",
            mimetype="application/pdf"
        )
    except Exception as err:
        return jsonify({'error': str(err)}), 500

@app.route('/contact', methods=['POST'])
def handle_contact():
    data = request.json
    name = data.get('name', '')
    email = data.get('email', '')
    message = data.get('message', '')

    if not name or not email or not message:
        return jsonify({'error': 'Missing fields'}), 400

    try:
        sender_email = os.environ.get("EMAIL_USER")
        sender_password = os.environ.get("EMAIL_PASS")
        
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = sender_email
        msg['Subject'] = f"New Contact Submission from {name}"

        body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()

        return jsonify({'status': 'Message sent successfully'})
    except Exception as e:
        print("Mail error:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    payload = request.json or {}
    username = payload.get('username', '').strip()
    frontend_url = payload.get('frontend_url', 'http://localhost:5173')

    if not username:
        return jsonify({'error': 'Email / Username is required'}), 400

    db = connect_db()
    user = db.execute('SELECT id FROM users WHERE username = ?', (username,)).fetchone()
    
    if not user:
        return jsonify({'error': 'User with this email/username does not exist'}), 404

    token = secrets.token_urlsafe(32)
    expires_at = time.time() + 3600

    try:
        db.execute('DELETE FROM reset_tokens WHERE username = ?', (username,))
        db.execute('INSERT INTO reset_tokens (username, token, expires_at) VALUES (?, ?, ?)', (username, token, expires_at))
        db.commit()

        sender_email = os.environ.get("EMAIL_USER")
        sender_password = os.environ.get("EMAIL_PASS")
        
        if not sender_email or not sender_password:
            return jsonify({'error': 'SMTP credentials not configured in backend .env'}), 500

        reset_link = f"{frontend_url}/reset-password?token={token}"

        msg = MIMEMultipart()
        msg['From'] = f"PlagCheck Support <{sender_email}>"
        msg['To'] = username
        msg['Subject'] = "PlagCheck Password Reset Request"

        reset_email_path = os.path.join(BASE_DIR, 'reset_email.html')
        with open(reset_email_path, 'r', encoding='utf-8') as f_template:
            html_body = f_template.read().replace('{reset_link}', reset_link)

        msg.attach(MIMEText(html_body, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()

        return jsonify({'status': 'ok', 'message': 'Reset link sent to your email successfully.'})
    except Exception as e:
        print("Forgot Password Mail error:", str(e))
        return jsonify({'error': f"Failed to send email: {str(e)}"}), 500

@app.route('/reset-password', methods=['POST'])
def reset_password():
    payload = request.json or {}
    token = payload.get('token', '').strip()
    new_password = payload.get('password', '').strip()

    if not token or not new_password:
        return jsonify({'error': 'Token and new password are required'}), 400

    db = connect_db()
    row = db.execute('SELECT username, expires_at FROM reset_tokens WHERE token = ?', (token,)).fetchone()

    if not row:
        return jsonify({'error': 'Invalid reset token'}), 400

    username, expires_at = row
    if time.time() > expires_at:
        db.execute('DELETE FROM reset_tokens WHERE token = ?', (token,))
        db.commit()
        return jsonify({'error': 'Reset token has expired'}), 400

    try:
        db.execute('UPDATE users SET password = ? WHERE username = ?', (new_password, username))
        db.execute('DELETE FROM reset_tokens WHERE username = ?', (username,))
        db.commit()
        return jsonify({'status': 'ok', 'message': 'Password has been reset successfully.'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if not os.path.exists(DATASET_DIR):
    try:
        os.makedirs(DATASET_DIR)
    except Exception as e:
        print("Error creating dataset folder:", e)
old_dataset_dir = os.path.join(BASE_DIR, 'dataset')
if os.path.exists(old_dataset_dir) and os.path.exists(DATASET_DIR):
    import shutil
    for item in os.listdir(old_dataset_dir):
        s = os.path.join(old_dataset_dir, item)
        d = os.path.join(DATASET_DIR, item)
        if os.path.isfile(s) and not os.path.exists(d):
            try:
                shutil.copy2(s, d)
            except Exception as e:
                print(f"Migration copy error for {item}: {e}")
init_db()
if __name__ == '__main__':
    app.run(debug=True, port=5000)