# app.py
# To run this:
# 1. Install dependencies: pip install Flask Flask-Cors sympy
# 2. Run the server: python app.py

from flask import Flask, Response
from flask_cors import CORS
from sympy import isprime
import json
import time

app = Flask(__name__)
CORS(app)

def construct_pattern_number(n):
    """Constructs the number by concatenating integers from 1 to n and back to 1."""
    # Using lists and join is more efficient for large n
    ascending_parts = [str(i) for i in range(1, n + 1)]
    descending_parts = [str(i) for i in range(n - 1, 0, -1)]
    full_string = "".join(ascending_parts + descending_parts)
    return int(full_string)

def calculate_digits(n):
    """Calculates the total number of digits in the patterned number."""
    if n < 1: return 0
    # Sum of digits for numbers from 1 to n-1 (which appears twice)
    digits_in_sequence = sum(len(str(i)) for i in range(1, n)) * 2
    # Add the digits in the number n itself
    digits_in_n = len(str(n))
    return digits_in_sequence + digits_in_n

@app.route('/search/<int:start>/<int:end>')
def search(start, end):
    """Streams the search for the patterned prime number."""
    def event_stream():
        yield f"event: update\ndata: {json.dumps({'type': 'info', 'message': f'Starting search in range {start} to {end}...'})}\n\n"
        yield f"event: update\ndata: {json.dumps({'type': 'warning', 'message': 'This is a computationally intensive search and will take a very long time.'})}\n\n"
        
        start_time = time.time()
        
        for n in range(start, end + 1):
            elapsed_time = time.time() - start_time
            # Send a progress update for each number being checked
            yield f"event: update\ndata: {json.dumps({'type': 'progress', 'message': f'[{elapsed_time:.2f}s] Checking n = {n}'})}\n\n"
            
            # This is the extremely slow part
            candidate = construct_pattern_number(n)
            if isprime(candidate):
                digits = calculate_digits(n)
                found_data = {
                    'n': n,
                    'digits': digits,
                    'sample': f"{str(candidate)[:15]}...{str(candidate)[-15:]}"
                }
                yield f"event: found\ndata: {json.dumps(found_data)}\n\n"
                # We can stop after finding one, or continue searching
                # For this problem, we'll stop.
                break
        
        yield f"event: update\ndata: {json.dumps({'type': 'info', 'message': 'Search complete.'})}\n\n"

    return Response(event_stream(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
