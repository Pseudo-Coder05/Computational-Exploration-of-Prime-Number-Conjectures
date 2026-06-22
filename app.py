# app.py
# This is the single, unified backend for all your assignments.
# To run this:
# 1. Install dependencies: pip install Flask Flask-Cors sympy gmpy2
# 2. Run the server: python app.py

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from sympy import isprime
import gmpy2 # Using gmpy2 for some intensive primality tests
import json
import time
import sys
import logging
import random

# --- App Initialization ---
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing for all routes
CORS(app)
# Set up basic logging for cleaner output
logging.basicConfig(level=logging.INFO)
# Increase Python's recursion limit for certain primality tests
sys.setrecursionlimit(2000)


# --- Helper Functions ---

def construct_pattern_number(n):
    """Helper for Asmnt 1: Constructs the 12...n...21 number."""
    ascending_parts = [str(i) for i in range(1, n + 1)]
    descending_parts = [str(i) for i in range(n - 1, 0, -1)]
    full_string = "".join(ascending_parts + descending_parts)
    return int(full_string)

def calculate_digits(n):
    """Helper for Asmnt 1: Calculates digits in the patterned number."""
    if n < 1: return 0
    digits_in_sequence = sum(len(str(i)) for i in range(1, n)) * 2
    digits_in_n = len(str(n))
    return digits_in_sequence + digits_in_n

def truncate_number_str(num_str):
    """Helper to truncate a number string if it's longer than 10 digits."""
    if len(num_str) > 10:
        return f"{num_str[:5]}...{num_str[-5:]}"
    return num_str


# --- API Endpoints for Each Assignment ---

# Endpoint for Asmnt 1: Pattern Primes
@app.route('/search/<int:start>/<int:end>')
def search_pattern_primes(start, end):
    """Streams the search for the patterned prime number."""
    def event_stream():
        yield f"event: update\ndata: {json.dumps({'type': 'info', 'message': f'Starting search in range {start} to {end}...'})}\n\n"
        yield f"event: update\ndata: {json.dumps({'type': 'warning', 'message': 'This is a computationally intensive search.'})}\n\n"
        start_time = time.time()
        for n in range(start, end + 1):
            elapsed_time = time.time() - start_time
            yield f"event: update\ndata: {json.dumps({'type': 'progress', 'message': f'[{elapsed_time:.2f}s] Checking n = {n}'})}\n\n"
            candidate = construct_pattern_number(n)
            # Using gmpy2 for this intensive test
            if gmpy2.is_prime(candidate):
                digits = calculate_digits(n)
                found_data = {'n': n, 'digits': digits, 'sample': f"{str(candidate)[:15]}...{str(candidate)[-15:]}"}
                yield f"event: found\ndata: {json.dumps(found_data)}\n\n"
                break
        yield f"event: update\ndata: {json.dumps({'type': 'info', 'message': 'Search complete.'})}\n\n"
    return Response(event_stream(), mimetype='text/event-stream')

# Endpoint for Asmnt 2: Repunit Primes
@app.route('/find_primes/<int:max_n>', methods=['GET'])
def find_repunit_primes(max_n):
    """API endpoint to find repunit primes."""
    if max_n > 2000: max_n = 2000
    found_primes = []
    for n_val in range(2, max_n + 1):
        if isprime(n_val):
            try:
                repunit_num = (10**n_val - 1) // 9
                if isprime(repunit_num):
                    found_primes.append(n_val)
            except OverflowError:
                break
    return jsonify({"primes_found_for_n": found_primes, "limit_used": max_n})

# Endpoints for Asmnt 3, 4, 6: Mersenne, Brocard, Perfect
@app.route('/mersenne_search/<int:start>/<int:end>')
def mersenne_search(start, end):
    """Streams the search for Mersenne prime exponents."""
    def event_stream():
        yield f"event: update\ndata: {json.dumps({'type': 'info', 'message': f'Starting Mersenne search between {start} and {end}...'})}\n\n"
        found_exponents = []
        for p in range(start, end + 1):
            if isprime(p):
                yield f"event: update\ndata: {json.dumps({'type': 'progress', 'message': f'Testing exponent p = {p}...'})}\n\n"
                mersenne_candidate = (2 ** p) - 1
                if isprime(mersenne_candidate):
                    found_exponents.append(p)
                    yield f"event: found\ndata: {json.dumps({'exponent': p})}\n\n"
            if len(found_exponents) >= 2:
                break
        yield f"event: update\ndata: {json.dumps({'type': 'info', 'message': 'Mersenne search complete.'})}\n\n"
    return Response(event_stream(), mimetype='text/event-stream')

@app.route('/brocard', methods=['POST'])
def brocard_conjecture():
    """Finds primes between squares of two given primes."""
    data = request.get_json()
    p1, p2 = data.get('p1'), data.get('p2')
    if not all([p1, p2, isprime(p1), isprime(p2)]):
        return jsonify({"error": "Please provide two valid prime numbers."}), 400
    if p1 > p2: p1, p2 = p2, p1
    start_num, end_num = p1 ** 2, p2 ** 2
    found_primes = []
    for num in range(start_num + 1, end_num):
        if isprime(num):
            found_primes.append(num)
            if len(found_primes) == 4:
                break
    if len(found_primes) < 4:
        return jsonify({"error": f"Could not find four primes. Only found {len(found_primes)}."}), 404
    return jsonify({"primes": found_primes, "range": [start_num, end_num]})

@app.route('/perfect_numbers', methods=['POST'])
def perfect_numbers():
    """
    Constructs perfect numbers, finds their proper divisors, and sends
    the truncated list of divisors to the frontend.
    """
    data = request.get_json()
    prime_exponents = data.get('primes')
    if not prime_exponents or not all(isprime(p) for p in prime_exponents):
        return jsonify({"error": "Please provide a list of valid prime numbers."}), 400
    
    results = []
    for p in prime_exponents:
        mersenne_candidate = (2 ** p) - 1
        if not isprime(mersenne_candidate):
            results.append({"p": p, "error": f"2^{p} - 1 is not a Mersenne prime."})
            continue
        
        perfect_number = 2 ** (p - 1) * mersenne_candidate

        # Generate all divisors from the prime factors 2 and the Mersenne prime
        divisors = set()
        for i in range(p):
            divisors.add(2**i)
            divisors.add(2**i * mersenne_candidate)
        
        # A perfect number is the sum of its *proper* divisors,
        # so we remove the number itself from the set of all divisors.
        divisors.remove(perfect_number)
        
        sorted_divisors = sorted(list(divisors))
        
        # Truncate each factor if it's too long
        truncated_factors = [truncate_number_str(str(d)) for d in sorted_divisors]
        
        p_str = str(perfect_number)
        
        results.append({
            "p": p, 
            "digits": len(p_str), 
            "value_str": truncate_number_str(p_str),
            "factors": truncated_factors,
            "proof": "The sum of these proper divisors equals the perfect number itself."
        })
        
    return jsonify({"results": results})

# Endpoint for Asmnt 5: Palindromic Primes
@app.route('/palindromic_stream_search/<int:num_digits>')
def palindromic_stream_search(num_digits):
    """Streams the search for a large palindromic prime."""
    def generate_events():
        target_digits = num_digits + 1 if num_digits % 2 == 0 else num_digits
        half_len = target_digits // 2
        low, high = 10**(half_len - 1), 10**half_len - 1
        yield f"event: update\ndata: {json.dumps({'type': 'info', 'message': f'Starting search for a {target_digits}-digit palindromic prime...'})}\n\n"
        attempts = 0
        start_time = time.time()
        while True:
            attempts += 1
            first_half = str(random.randint(low, high))
            for mid_digit in ['1', '3', '7', '9']:
                p_str = first_half + mid_digit + first_half[::-1]
                if (attempts * 4) % 100 == 0:
                    elapsed = time.time() - start_time
                    yield f"event: update\ndata: {json.dumps({'type': 'progress', 'message': f'Attempt #{attempts*4:,}: Testing {p_str[:15]}...'})}\n\n"
                candidate = int(p_str)
                if isprime(candidate):
                    elapsed = time.time() - start_time
                    yield f"event: found\ndata: {json.dumps({'prime': p_str, 'digits': len(p_str), 'time': f'{elapsed:.2f}', 'attempts': attempts * 4})}\n\n"
                    return
    return Response(generate_events(), mimetype='text/event-stream')

# Endpoint for Asmnt 7: Goldbach's Conjecture
@app.route('/goldbach', methods=['POST'])
def find_goldbach_pair():
    """Finds a pair of primes that sum to a given even integer."""
    data = request.get_json()
    try:
        n = int(data.get('n'))
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid number provided."}), 400
    if n <= 2 or n % 2 != 0:
        return jsonify({"error": "Input must be an even integer greater than 2."}), 400
    if n > 10**16:
        return jsonify({"error": "Number is too large for a quick response (max 16 digits)."}), 400
    if n == 4:
        return jsonify({"p1": 2, "p2": 2, "n": n})
    for p1 in range(3, n // 2 + 1, 2):
        if isprime(p1):
            p2 = n - p1
            if isprime(p2):
                return jsonify({"p1": p1, "p2": p2, "n": n})
    return jsonify({"error": "Could not find a prime pair."}), 500


# --- Main Execution ---
if __name__ == '__main__':
    # Runs the single server on port 5000
    app.run(debug=True, port=5000)

