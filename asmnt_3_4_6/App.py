# app.py
# To run this:
# 1. Install dependencies: pip install Flask Flask-Cors sympy
# 2. Run the server: python app.py

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from sympy import isprime
import json

# Initialize Flask App
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing for all routes and origins
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/mersenne_search/<int:start>/<int:end>')
def mersenne_search(start, end):
    """
    Streams the search for Mersenne prime exponents in a given range.
    """
    def event_stream():
        yield f"event: update\ndata: {json.dumps({'type': 'info', 'message': f'Starting search for Mersenne prime exponents between {start} and {end}...'})}\n\n"
        
        found_exponents = []
        for p in range(start, end + 1):
            # A necessary condition is that p must be prime
            if isprime(p):
                yield f"event: update\ndata: {json.dumps({'type': 'progress', 'message': f'Testing exponent p = {p}...'})}\n\n"
                
                # This is the very slow part
                mersenne_candidate = (2 ** p) - 1
                if isprime(mersenne_candidate):
                    found_exponents.append(p)
                    # Stream the found exponent back to the client
                    yield f"event: found\ndata: {json.dumps({'exponent': p})}\n\n"
            
            # Stop after finding two for this problem
            if len(found_exponents) >= 2:
                break
        
        yield f"event: update\ndata: {json.dumps({'type': 'info', 'message': 'Mersenne prime search complete.'})}\n\n"

    return Response(event_stream(), mimetype='text/event-stream')


@app.route('/brocard', methods=['POST'])
def brocard_conjecture():
    """
    Finds at least four primes between the squares of two given primes.
    Expects a JSON payload: {"p1": prime1, "p2": prime2}
    """
    data = request.get_json()
    p1 = data.get('p1')
    p2 = data.get('p2')

    # Explicit validation
    if p1 is None or p2 is None or not isprime(p1) or not isprime(p2):
        return jsonify({"error": "Please provide two valid prime numbers."}), 400

    if p1 > p2:
        p1, p2 = p2, p1

    start_num = p1 ** 2
    end_num = p2 ** 2
    
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
    Constructs perfect numbers from a list of prime exponents.
    """
    data = request.get_json()
    prime_exponents = data.get('primes')

    # Explicit validation
    if not prime_exponents or not all(isprime(p) for p in prime_exponents):
        return jsonify({"error": "Please provide a list of valid prime numbers."}), 400

    results = []
    for p in prime_exponents:
        mersenne_candidate = (2 ** p) - 1
        if not isprime(mersenne_candidate):
            results.append({
                "p": p,
                "error": f"2^{p} - 1 is not a Mersenne prime, so a perfect number cannot be formed."
            })
            continue

        perfect_number = 2 ** (p - 1) * mersenne_candidate
        perfect_number_str = str(perfect_number)
        num_digits = len(perfect_number_str)

        results.append({
            "p": p,
            "is_mersenne": True,
            "digits": num_digits,
            "value_str": f"{perfect_number_str[:15]}...{perfect_number_str[-15:]}" if num_digits > 30 else perfect_number_str
        })
        
    return jsonify({"results": results})


if __name__ == '__main__':
    # Bind to all interfaces so frontend can connect from anywhere
    app.run(debug=True, host="0.0.0.0", port=5000)
