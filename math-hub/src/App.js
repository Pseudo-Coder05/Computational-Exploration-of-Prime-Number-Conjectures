import React, { useState, useEffect, useRef } from 'react';
// Import routing components from the library you just installed
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// --- Embedded CSS for the Main Hub and Components ---
const AppStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Mono&display=swap');

        body {
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background-color: #f0f2f5;
            color: #333;
        }

        /* --- Main Hub Styles --- */
        .hub-container { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; }
        .hub-header { text-align: center; margin-bottom: 3rem; }
        .hub-header h1 { font-size: 3rem; font-weight: 700; color: #2c3e50; }
        .hub-header p { font-size: 1.1rem; color: #7f8c8d; }
        .question-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .question-card { background: #ffffff; border-radius: 16px; padding: 2rem; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); transition: all 0.3s ease; border: 1px solid #e0e0e0; text-decoration: none; }
        .question-card:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12); border-color: #3498db; }
        .question-card h2 { margin: 0 0 0.5rem 0; color: #3498db; }
        .question-card p { color: #7f8c8d; line-height: 1.6; }
        .question-page-container { animation: fadeIn 0.5s ease; width: 100%; min-height: 100vh; box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .back-button { display: inline-block; margin: 2rem; padding: 0.5rem 1rem; background: #7f8c8d; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; transition: background-color 0.2s; text-decoration: none; position: absolute; top: 0; left: 0; z-index: 10; }
        .back-button:hover { background: #2c3e50; }

        /* --- Styles for Asmnt 1 (Pattern Prime Hunter) --- */
        .asmnt-1-container { font-family: 'Roboto Mono', monospace; background-color: #0c0c1d; color: #e0e0ff; background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); padding: 2rem; min-height: 100vh; display: flex; justify-content: center; align-items: center; box-sizing: border-box; }
        .asmnt-1-container .card { background: rgba(15, 15, 35, 0.8); border: 1px solid #404080; backdrop-filter: blur(10px); border-radius: 20px; padding: 2.5rem; box-shadow: 0 0 40px rgba(0, 240, 255, 0.2); width: 100%; max-width: 700px; }
        .asmnt-1-container .header h1 { font-family: 'Orbitron', sans-serif; font-size: 2.5rem; color: #00f0ff; text-shadow: 0 0 10px #00f0ff; margin: 0; }
        .asmnt-1-container .header p { color: #a0a0c0; margin-top: 0.5rem; }
        .asmnt-1-container .controls-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; align-items: end; margin-bottom: 2rem; }
        .asmnt-1-container .input-group label { display: block; font-weight: 500; margin-bottom: 0.5rem; color: #a0a0c0; }
        .asmnt-1-container .input-group input { width: 100%; padding: 0.8rem; font-size: 1rem; font-family: 'Roboto Mono', monospace; background: #101028; border: 1px solid #404080; border-radius: 8px; color: #e0e0ff; box-sizing: border-box; }
        .asmnt-1-container .search-button { width: 100%; padding: 0.8rem; font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 700; border: none; border-radius: 8px; background: #00f0ff; color: #0c0c1d; cursor: pointer; transition: all 0.2s; box-shadow: 0 0 15px #00f0ff; }
        .asmnt-1-container .search-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 25px #00f0ff; }
        .asmnt-1-container .search-button:disabled { background: #404080; box-shadow: none; color: #a0a0c0; cursor: not-allowed; }
        .asmnt-1-container .log-container { background: rgba(0, 0, 0, 0.3); border: 1px solid #404080; border-radius: 12px; padding: 1.5rem; height: 200px; overflow-y: auto; margin-bottom: 2rem; }
        .asmnt-1-container .log-entry { margin-bottom: 0.5rem; }
        .asmnt-1-container .log-entry.info { color: #82aaff; }
        .asmnt-1-container .log-entry.progress { color: #c3e88d; }
        .asmnt-1-container .log-entry.warning { color: #ffcb6b; }
        .asmnt-1-container .log-entry.found { color: #00ffa0; font-weight: bold; }
        .asmnt-1-container .log-entry.error { color: #ff5572; }
        .asmnt-1-container .result-card { background: linear-gradient(145deg, #2e005c, #5c004b); border: 1px solid #ff50a0; padding: 2rem; border-radius: 12px; text-align: center; }
        .asmnt-1-container .result-card h2 { font-family: 'Orbitron', sans-serif; margin: 0 0 1rem 0; color: #00ffa0; font-size: 1.5rem; }
        .asmnt-1-container .result-details dt { color: #a0a0c0; margin-top: 1rem; }
        .asmnt-1-container .result-details dd { margin: 0.25rem 0 0 0; font-size: 1.2rem; font-weight: 700; word-break: break-all; }

        /* --- Styles for Asmnt 2 (Repunit Primes) --- */
        .asmnt-2-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #111827; color: #f3f4f6; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 2rem; box-sizing: border-box; }
        .asmnt-2-container .main-content { width: 100%; max-width: 42rem; }
        .asmnt-2-container .header { text-align: center; margin-bottom: 2rem; }
        .asmnt-2-container .header h1 { font-size: 2.25rem; font-weight: bold; color: #22d3ee; }
        .asmnt-2-container .header p { margin-top: 0.5rem; color: #9ca3af; }
        .asmnt-2-container .form-container { background-color: #1f2937; padding: 1.5rem; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); margin-bottom: 2rem; }
        .asmnt-2-container .form-row { display: flex; flex-direction: column; gap: 1rem; }
        @media (min-width: 640px) { .asmnt-2-container .form-row { flex-direction: row; } }
        .asmnt-2-container .form-container input { flex-grow: 1; background-color: #374151; color: white; padding: 0.75rem; border-radius: 0.375rem; border: 2px solid #4b5563; transition: border-color 0.2s; }
        .asmnt-2-container .form-container input:focus { outline: none; border-color: #06b6d4; }
        .asmnt-2-container .primary-button { font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 0.375rem; border: none; cursor: pointer; background-color: #0891b2; color: white; }
        .asmnt-2-container .primary-button:hover { background-color: #0e7490; }
        .asmnt-2-container .primary-button:disabled { background-color: #6b7280; cursor: not-allowed; }
        .asmnt-2-container .results-container { background-color: rgba(31, 41, 55, 0.5); padding: 1.5rem; border-radius: 0.75rem; min-height: 200px; }
        .asmnt-2-container .prime-result-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1rem; }
        @media (min-width: 768px) { .asmnt-2-container .prime-result-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .asmnt-2-container .prime-result-grid { grid-template-columns: repeat(3, 1fr); } }
        .asmnt-2-container .prime-result-card { background-color: rgba(255, 255, 255, 0.1); padding: 1rem; border-radius: 0.5rem; }
        .asmnt-2-container .prime-result-card h3 { font-size: 1.125rem; font-weight: 600; color: #67e8f9; margin: 0; }
        .asmnt-2-container .prime-result-card h3 span { color: white; font-weight: bold; }
        .asmnt-2-container .prime-result-card p { font-size: 0.75rem; color: #9ca3af; margin: 0.25rem 0 0 0; }
        .asmnt-2-container .loading-spinner-container { display: flex; justify-content: center; align-items: center; height: 100%; }
        .asmnt-2-container .loading-spinner { width: 4rem; height: 4rem; border-radius: 50%; border-top: 4px solid transparent; border-right: 4px solid #22d3ee; border-bottom: 4px solid #22d3ee; border-left: 4px solid #22d3ee; animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .asmnt-2-container .info-message { text-align: center; color: #d1d5db; }
        .asmnt-2-container .error-message { text-align: center; color: #f87171; }
        .asmnt-2-container .warning-message { text-align: center; color: #facc15; font-size: 0.875rem; margin-top: 1rem; }
        .asmnt-2-container .footer-note { text-align: center; color: #6b7280; font-size: 0.75rem; margin-top: 2rem; }

        /* --- Styles for Asmnt 3, 4, 6 (Mersenne Suite) --- */
        .asmnt-346-container { background: #1a1a2e; background-image: radial-gradient(circle at 10% 20%, rgba(131, 58, 180, 0.3), transparent 30%), radial-gradient(circle at 80% 90%, rgba(253, 29, 29, 0.3), transparent 40%), radial-gradient(circle at 50% 50%, rgba(252, 176, 69, 0.2), transparent 40%); color: #e0e0e0; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 2rem; box-sizing: border-box; }
        .asmnt-346-container .app-container { max-width: 900px; margin: 0 auto; }
        .asmnt-346-container .header h1 { font-size: 3rem; font-weight: 700; color: #ffffff; letter-spacing: 1px; }
        .asmnt-346-container .header p { font-size: 1.1rem; color: #b0b0d0; max-width: 600px; margin: 0.5rem auto 0; }
        .asmnt-346-container .controls-panel { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); padding: 2.5rem; border-radius: 20px; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2); }
        .asmnt-346-container .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
        .asmnt-346-container .input-group label { display: block; font-weight: 500; margin-bottom: 0.75rem; color: #e0e0e0; }
        .asmnt-346-container .input-group input { width: 100%; padding: 0.8rem 1rem; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 10px; font-size: 1rem; color: white; box-sizing: border-box; transition: all 0.2s; }
        .asmnt-346-container .input-group input:focus { outline: none; border-color: rgba(131, 58, 180, 0.8); box-shadow: 0 0 10px rgba(131, 58, 180, 0.5); }
        .asmnt-346-container .main-button { width: 100%; padding: 1rem; font-size: 1.1rem; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; transition: all 0.2s ease-in-out; color: white; background: linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045); background-size: 200% auto; margin-bottom: 2rem; }
        .asmnt-346-container .main-button:hover:not(:disabled) { background-position: right center; }
        .asmnt-346-container .button-group { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .asmnt-346-container .button-group button { padding: 0.8rem; font-size: 1rem; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; transition: all 0.2s ease-in-out; color: white; }
        .asmnt-346-container .button-group button:disabled { opacity: 0.5; cursor: not-allowed; }
        .asmnt-346-container .brocard-button { background: #833ab4; }
        .asmnt-346-container .perfect-button { background: #fd1d1d; }
        .asmnt-346-container .button-group button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); }
        .asmnt-346-container .results-panel { margin-top: 3rem; }
        .asmnt-346-container .result-card { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(15px); padding: 2rem; border-radius: 20px; margin-bottom: 2rem; }
        .asmnt-346-container .result-card h2 { margin-top: 0; color: #ffffff; border-bottom: 1px solid rgba(255, 255, 255, 0.2); padding-bottom: 1rem; font-size: 1.5rem; }
        .asmnt-346-container .log-container { max-height: 200px; overflow-y: auto; font-family: monospace; }
        .asmnt-346-container .log-entry.info { color: #82aaff; }
        .asmnt-346-container .log-entry.progress { color: #c3e88d; }
        .asmnt-346-container .log-entry.found { color: #ffcb6b; font-weight: bold; }
        .asmnt-346-container .prime-list { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem; }
        .asmnt-346-container .prime-badge { background-color: rgba(0, 0, 0, 0.3); color: #e0e0e0; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 500; }
        .asmnt-346-container .perfect-list { list-style: none; padding: 0; }
        .asmnt-346-container .perfect-list li { padding: 1rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .asmnt-346-container .perfect-list li:last-child { border-bottom: none; }
        .asmnt-346-container .perfect-list strong { color: #fcb045; }
        .asmnt-346-container .error-message { color: #ffcdd2; background: rgba(239, 83, 80, 0.3); border: 1px solid rgba(239, 83, 80, 0.5); padding: 1rem; border-radius: 10px; margin-top: 2rem; text-align: center; }

        /* --- Styles for Asmnt 5 (Palindromic Primes) --- */
        .asmnt-5-container { font-family: 'Roboto Mono', monospace; background: #0d0c1d; color: #e0e0e0; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; box-sizing: border-box; }
        .asmnt-5-container .header { text-align: center; margin-bottom: 2rem; border-bottom: 1px solid #4a4a8a; padding-bottom: 1rem; }
        .asmnt-5-container .header h1 { font-size: 2.5rem; font-weight: 700; color: #a78bfa; text-shadow: 0 0 10px #a78bfa, 0 0 20px #a78bfa; }
        .asmnt-5-container .header p { color: #b0b0d0; max-width: 600px; }
        .asmnt-5-container .controls { display: flex; gap: 1rem; align-items: center; background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; }
        .asmnt-5-container .controls input { font-family: 'Roboto Mono', monospace; background: #1e1e3f; border: 1px solid #4a4a8a; color: white; padding: 0.75rem; border-radius: 8px; width: 80px; text-align: center; font-size: 1rem; }
        .asmnt-5-container .controls button { font-family: 'Roboto Mono', monospace; font-size: 1rem; font-weight: bold; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; }
        .asmnt-5-container .start-button { background-color: #5b21b6; color: white; box-shadow: 0 0 15px #5b21b6; }
        .asmnt-5-container .start-button:hover { background-color: #7c3aed; }
        .asmnt-5-container .stop-button { background-color: #b91c1c; color: white; box-shadow: 0 0 15px #b91c1c; }
        .asmnt-5-container .stop-button:hover { background-color: #dc2626; }
        .asmnt-5-container .search-status { width: 100%; max-width: 800px; background: #1e1e3f; border: 1px solid #4a4a8a; border-radius: 12px; padding: 1.5rem; min-height: 300px; }
        .asmnt-5-container .log-container { height: 300px; overflow-y: auto; padding-right: 1rem; font-size: 0.9rem; }
        .asmnt-5-container .log-entry { margin-bottom: 0.5rem; display: flex; }
        .asmnt-5-container .log-time { color: #818cf8; margin-right: 1rem; flex-shrink: 0; }
        .asmnt-5-container .log-message { color: #e0e0e0; word-break: break-all; }
        .asmnt-5-container .log-message.start { color: #34d399; font-weight: bold; }
        .asmnt-5-container .result-container { margin-top: 2rem; padding: 2rem; background: linear-gradient(145deg, #5b21b6, #9d50bb); border-radius: 12px; text-align: center; width: 100%; max-width: 800px; box-shadow: 0 0 30px #a78bfa; animation: fadeIn 1s ease-in-out; }
        .asmnt-5-container .result-container h2 { font-size: 2rem; margin-top: 0; color: white; }
        .asmnt-5-container .result-prime { font-size: 1.2rem; color: white; word-break: break-all; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; margin-top: 1rem; }
        .asmnt-5-container .result-stats { display: flex; justify-content: space-around; margin-top: 1.5rem; color: #e0e0e0; }

        /* --- Styles for Asmnt 7 (Goldbach's Conjecture) --- */
        .asmnt-7-container { background: #1a1a2e; background-image: radial-gradient(circle at 10% 20%, rgba(131, 58, 180, 0.3), transparent 30%), radial-gradient(circle at 80% 90%, rgba(253, 29, 29, 0.3), transparent 40%), radial-gradient(circle at 50% 50%, rgba(252, 176, 69, 0.2), transparent 40%); color: #e0e0e0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; box-sizing: border-box; }
        .asmnt-7-container .card { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); padding: 2.5rem; border-radius: 20px; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2); text-align: center; max-width: 600px; width: 100%; }
        .asmnt-7-container .header h1 { font-size: 2.5rem; font-weight: 700; color: #ffffff; margin: 0 0 0.5rem 0; }
        .asmnt-7-container .header p { font-size: 1.1rem; color: #b0b0d0; margin-bottom: 2rem; }
        .asmnt-7-container .input-field { width: 100%; padding: 1rem; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 10px; font-size: 1.2rem; color: white; box-sizing: border-box; text-align: center; font-family: 'Poppins', sans-serif; }
        .asmnt-7-container .submit-button { margin-top: 1.5rem; width: 100%; padding: 1rem; font-size: 1.1rem; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; color: white; background: linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045); background-size: 200% auto; transition: all 0.3s ease-in-out; }
        .asmnt-7-container .submit-button:hover:not(:disabled) { background-position: right center; }
        .asmnt-7-container .submit-button:disabled { opacity: 0.6; cursor: not-allowed; }
        .asmnt-7-container .result-container { margin-top: 2rem; padding: 1.5rem; background: rgba(0,0,0,0.2); border-radius: 10px; }
        .asmnt-7-container .result-equation { display: flex; align-items: center; justify-content: center; gap: 1rem; font-size: 1.5rem; font-weight: 500; }
        .asmnt-7-container .prime-badge { background: #833ab4; padding: 0.5rem 1.5rem; border-radius: 8px; color: white; }
        .asmnt-7-container .operator { color: #fcb045; }
        .asmnt-7-container .error-message { color: #ffcdd2; background: rgba(239, 83, 80, 0.3); border: 1px solid rgba(239, 83, 80, 0.5); padding: 1rem; border-radius: 10px; margin-top: 1.5rem; }

    `}</style>
);

// --- Placeholder Components for other assignments ---
const Placeholder = ({ title }) => (
    <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px' }}>
        <h2>{title}</h2>
        <p>The component for this question would be integrated here.</p>
    </div>
);


// --- Integrated Component for Asmnt 1 ---
const Asmnt1 = () => {
    const [startRange, setStartRange] = useState('1000');
    const [endRange, setEndRange] = useState('3000');
    const [logs, setLogs] = useState([]);
    const [result, setResult] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const eventSourceRef = useRef(null);
    const logContainerRef = useRef(null);
    const handleSearch = () => { setIsSearching(true); setLogs([]); setResult(null); const es = new EventSource(`http://127.0.0.1:5000/search/${startRange}/${endRange}`); eventSourceRef.current = es; es.addEventListener('update', (event) => { const data = JSON.parse(event.data); setLogs(prev => [...prev, data]); if (data.message === 'Search complete.') { setIsSearching(false); es.close(); } }); es.addEventListener('found', (event) => { const data = JSON.parse(event.data); setResult(data); setIsSearching(false); es.close(); }); es.onerror = () => { setLogs(prev => [...prev, { type: 'error', message: 'Connection to server lost.' }]); setIsSearching(false); es.close(); }; };
    useEffect(() => { if (logContainerRef.current) { logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight; } }, [logs]);
    return ( <div className="asmnt-1-container"><div className="card"><header className="header"><h1>Pattern Prime Hunter</h1><p>Search for the next prime number of the form 12...n...21.</p></header><div className="controls-grid"><div className="input-group"><label htmlFor="start">Start of Range</label><input id="start" type="number" value={startRange} onChange={(e) => setStartRange(e.target.value)} disabled={isSearching} /></div><div className="input-group"><label htmlFor="end">End of Range</label><input id="end" type="number" value={endRange} onChange={(e) => setEndRange(e.target.value)} disabled={isSearching} /></div><button onClick={handleSearch} className="search-button" disabled={isSearching}>{isSearching ? 'Searching...' : 'Launch Search'}</button></div><div className="results-panel"><div className="log-container" ref={logContainerRef}>{logs.map((log, i) => ( <div key={i} className={`log-entry ${log.type}`}>{log.message}</div> ))}</div>{result && ( <div className="result-card"><h2>Prime Found!</h2><dl className="result-details"><div><dt>Value of n</dt><dd>{result.n}</dd></div><div><dt>Total Digits</dt><dd>{result.digits.toLocaleString()}</dd></div><div><dt>Number Sample</dt><dd>{result.sample}</dd></div></dl></div> )}</div></div></div> );
};

// --- Integrated Component for Asmnt 2 ---
const Asmnt_2 = () => {
    const PrimeResult = ({ nValue }) => ( <div className="prime-result-card"><div><h3>Found Prime for N = <span>{nValue}</span></h3><p>The number 1 repeated {nValue} times is prime.</p></div></div> );
    const [maxN, setMaxN] = useState(100);
    const [foundPrimes, setFoundPrimes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchedLimit, setSearchedLimit] = useState(null);
    const [submittedMaxN, setSubmittedMaxN] = useState(null);
    const findRepunitPrimes = async () => { setIsLoading(true); setError(null); setFoundPrimes([]); setSearchedLimit(null); setSubmittedMaxN(maxN); try { const response = await fetch(`http://127.0.0.1:5000/find_primes/${maxN}`); if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`); const data = await response.json(); setFoundPrimes(data.primes_found_for_n || []); setSearchedLimit(data.limit_used); } catch (err) { console.error("Failed to fetch primes:", err); setError("Could not connect to the server. Please ensure the Python backend is running."); } finally { setIsLoading(false); } };
    const handleSubmit = (e) => { e.preventDefault(); if (maxN > 0) findRepunitPrimes(); else setError("Please enter a number greater than 0."); };
    return ( <div className="asmnt-2-container"><div className="main-content"><header className="header"><h1>Repunit Prime Finder</h1><p>Finds prime numbers made of only the digit '1'. A repunit I<sub>N</sub> can only be prime if N is prime.</p></header><form onSubmit={handleSubmit} className="form-container"><div className="form-row"><input type="number" value={maxN} onChange={(e) => setMaxN(Number(e.target.value))} placeholder="Enter max N" min="2" max="2000" /><button type="submit" disabled={isLoading} className="primary-button">{isLoading ? 'Searching...' : 'Find Primes'}</button></div>{searchedLimit && submittedMaxN && searchedLimit < submittedMaxN && ( <p className="warning-message">Note: Your input of {submittedMaxN} was above the server's safety limit. The search was performed up to N = {searchedLimit}.</p> )}</form><div className="results-container">{isLoading && ( <div className="loading-spinner-container"><div className="loading-spinner"></div></div> )}{error && <p className="error-message">{error}</p>}{!isLoading && !error && foundPrimes.length > 0 && ( <div><h2 className="info-message" style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Found {foundPrimes.length} Repunit Prime(s) for N up to {searchedLimit}</h2><div className="prime-result-grid">{foundPrimes.map(n => <PrimeResult key={n} nValue={n} />)}</div></div> )}{!isLoading && !error && foundPrimes.length === 0 && searchedLimit && ( <p className="info-message">No repunit primes found for N up to {searchedLimit}.</p> )}</div><footer className="footer-note"><p>Known repunit primes occur for N = 2, 19, 23, 317, 1031, ...</p><p>Calculations for large N can be very slow.</p></footer></div></div> );
};

// --- Integrated Component for Asmnt 3, 4, 6 ---
const Asmnt_3_4_6 = () => {
    const { useState, useRef } = React;

    const [p1, setP1] = useState('2201');
    const [p2, setP2] = useState('2299');
    const [foundExponents, setFoundExponents] = useState([]);
    const [brocardResult, setBrocardResult] = useState(null);
    const [perfectNumbers, setPerfectNumbers] = useState(null);
    const [isLoadingBrocard, setIsLoadingBrocard] = useState(false);
    const [isLoadingPerfect, setIsLoadingPerfect] = useState(false);
    const [isSearchingMersenne, setIsSearchingMersenne] = useState(false);
    const [mersenneLogs, setMersenneLogs] = useState([]);
    const [error, setError] = useState('');
    const eventSourceRef = useRef(null);

    const handleMersenneSearch = () => {
        setIsSearchingMersenne(true);
        setError('');
        setMersenneLogs([]);
        setFoundExponents([]);
        setBrocardResult(null);
        setPerfectNumbers(null);
        const es = new EventSource(`http://127.0.0.1:5000/mersenne_search/${p1}/${p2}`);
        eventSourceRef.current = es;
        es.addEventListener('update', (event) => {
            const data = JSON.parse(event.data);
            setMersenneLogs(prev => [...prev, data]);
            if (data.message === 'Mersenne search complete.') {
                setIsSearchingMersenne(false);
                es.close();
            }
        });
        es.addEventListener('found', (event) => {
            const data = JSON.parse(event.data);
            setFoundExponents(prev => [...prev, data.exponent]);
            setMersenneLogs(prev => [...prev, { type: 'found', message: `SUCCESS! Found exponent: ${data.exponent}` }]);
        });
        es.onerror = () => {
            setError('Connection to server lost during Mersenne search.');
            setIsSearchingMersenne(false);
            es.close();
        };
    };

    const handleBrocard = async () => {
        setIsLoadingBrocard(true);
        setError('');
        setBrocardResult(null);
        try {
            const response = await fetch('http://127.0.0.1:5000/brocard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ p1: foundExponents[0], p2: foundExponents[1] }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Something went wrong.');
            setBrocardResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoadingBrocard(false);
        }
    };

    const handlePerfect = async () => {
        setIsLoadingPerfect(true);
        setError('');
        setPerfectNumbers(null);
        try {
            const response = await fetch('http://127.0.0.1:5000/perfect_numbers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ primes: foundExponents }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Something went wrong.');
            setPerfectNumbers(data.results);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoadingPerfect(false);
        }
    };

    const areSearchInputsValid = p1 && p2 && !isNaN(p1) && !isNaN(p2);
    const canRunNextSteps = foundExponents.length >= 2;

    return (
        <div className="asmnt-346-container">
            <div className="app-container">
                <header className="header">
                    <h1>Prime Number Explorer</h1>
                    <p>An interactive tool to explore mathematical concepts like Brocard's Conjecture and Perfect Numbers using prime exponents.</p>
                </header>
                <div className="controls-panel">
                    <div className="input-grid">
                        <div className="input-group">
                            <label htmlFor="p1">Search Range Start (p₁)</label>
                            <input id="p1" type="number" value={p1} onChange={e => setP1(e.target.value)} disabled={isSearchingMersenne} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="p2">Search Range End (p₂)</label>
                            <input id="p2" type="number" value={p2} onChange={e => setP2(e.target.value)} disabled={isSearchingMersenne} />
                        </div>
                    </div>
                    <button onClick={handleMersenneSearch} disabled={isSearchingMersenne || !areSearchInputsValid} className="main-button">
                        {isSearchingMersenne ? 'Searching for Mersenne Primes...' : 'Step 1: Find Mersenne Primes'}
                    </button>
                    <div className="button-group">
                        <button onClick={handleBrocard} disabled={!canRunNextSteps || isLoadingBrocard} className="brocard-button">
                            {isLoadingBrocard ? 'Calculating...' : "Step 2: Verify Brocard's"}
                        </button>
                        <button onClick={handlePerfect} disabled={!canRunNextSteps || isLoadingPerfect} className="perfect-button">
                            {isLoadingPerfect ? 'Constructing...' : 'Step 3: Construct Perfect #s'}
                        </button>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                </div>
                <div className="results-panel">
                    {mersenneLogs.length > 0 && (
                        <div className="result-card">
                            <h2>Mersenne Search Log</h2>
                            <div className="log-container">
                                {mersenneLogs.map((log, i) => (
                                    <div key={i} className={`log-entry ${log.type}`}>{log.message}</div>
                                ))}
                            </div>
                        </div>
                    )}
                    {brocardResult && (
                        <div className="result-card">
                            <h2>Brocard's Conjecture Results</h2>
                            <p>Found {brocardResult.primes.length} primes between {brocardResult.range[0].toLocaleString()} and {brocardResult.range[1].toLocaleString()}:</p>
                            <div className="prime-list">
                                {brocardResult.primes.map(p => <span key={p} className="prime-badge">{p.toLocaleString()}</span>)}
                            </div>
                        </div>
                    )}
                    {perfectNumbers && (
                        <div className="result-card">
                            <h2>Perfect Number Construction</h2>
                            <ul className="perfect-list">
                                {perfectNumbers.map(res => (
                                    <li key={res.p}>
                                        <strong>For p = {res.p}:</strong>
                                        {res.error ? (
                                            <span style={{ color: '#ffcdd2', marginLeft: '8px' }}> {res.error}</span>
                                        ) : (
                                            <div style={{ marginTop: '8px', paddingLeft: '10px', borderLeft: '2px solid #4caf50' }}>
                                                <p>
                                                    A {res.digits}-digit perfect number was constructed: <code style={{ background: '#f5f5f5', padding: '2px 5px', borderRadius: '4px', color: '#333' }}>{res.value_str}</code>
                                                </p>
                                                <h4 style={{ marginTop: '12px', marginBottom: '6px' }}>Proper Divisors:</h4>
                                                <div className="factor-container" style={{
                                                    maxHeight: '150px',
                                                    overflowY: 'auto',
                                                    background: '#f0f4f0',
                                                    padding: '8px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #dceddc'
                                                }}>
                                                    <div className="prime-list" style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                                        {res.factors.map((factor, index) => (
                                                            <span key={index} className="prime-badge" style={{ margin: '3px', background: '#66bb6a', color: 'white' }}>{factor}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p style={{ marginTop: '10px', color: '#2e7d32', fontStyle: 'italic' }}>
                                                    <strong>Proof:</strong> {res.proof}
                                                </p>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};



// --- Integrated Component for Asmnt 5 ---
const Asmnt_5 = () => {
    const LogEntry = ({ log }) => ( <div className="log-entry"><span className="log-time">{log.time}</span><span className={`log-message ${log.type}`}>{log.message}</span></div> );
    const [numDigits, setNumDigits] = useState(50);
    const [isSearching, setIsSearching] = useState(false);
    const [logs, setLogs] = useState([]);
    const [foundPrime, setFoundPrime] = useState(null);
    const eventSourceRef = useRef(null);
    const logContainerRef = useRef(null);
    const startSearch = () => { if (isSearching) return; setLogs([]); setFoundPrime(null); setIsSearching(true); const url = `http://127.0.0.1:5000/palindromic_stream_search/${numDigits}`; const es = new EventSource(url); eventSourceRef.current = es; es.onopen = () => { setLogs(prev => [...prev, { type: 'start', message: 'Connection established. Search beginning...' }]); }; es.addEventListener('update', (event) => { const data = JSON.parse(event.data); setLogs(prev => [...prev, data]); }); es.addEventListener('found', (event) => { const data = JSON.parse(event.data); setFoundPrime(data); stopSearch(); }); es.onerror = () => { setLogs(prev => [...prev, { type: 'error', message: 'Connection error. Is the backend server running?' }]); stopSearch(); }; };
    const stopSearch = () => { if (eventSourceRef.current) { eventSourceRef.current.close(); eventSourceRef.current = null; } setIsSearching(false); };
    useEffect(() => { if (logContainerRef.current) { logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight; } }, [logs]);
    useEffect(() => { return () => { if (eventSourceRef.current) { eventSourceRef.current.close(); } }; }, []);
    return ( <div className="asmnt-5-container"><header className="header"><h1>Palindromic Prime Hunter</h1><p>An interactive search for large, palindromic prime numbers. The process is extremely slow, but you can watch the progress live.</p></header><div className="controls"><label>Digits (approx):</label><input type="number" value={numDigits} onChange={(e) => setNumDigits(Number(e.target.value))} disabled={isSearching} />{!isSearching ? ( <button onClick={startSearch} className="start-button">Start Search</button> ) : ( <button onClick={stopSearch} className="stop-button">Stop Search</button> )}</div><div className="search-status"><div className="log-container" ref={logContainerRef}>{logs.map((log, index) => ( <LogEntry key={index} log={log} /> ))}{isSearching && <div className="log-entry log-message">Searching...</div>}</div></div>{foundPrime && ( <div className="result-container"><h2>✨ Prime Found! ✨</h2><div className="result-prime">{foundPrime.prime}</div><div className="result-stats"><span><strong>Digits:</strong> {foundPrime.digits}</span><span><strong>Time:</strong> {foundPrime.time}s</span><span><strong>Attempts:</strong> {Number(foundPrime.attempts).toLocaleString()}</span></div></div> )}</div> );
};

// --- Integrated Component for Asmnt 7 ---
const Asmnt_7 = () => {
    const [number, setNumber] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('http://127.0.0.1:5000/goldbach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ n: number }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'An unknown error occurred.');
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="asmnt-7-container">
            <div className="card">
                <header className="header">
                    <h1>Goldbach's Conjecture</h1>
                    <p>Enter an even number greater than 2, and we'll find two primes that sum up to it.</p>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input
                            type="text"
                            className="input-field"
                            value={number}
                            onChange={e => setNumber(e.target.value)}
                            placeholder="e.g., 998"
                            disabled={isLoading}
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={isLoading || !number}>
                        {isLoading ? 'Calculating...' : 'Find Prime Pair'}
                    </button>
                </form>
                
                {error && <div className="error-message">{error}</div>}

                {result && (
                    <div className="result-container">
                        <div className="result-equation">
                            <span>{result.n.toLocaleString()}</span>
                            <span className="operator">=</span>
                            <span className="prime-badge">{result.p1.toLocaleString()}</span>
                            <span className="operator">+</span>
                            <span className="prime-badge">{result.p2.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Home Page Component ---
const HomePage = () => {
    const questions = [
        { id: 1, path: "/q1", label: "Question 1", title: "Pattern Primes", description: "Find primes of the form 12...n...21." },
        { id: 2, path: "/q2", label: "Question 2", title: "Repunit Primes", description: "Find prime numbers composed only of the digit '1'." },
        { id: 3, path: "/q3", label: "Questions 3, 4, & 6", title: "Mersenne, Brocard & Perfect Numbers", description: "A multi-part exploration of special primes and their properties." },
        { id: 5, path: "/q5", label: "Question 5", title: "Palindromic Primes", description: "Search for primes that read the same forwards and backwards." },
        { id: 7, path: "/q7", label: "Question 7", title: "Goldbach's Conjecture", description: "Express an even number as the sum of two primes." },
    ];

    return (
        <div className="hub-container">
            <header className="hub-header">
                <h1>Mathematical Explorations</h1>
                <p>Select a problem to begin your exploration into the world of prime numbers and conjectures.</p>
            </header>
            <div className="question-grid">
                {questions.map(q => (
                    <Link key={q.id} to={q.path} className="question-card">
                        <h2>{q.label}: {q.title}</h2>
                        <p>{q.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

// --- Wrapper for Question Pages ---
const QuestionPage = ({ children }) => {
    return (
        <div className="question-page-container">
            <Link to="/" className="back-button">&larr; Back to Home</Link>
            {children}
        </div>
    );
};

// --- Main App Component (Router) ---
export default function App() {
    return (
        <>
            <AppStyles />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/q1" element={<QuestionPage><Asmnt1 /></QuestionPage>} />
                    <Route path="/q2" element={<QuestionPage><Asmnt_2 /></QuestionPage>} />
                    <Route path="/q3" element={<QuestionPage><Asmnt_3_4_6 /></QuestionPage>} />
                    <Route path="/q5" element={<QuestionPage><Asmnt_5 /></QuestionPage>} />
                    <Route path="/q7" element={<QuestionPage><Asmnt_7 /></QuestionPage>} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
