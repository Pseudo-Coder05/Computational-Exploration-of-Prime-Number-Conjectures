# app.py
# To run this:
# 1. Install dependencies: pip install Flask Flask-Cors sympy
# 2. Run the server: python app.py

from flask import Flask, jsonify
from flask_cors import CORS
from sympy import isprime
import logging

# Initialize Flask App
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) to allow requests from the React frontend
CORS(app,origins="*")

# Set up basic logging
logging.basicConfig(level=logging.INFO)

@app.route('/find_primes/<int:max_n>', methods=['GET'])
def find_primes_route(max_n):
    """
    API endpoint to find repunit primes.
    A repunit number is of the form (10^N - 1) / 9.
    This function checks for primes where N is also prime, up to max_n.
    """
    app.logger.info(f"Received request to find repunit primes up to N = {max_n}")
    
    # The server limit is set to 2000.
    if max_n > 2000:
        app.logger.warning(f"Input {max_n} exceeds the limit of 2000. Capping at 2000.")
        max_n = 2000
        
    found_primes = []
    
    # The problem states we only need to check for N being prime.
    for n_val in range(2, max_n + 1):
        # First, check if the number of digits 'N' is prime
        if isprime(n_val):
            app.logger.info(f"Checking prime N = {n_val}...")
            # Calculate the repunit number: I_n = (10^n - 1) / 9
            try:
                repunit_num = (10**n_val - 1) // 9
                
                # Now, check if the resulting repunit number is prime
                if isprime(repunit_num):
                    app.logger.info(f"Found a repunit prime for N = {n_val}")
                    found_primes.append(n_val)
            except OverflowError:
                app.logger.error(f"OverflowError for N = {n_val}. Number is too large to compute.")
                break # Stop if numbers get too big for standard types

    app.logger.info(f"Found {len(found_primes)} repunit primes: {found_primes}")
    
    # Return the list of N values that result in a repunit prime
    return jsonify({
        "primes_found_for_n": found_primes,
        "limit_used": max_n
    })

# This allows the script to be run directly
if __name__ == '__main__':
    # Runs the Flask app on localhost, port 5000
    app.run(debug=True, port=5000)
