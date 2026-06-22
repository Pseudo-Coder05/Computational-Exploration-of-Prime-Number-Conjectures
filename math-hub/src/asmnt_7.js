import React, { useState } from 'react';

// --- Embedded CSS for the "Glassmorphism" design ---
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
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .app-container {
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
            padding: 2rem;
        }

        /* The main glass panel */
        .card {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            padding: 2.5rem;
            border-radius: 20px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
            text-align: center;
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #ffffff;
            margin: 0 0 0.5rem 0;
        }

        .header p {
            font-size: 1.1rem;
            color: #b0b0d0;
            margin-bottom: 2rem;
        }

        .input-container {
            position: relative;
        }

        .input-field {
            width: 100%;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            font-size: 1.2rem;
            color: white;
            box-sizing: border-box;
            text-align: center;
            font-family: 'Poppins', sans-serif;
        }

        .submit-button {
            margin-top: 1.5rem;
            width: 100%;
            padding: 1rem;
            font-size: 1.1rem;
            font-weight: 600;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            color: white;
            background: linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045);
            background-size: 200% auto;
            transition: all 0.3s ease-in-out;
        }
        .submit-button:hover:not(:disabled) {
            background-position: right center;
        }
        .submit-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .result-container {
            margin-top: 2rem;
            padding: 1.5rem;
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
            animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .result-equation {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            font-size: 1.5rem;
            font-weight: 500;
        }

        .prime-badge {
            background: #833ab4;
            padding: 0.5rem 1.5rem;
            border-radius: 8px;
            color: white;
        }

        .operator {
            color: #fcb045;
        }
        
        .error-message {
            color: #ffcdd2;
            background: rgba(239, 83, 80, 0.3);
            border: 1px solid rgba(239, 83, 80, 0.5);
            padding: 1rem;
            border-radius: 10px;
            margin-top: 1.5rem;
        }
    `}</style>
);

// --- Main App Component ---
export default function App() {
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
        <>
            <AppStyles />
            <div className="app-container">
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
        </>
    );
}
