import React, { useState, useEffect, useRef } from 'react';
// Import routing components from the library you just installed
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// --- Embedded CSS (no changes needed here) ---
const AppStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        body { margin: 0; font-family: 'Poppins', sans-serif; background-color: #f0f2f5; color: #333; }
        .hub-container { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; }
        .hub-header { text-align: center; margin-bottom: 3rem; }
        .hub-header h1 { font-size: 3rem; font-weight: 700; color: #2c3e50; }
        .hub-header p { font-size: 1.1rem; color: #7f8c8d; }
        .question-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        /* The question card is now a link, so we remove the cursor property and add text-decoration none */
        .question-card { background: #ffffff; border-radius: 16px; padding: 2rem; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); transition: all 0.3s ease; border: 1px solid #e0e0e0; text-decoration: none; }
        .question-card:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12); border-color: #3498db; }
        .question-card h2 { margin: 0 0 0.5rem 0; color: #3498db; }
        .question-card p { color: #7f8c8d; line-height: 1.6; }
        .question-page-container { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .back-button { display: inline-block; margin: 2rem; padding: 0.5rem 1rem; background: #7f8c8d; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; transition: background-color 0.2s; text-decoration: none; }
        .back-button:hover { background: #2c3e50; }
        .pattern-prime-container { font-family: 'Roboto Mono', monospace; background-color: #0c0c1d; color: #e0e0ff; background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); padding: 2rem; border-radius: 20px; }
        .pattern-prime-container .card { background: rgba(15, 15, 35, 0.8); border: 1px solid #404080; backdrop-filter: blur(10px); border-radius: 20px; padding: 2.5rem; box-shadow: 0 0 40px rgba(0, 240, 255, 0.2); }
        .pattern-prime-container .header h1 { font-family: 'Orbitron', sans-serif; font-size: 2.5rem; color: #00f0ff; text-shadow: 0 0 10px #00f0ff; margin: 0; }
        .pattern-prime-container .controls-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; align-items: end; margin-bottom: 2rem; }
        .pattern-prime-container .input-group label { display: block; font-weight: 500; margin-bottom: 0.5rem; color: #a0a0c0; }
        .pattern-prime-container .input-group input { width: 100%; padding: 0.8rem; font-size: 1rem; font-family: 'Roboto Mono', monospace; background: #101028; border: 1px solid #404080; border-radius: 8px; color: #e0e0ff; box-sizing: border-box; }
        .pattern-prime-container .search-button { width: 100%; padding: 0.8rem; font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 700; border: none; border-radius: 8px; background: #00f0ff; color: #0c0c1d; cursor: pointer; transition: all 0.2s; box-shadow: 0 0 15px #00f0ff; }
        .pattern-prime-container .search-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 25px #00f0ff; }
        .pattern-prime-container .search-button:disabled { background: #404080; box-shadow: none; color: #a0a0c0; cursor: not-allowed; }
        .pattern-prime-container .log-container { background: rgba(0, 0, 0, 0.3); border: 1px solid #404080; border-radius: 12px; padding: 1.5rem; height: 200px; overflow-y: auto; margin-bottom: 2rem; }
        .pattern-prime-container .log-entry { margin-bottom: 0.5rem; }
        .pattern-prime-container .log-entry.info { color: #82aaff; }
        .pattern-prime-container .log-entry.progress { color: #c3e88d; }
        .pattern-prime-container .log-entry.warning { color: #ffcb6b; }
        .pattern-prime-container .log-entry.found { color: #00ffa0; font-weight: bold; }
        .pattern-prime-container .log-entry.error { color: #ff5572; }
        .pattern-prime-container .result-card { background: linear-gradient(145deg, #2e005c, #5c004b); border: 1px solid #ff50a0; padding: 2rem; border-radius: 12px; text-align: center; }
        .pattern-prime-container .result-card h2 { font-family: 'Orbitron', sans-serif; margin: 0 0 1rem 0; color: #00ffa0; font-size: 1.5rem; }
        .pattern-prime-container .result-details dt { color: #a0a0c0; margin-top: 1rem; }
        .pattern-prime-container .result-details dd { margin: 0.25rem 0 0 0; font-size: 1.2rem; font-weight: 700; word-break: break-all; }
    `}</style>
);

// --- Placeholder Components ---
const Placeholder = ({ title }) => ( <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px' }}><h2>{title}</h2><p>The component for this question would be integrated here.</p></div> );
const RepunitPrimes = () => <Placeholder title="Question 2: Repunit Primes" />;
const MersenneSuite = () => <Placeholder title="Questions 3, 4, & 6: Mersenne, Brocard & Perfect Numbers" />;
const GoldbachConjecture = () => <Placeholder title="Question 7: Goldbach's Conjecture" />;
const PalindromicPrimes = () => <Placeholder title="Question 5: Palindromic Primes" />;

// --- Integrated Component for Question 1 (Pattern Primes) ---
const PatternPrimes = () => {
    const [startRange, setStartRange] = useState('1000');
    const [endRange, setEndRange] = useState('3000');
    const [logs, setLogs] = useState([]);
    const [result, setResult] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const eventSourceRef = useRef(null);
    const logContainerRef = useRef(null);
    const handleSearch = () => { setIsSearching(true); setLogs([]); setResult(null); const es = new EventSource(`http://127.0.0.1:5000/search/${startRange}/${endRange}`); eventSourceRef.current = es; es.addEventListener('update', (event) => { const data = JSON.parse(event.data); setLogs(prev => [...prev, data]); if (data.message === 'Search complete.') { setIsSearching(false); es.close(); } }); es.addEventListener('found', (event) => { const data = JSON.parse(event.data); setResult(data); setIsSearching(false); es.close(); }); es.onerror = () => { setLogs(prev => [...prev, { type: 'error', message: 'Connection to server lost.' }]); setIsSearching(false); es.close(); }; };
    useEffect(() => { if (logContainerRef.current) { logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight; } }, [logs]);
    return ( <div className="pattern-prime-container"><div className="card"><header className="header"><h1>Pattern Prime Hunter</h1><p>Search for the next prime number of the form 12...n...21.</p></header><div className="controls-grid"><div className="input-group"><label htmlFor="start">Start of Range</label><input id="start" type="number" value={startRange} onChange={(e) => setStartRange(e.target.value)} disabled={isSearching} /></div><div className="input-group"><label htmlFor="end">End of Range</label><input id="end" type="number" value={endRange} onChange={(e) => setEndRange(e.target.value)} disabled={isSearching} /></div><button onClick={handleSearch} className="search-button" disabled={isSearching}>{isSearching ? 'Searching...' : 'Launch Search'}</button></div><div className="results-panel"><div className="log-container" ref={logContainerRef}>{logs.map((log, i) => ( <div key={i} className={`log-entry ${log.type}`}>{log.message}</div> ))}</div>{result && ( <div className="result-card"><h2>Prime Found!</h2><dl className="result-details"><div><dt>Value of n</dt><dd>{result.n}</dd></div><div><dt>Total Digits</dt><dd>{result.digits.toLocaleString()}</dd></div><div><dt>Number Sample</dt><dd>{result.sample}</dd></div></dl></div> )}</div></div></div> );
};

// --- New Home Page Component ---
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
                    // Use the Link component for navigation instead of a div
                    <Link key={q.id} to={q.path} className="question-card">
                        <h2>{q.label}: {q.title}</h2>
                        <p>{q.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

// --- New Wrapper for Question Pages ---
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
            {/* BrowserRouter manages the URL and history */}
            <BrowserRouter>
                {/* Routes defines all the possible pages */}
                <Routes>
                    {/* Each Route maps a URL path to a component */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/q1" element={<QuestionPage><PatternPrimes /></QuestionPage>} />
                    <Route path="/q2" element={<QuestionPage><RepunitPrimes /></QuestionPage>} />
                    <Route path="/q3" element={<QuestionPage><MersenneSuite /></QuestionPage>} />
                    <Route path="/q5" element={<QuestionPage><PalindromicPrimes /></QuestionPage>} />
                    <Route path="/q7" element={<QuestionPage><GoldbachConjecture /></QuestionPage>} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
