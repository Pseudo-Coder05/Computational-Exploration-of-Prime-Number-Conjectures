import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const LogEntry = ({ log }) => (
    <div className="log-entry">
        <span className="log-time">{log.time}</span>
        <span className={`log-message ${log.type}`}>{log.message}</span>
    </div>
);

export default function App() {
    const [numDigits, setNumDigits] = useState(50);
    const [isSearching, setIsSearching] = useState(false);
    const [logs, setLogs] = useState([]);
    const [foundPrime, setFoundPrime] = useState(null);
    const eventSourceRef = useRef(null);
    const logContainerRef = useRef(null);

    const startSearch = () => {
        if (isSearching) return;

        setLogs([]);
        setFoundPrime(null);
        setIsSearching(true);

        const url = `http://127.0.0.1:5000/stream_search/${numDigits}`;
        const es = new EventSource(url);
        eventSourceRef.current = es;

        es.onopen = () => {
            setLogs(prev => [...prev, { type: 'start', message: 'Connection established. Search beginning...' }]);
        };

        es.addEventListener('update', (event) => {
            const data = JSON.parse(event.data);
            setLogs(prev => [...prev, data]);
        });

        es.addEventListener('found', (event) => {
            const data = JSON.parse(event.data);
            setFoundPrime(data);
            stopSearch();
        });

        es.onerror = () => {
            setLogs(prev => [...prev, { type: 'error', message: 'Connection error. Is the backend server running?' }]);
            stopSearch();
        };
    };

    const stopSearch = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        setIsSearching(false);
    };

    // Auto-scroll the log container
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);

    return (
        <div className="app-container">
            <header className="header">
                <h1>Palindromic Prime Hunter</h1>
                <p>An interactive search for large, palindromic prime numbers. The process is extremely slow, but you can watch the progress live.</p>
            </header>

            <div className="controls">
                <label>Digits (approx):</label>
                <input
                    type="number"
                    value={numDigits}
                    onChange={(e) => setNumDigits(Number(e.target.value))}
                    disabled={isSearching}
                />
                {!isSearching ? (
                    <button onClick={startSearch} className="start-button">Start Search</button>
                ) : (
                    <button onClick={stopSearch} className="stop-button">Stop Search</button>
                )}
            </div>

            <div className="search-status">
                <div className="log-container" ref={logContainerRef}>
                    {logs.map((log, index) => (
                        <LogEntry key={index} log={log} />
                    ))}
                    {isSearching && <div className="log-entry log-message">Searching...</div>}
                </div>
            </div>

            {foundPrime && (
                <div className="result-container">
                    <h2>✨ Prime Found! ✨</h2>
                    <div className="result-prime">{foundPrime.prime}</div>
                    <div className="result-stats">
                        <span><strong>Digits:</strong> {foundPrime.digits}</span>
                        <span><strong>Time:</strong> {foundPrime.time}s</span>
                        <span><strong>Attempts:</strong> {Number(foundPrime.attempts).toLocaleString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
