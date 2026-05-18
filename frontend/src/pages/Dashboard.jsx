import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

function Dashboard() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (!saved) {
      navigate('/login');
    } else {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleAnalysis = async () => {
    if (!text && !file) return;
    setLoading(true);

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else {
      formData.append('text', text);
    }

    const res = await fetch('https://moksha132.pythonanywhere.com/check', {
      method: 'POST',
      body: file ? formData : JSON.stringify({ text }),
      headers: file ? {} : { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setText('');
    }
  };

  const handleDownloadReport = async () => {
    if (!results) return;

    try {
      const res = await fetch('https://moksha132.pythonanywhere.com/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: results.original_text,
          plagiarism_score: results.plagiarism_score,
          ai_score: results.ai_score,
          ai_lines: results.ai_lines
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Failed to generate report: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'PlagCheck_Report.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="container" style={{ paddingBottom: '8rem' }}>
      <nav className="navbar">
        <div className="logo">PlagCheck</div>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: '600', marginRight: '2rem' }}>{user?.username}</span>
          <button onClick={logout} style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Log Out</button>
        </div>
      </nav>

      <div className="card" style={{ marginTop: '4rem' }}>
        <h2 style={{ color: '#0a192f', marginBottom: '0.5rem' }}>Full Content Analysis</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Check for plagiarism and AI-generated content in your code or scripts.</p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => { setFile(null); fileInputRef.current.value = ''; }}
            style={{
              background: !file ? 'var(--primary)' : '#f1f5f9',
              color: !file ? 'black' : '#64748b',
              padding: '0.6rem 1.5rem'
            }}
          >
            Paste Content
          </button>
          <button
            onClick={() => fileInputRef.current.click()}
            style={{
              background: file ? 'var(--primary)' : '#f1f5f9',
              color: file ? 'black' : '#64748b',
              padding: '0.6rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Upload size={18} />
            {file ? file.name : 'Upload File'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {!file ? (
          <textarea
            style={{
              width: '100%',
              height: '250px',
              padding: '1.5rem',
              background: '#f8fafc',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              resize: 'none',
              fontFamily: 'monospace',
              fontSize: '1rem'
            }}
            placeholder="Paste your code or text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        ) : (
          <div style={{ height: '250px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <FileText size={48} style={{ marginBottom: '1rem' }} />
            <p style={{ fontWeight: '600' }}>{file.name}</p>
            <p style={{ fontSize: '0.9rem' }}>File ready for analysis</p>
          </div>
        )}

        <button
          onClick={handleAnalysis}
          disabled={loading || (!text && !file)}
          style={{ marginTop: '1.5rem', width: '100%', padding: '1.2rem' }}
        >
          {loading ? 'Running Intelligence Check...' : 'Run Full Analysis'}
        </button>

        {results && (
          <div style={{ marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ color: '#64748b', marginBottom: '1rem' }}>Plagiarism Score</h4>
                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: results.plagiarism_score > 25 ? '#ef4444' : '#22c55e' }}>
                  {results.plagiarism_score}%
                </div>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {results.plagiarism_score > 25 ? 'High similarity detected.' : 'Content appears original.'}
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <h4 style={{ color: '#64748b', marginBottom: '1rem' }}>AI Detection</h4>
                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: results.ai_score > 30 ? '#ef4444' : '#22c55e' }}>
                  {results.ai_score > 30 ? 'AI' : 'Human'}
                </div>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {results.ai_score}% confidence
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: '#0a192f', marginBottom: '1rem' }}>Analysis Preview</h4>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                maxHeight: '300px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                fontSize: '0.9rem'
              }}>
                {results.ai_lines.map((line, i) => (
                  <div key={i} style={{
                    backgroundColor: line.is_ai ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                    padding: '2px 4px',
                    borderRadius: '4px'
                  }}>
                    {line.text}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleDownloadReport}
              style={{
                width: '100%',
                background: 'white',
                color: 'var(--dark-bg)',
                border: '2px solid var(--dark-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
            >
              <FileText size={20} />
              Download Detailed PDF Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
