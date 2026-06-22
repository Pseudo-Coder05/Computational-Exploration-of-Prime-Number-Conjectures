import React, { useState, useEffect, useRef } from 'react';

// --- Embedded CSS for the design ---
const AppStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        body {
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background: #1a1a2e;
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(131, 58, 180, 0.3), transparent 30%),
                radial-gradient(circle at 80% 90%, rgba(253, 29, 29, 0.3), transparent 40%),
                radial-gradient(circle at 50% 50%, rgba(252, 176, 69, 0.2), transparent 40%);
            color: #e0e0e0;
            min-height: 100vh;
        }

        .app-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .header h1 {
            font-size: 3rem;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 1px;
        }

        .header p {
            font-size: 1.1rem;
            color: #b0b0d0;
            max-width: 600px;
            margin: 0.5rem auto 0;
        }

        /* The main glass panel for controls */
        .controls-panel {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            padding: 2.5rem;
            border-radius: 20px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
        }

        .input-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .input-group label {
            display: block;
            font-weight: 500;
            margin-bottom: 0.75rem;
            color: #e0e0e0;
        }

        .input-group input {
            width: 100%;
            padding: 0.8rem 1rem;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            font-size: 1rem;
            color: white;
            box-sizing: border-box;
            transition: all 0.2s;
        }

        .input-group input:focus {
            outline: none;
            border-color: rgba(131, 58, 180, 0.8);
            box-shadow: 0 0 10px rgba(131, 58, 180, 0.5);
        }
        
        .main-button {
            width: 100%;
            padding: 1rem;
            font-size: 1.1rem;
            font-weight: 600;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            color: white;
            background: linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045);
            background-size: 200% auto;
            margin-bottom: 2rem;
        }
        .main-button:hover:not(:disabled) {
            background-position: right center;
        }

        .button-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }

        .button-group button {
            padding: 0.8rem;
            font-size: 1rem;
            font-weight: 600;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            color: white;
        }

        .button-group button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .brocard-button { background: #833ab4; }
        .perfect-button { background: #fd1d1d; }

        .button-group button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .results-panel { margin-top: 3rem; }
        .result-card {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(15px);
            padding: 2rem;
            border-radius: 20px;
            margin-bottom: 2rem;
            animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }

        .result-card h2 {
            margin-top: 0; color: #ffffff;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            padding-bottom: 1rem; font-size: 1.5rem;
        }
        
        .log-container { max-height: 200px; overflow-y: auto; font-family: monospace; }
        .log-entry.info { color: #82aaff; }
        .log-entry.progress { color: #c3e88d; }
        .log-entry.found { color: #ffcb6b; font-weight: bold; }

        .prime-list { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem; }
        .prime-badge { background-color: rgba(0, 0, 0, 0.3); color: #e0e0e0; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 500; }
        .perfect-list { list-style: none; padding: 0; }
        .perfect-list li { padding: 1rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .perfect-list li:last-child { border-bottom: none; }
        .perfect-list strong { color: #fcb045; }
        .error-message { color: #ffcdd2; background: rgba(239, 83, 80, 0.3); border: 1px solid rgba(239, 83, 80, 0.5); padding: 1rem; border-radius: 10px; margin-top: 2rem; text-align: center; }
    `}</style>
);

export default function App() {
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
            if (data.message === 'Mersenne prime search complete.') {
                setIsSearchingMersenne(false);
                es.close();
            }
        });

        es.addEventListener('found', (event) => {
            const data = JSON.parse(event.data);
            setFoundExponents(prev => [...prev, data.exponent]);
            setMersenneLogs(prev => [...prev, {type: 'found', message: `SUCCESS! Found exponent: ${data.exponent}`}]);
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
        <>
            <AppStyles />
            <div className="app-container">
                <header className="header">
                    <h1>Prime Number Explorer</h1>
                    <p>An interactive tool to explore mathematical concepts like Brocard's Conjecture and Perfect Numbers using prime exponents.</p>
                </header>

                <div className="controls-panel">
                     <div className="input-grid">
                        <div className="input-group">
                            <label htmlFor="p1">Search Range Start (p₁)</label>
                            <input id="p1" type="number" value={p1} onChange={e => setP1(e.target.value)} disabled={isSearchingMersenne}/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="p2">Search Range End (p₂)</label>
                            <input id="p2" type="number" value={p2} onChange={e => setP2(e.target.value)} disabled={isSearchingMersenne}/>
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
                                        {res.error ? <span style={{color: '#ffcdd2'}}> {res.error}</span> : 
                                        <span> A {res.digits}-digit perfect number was constructed. ({res.value_str})</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
