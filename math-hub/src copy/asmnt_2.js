import React, { useState } from 'react';
import './App.css'; // Import the new CSS file

// --- Components ---

const PrimeResult = ({ nValue }) => (
  <div className="prime-result-card">
    <div>
      <h3>
        Found Prime for N = <span>{nValue}</span>
      </h3>
      <p>The number 1 repeated {nValue} times is prime.</p>
    </div>
  </div>
);

// Main App Component
export default function App() {
  // State for prime finding
  const [maxN, setMaxN] = useState(100);
  const [foundPrimes, setFoundPrimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchedLimit, setSearchedLimit] = useState(null);
  // This new state tracks the number that was actually submitted for the search
  const [submittedMaxN, setSubmittedMaxN] = useState(null);

  // --- API Call Functions ---
  const findRepunitPrimes = async () => {
    setIsLoading(true);
    setError(null);
    setFoundPrimes([]);
    setSearchedLimit(null);
    // Store the value of maxN at the moment of submission
    setSubmittedMaxN(maxN); 

    try {
      const response = await fetch(`http://127.0.0.1:5000/find_primes/${maxN}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setFoundPrimes(data.primes_found_for_n || []);
      setSearchedLimit(data.limit_used);
    } catch (err) {
      console.error("Failed to fetch primes:", err);
      setError("Could not connect to the server. Please ensure the Python backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (maxN > 0) findRepunitPrimes();
    else setError("Please enter a number greater than 0.");
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <header className="header">
          <h1>Repunit Prime Finder</h1>
          <p>Finds prime numbers made of only the digit '1'. A repunit I<sub>N</sub> can only be prime if N is prime.</p>
        </header>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-row">
            <input
              type="number"
              value={maxN}
              onChange={(e) => setMaxN(Number(e.target.value))}
              placeholder="Enter max N"
              min="2"
              max="2000"
            />
            <button type="submit" disabled={isLoading} className="primary-button">
              {isLoading ? 'Searching...' : 'Find Primes'}
            </button>
          </div>
           {/* The condition now correctly compares the searched limit against the submitted number */}
           {searchedLimit && submittedMaxN && searchedLimit < submittedMaxN && (
            <p className="warning-message">
              Note: Your input of {submittedMaxN} was above the server's safety limit. The search was performed up to N = {searchedLimit}.
            </p>
          )}
        </form>

        <div className="results-container">
          {isLoading && (
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
            </div>
          )}
          {error && <p className="error-message">{error}</p>}
          {!isLoading && !error && foundPrimes.length > 0 && (
            <div>
              <h2 className="info-message" style={{fontSize: '1.5rem', marginBottom: '1rem'}}>
                Found {foundPrimes.length} Repunit Prime(s) for N up to {searchedLimit}
              </h2>
              <div className="prime-result-grid">
                {foundPrimes.map(n => <PrimeResult key={n} nValue={n} />)}
              </div>
            </div>
          )}
          {!isLoading && !error && foundPrimes.length === 0 && searchedLimit && (
             <p className="info-message">No repunit primes found for N up to {searchedLimit}.</p>
          )}
        </div>
        
        <footer className="footer-note">
            <p>Known repunit primes occur for N = 2, 19, 23, 317, 1031, ...</p>
            <p>Calculations for large N can be very slow.</p>
        </footer>
      </div>
    </div>
  );
}
