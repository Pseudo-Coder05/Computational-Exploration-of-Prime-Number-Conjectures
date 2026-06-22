# app.py
# To run this:
# 1. Install dependencies: pip install Flask Flask-Cors sympy
# 2. Run the server: python app.py

from flask import Flask, jsonify, request
from flask_cors import CORS
from sympy import isprime
import sys

# Increase Python's recursion limit for sympy's primality tests on large numbers
sys.setrecursionlimit(2000)

# Initialize Flask App
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing
CORS(app)

@app.route('/goldbach', methods=['POST'])
def find_goldbach_pair():
    """
    Finds a pair of prime numbers that sum to a given even integer n.
    Expects a JSON payload: {"n": number_string}
    """
    data = request.get_json()
    try:
        n_str = data.get('n')
        if not n_str:
            return jsonify({"error": "Please provide a number."}), 400
        n = int(n_str)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid number provided."}), 400

    # --- Input Validation ---
    if n <= 2 or n % 2 != 0:
        return jsonify({"error": "Input must be an even integer greater than 2."}), 400
    
    # Set a reasonable limit for a web request (e.g., 10^16)
    if n > 10**16:
        return jsonify({"error": "Number is too large for a quick web response. Please use a number up to 16 digits."}), 400

    # --- Goldbach's Conjecture Algorithm ---
    # Handle the special case of n=4
    if n == 4:
        return jsonify({"p1": 2, "p2": 2, "n": n})

    # Iterate through odd numbers starting from 3
    # We only need to check up to n/2
    for p1 in range(3, int(n**(0.5))+ 1, 2):
        if isprime(p1):
            p2 = n - p1
            if isprime(p2):
                # Found a pair!
                return jsonify({"p1": p1, "p2": p2, "n": n})

    # This part should theoretically never be reached if Goldbach's Conjecture is true
    return jsonify({"error": "Could not find a prime pair. (This shouldn't happen!)"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
