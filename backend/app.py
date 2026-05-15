from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
import os
import math
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from report_pdf import create_pdf_report

app = Flask(__name__)
CORS(app)

def connect_db():
    return sqlite3.connect('database.db')

def init_db():
    conn = connect_db()
    conn.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)')
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
    chunks = content.split('\n')
    scanned_lines = [] 
    overall_entropy = get_entropy_score(content)  
    for c in chunks:
        clean_c = c.strip()      
        is_code_line = any(char in clean_c for char in ['(', ')', ':', '=', '[', ']', '{', '}', '<', '>', '/', ';', ',', '"', "'"])  
        min_len = 35 if is_code_line else 12   
        if len(clean_c) < min_len:
            scanned_lines.append({'text': c, 'is_ai': False, 'score': 0})
            continue         
        e_score = get_entropy_score(c)
        threshold = 2.2 if is_code_line else 3.8  
        if overall_entropy > 3.5 and is_code_line:
             threshold = 1.6     
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
    if 'file' in request.files:
        input_text = request.files['file'].read().decode('utf-8', errors='ignore')
    else:
        input_text = request.json.get('text', '')       
    if not input_text:
        return jsonify({'error': 'No content provided'}), 400
    allowed = ('.txt', '.py', '.js', '.jsx', '.tsx', '.html', '.css', '.java', '.cpp', '.c')
    target_files = [f for f in os.listdir('dataset') if f.lower().endswith(allowed)]   
    final_sim = 0
    if target_files:
        docs = []
        for f_name in target_files:
            f_path = os.path.join('dataset', f_name)
            with open(f_path, 'r', encoding='utf-8', errors='ignore') as f_obj:
                docs.append(f_obj.read())      
        docs.append(input_text)
        vecs = TfidfVectorizer().fit_transform(docs).toarray()
        scores = cosine_similarity(vecs[-1:], vecs[:-1])[0]
        final_sim = round(max(scores) * 100, 2)     
    ai_pct, ai_details = scan_for_ai(input_text)
    return jsonify({
        'plagiarism_score': final_sim,
        'ai_score': ai_pct,
        'is_ai': ai_pct > 30,
        'ai_lines': ai_details,
        'original_text': input_text
    })

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

if __name__ == '__main__':
    if not os.path.exists('dataset'):
        os.makedirs('dataset')
    init_db()
    app.run(debug=True, port=5000)