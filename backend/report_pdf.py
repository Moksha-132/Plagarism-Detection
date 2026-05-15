import io
from fpdf import FPDF

def create_pdf_report(plag_score, ai_score, ai_lines):
    pdf = FPDF()
    pdf.set_margins(15, 15, 15)
    pdf.add_page() 

    effective_width = pdf.w - 30  
    pdf.set_font("helvetica", 'B', 24)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(effective_width, 20, "Originality Intelligence Report", 0, 1, 'C')
    pdf.ln(10)
    
    pdf.set_font("helvetica", 'B', 14)
    pdf.cell(effective_width / 2, 10, f"Plagiarism Score: {plag_score}%", 1, 0, 'C')
    pdf.cell(effective_width / 2, 10, f"AI Confidence: {ai_score}%", 1, 1, 'C')
    pdf.ln(15)
    
    pdf.set_font("helvetica", 'B', 12)
    pdf.cell(effective_width, 10, "Report Key:", 0, 1, 'L')
    pdf.set_font("helvetica", size=10)
    
    pdf.set_fill_color(254, 226, 226)
    pdf.cell(5, 5, "", 1, 0, 'L', fill=True)
    pdf.cell(effective_width - 5, 5, " Potential AI Content (Reason: High structural predictability)", 0, 1, 'L')
    
    pdf.set_fill_color(220, 252, 231)
    pdf.cell(5, 5, "", 1, 0, 'L', fill=True)
    pdf.cell(effective_width - 5, 5, " Human-written Content", 0, 1, 'L')
    pdf.ln(10)

    pdf.set_font("helvetica", 'B', 16)
    pdf.cell(effective_width, 10, "Content Breakdown", 0, 1, 'L')
    pdf.ln(5)
    
    pdf.set_font("courier", size=10)
    pdf.set_text_color(30, 41, 59)
    
    for line_data in ai_lines:
        line_text = line_data['text'].replace('\t', '    ').replace('\r', '')
        if not line_text.endswith('\n'):
            line_text += '\n'
            
        if line_data['is_ai']:
            pdf.set_fill_color(254, 226, 226)
            pdf.multi_cell(effective_width, 6, line_text, 0, 'L', fill=True)
        else:
            pdf.set_fill_color(220, 252, 231)
            pdf.multi_cell(effective_width, 6, line_text, 0, 'L', fill=True)
            
    output = io.BytesIO()
    pdf_str = pdf.output(dest='S')
    output.write(pdf_str)
    output.seek(0)
    return output