# Computational Exploration of Prime Number Conjectures

A full-stack web application implementing solutions to 7 problems in prime number theory, built as part of a coursework assignment. The backend performs the actual number-theoretic computation in Python; the frontend (React) provides an interactive interface to run each search and visualize results, including real-time progress streaming for computationally intensive searches.

## Problems Covered

1. **Pattern Primes** — Searches for primes of the form `123...n...321` (ascending then descending digit sequence), streaming live progress via Server-Sent Events.
2. **Repunit Primes** — Finds primes composed entirely of the digit 1 (e.g., `11`, `1111111111111111111`), using the property that a repunit can only be prime if its length N is prime.
3. **Mersenne Primes** — Searches for prime exponents `p` such that `2^p - 1` is also prime, streaming progress in real time.
4. **Brocard's Conjecture** — Given two Mersenne prime exponents, verifies that at least four primes exist between their squares.
5. **Perfect Numbers** — Constructs perfect numbers from Mersenne primes via the Euclid-Euler theorem and displays their proper divisors.
6. **Palindromic Primes** — Searches for large primes that read the same forwards and backwards (at least 50 digits), streaming attempt counts and elapsed time live.
7. **Goldbach's Conjecture** — Given an even integer greater than 2, finds a pair of primes that sum to it.

## Tech Stack

- **Backend:** Python, Flask, Flask-CORS, SymPy, GMPY2
- **Frontend:** React, React Router

## Project Structure
```Computational-Exploration-of-Prime-Number-Conjectures/
├── math-hub/
│   ├── public/
│   ├── src/
│   │   └── App.js           # React frontend (all 5 pages combined)
│   ├── package.json
│   └── .gitignore
├── app.py                   # Flask backend with all API endpoints
├── .gitignore
└── README.md```
## Running the Project Locally

### Backend

```bash
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install Flask Flask-Cors sympy gmpy2
python app.py
```

The backend will run on `http://127.0.0.1:5000`.

### Frontend

```bash
cd math-hub
npm install
npm start
```

The frontend will run on `http://localhost:3000` and communicate with the backend automatically.

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/search/<start>/<end>` | GET (SSE) | Streams the search for a pattern prime in the given range of `n` |
| `/find_primes/<max_n>` | GET | Finds repunit primes for N up to `max_n` (capped at 2000) |
| `/mersenne_search/<start>/<end>` | GET (SSE) | Streams the search for Mersenne prime exponents in the given range |
| `/brocard` | POST | Verifies Brocard's Conjecture between the squares of two given primes |
| `/perfect_numbers` | POST | Constructs perfect numbers from a list of prime exponents |
| `/palindromic_stream_search/<num_digits>` | GET (SSE) | Streams the search for a palindromic prime with at least `num_digits` digits |
| `/goldbach` | POST | Finds a pair of primes summing to a given even integer |

## Notes

- Server-Sent Events (SSE) are used for computationally intensive searches (pattern primes, Mersenne primes, palindromic primes) to stream live progress instead of blocking on a single long request.
- Large-integer primality testing uses `gmpy2` for performance and `sympy.isprime` for smaller/general cases.