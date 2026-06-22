# app.py
# To run this:
# 1. Install dependencies: pip install Flask Flask-Cors sympy
# 2. Run the server: python app.py

from flask import Flask, Response
from flask_cors import CORS
from sympy import isprime
import time
import random
import json

# Initialize Flask App
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing to allow the React app to connect
CORS(app,origins="*")

@app.route('/stream_search/<int:num_digits>')
def stream_search(num_digits):
    """
    This endpoint uses Server-Sent Events (SSE) to stream the search progress.
    It will keep the connection open and push updates to the client.
    """
    def generate_events():
        """The generator function that does the work and yields events."""
        # --- The core logic from your original script ---
        if num_digits % 2 == 0:
            target_digits = num_digits + 1
        else:
            target_digits = num_digits

        half_len = target_digits // 2
        low = 10**(half_len - 1)
        high = 10**half_len - 1

        # Send an initial message to the client
        initial_data = {
            "message": f"Starting search for a {target_digits}-digit palindromic prime...",
            "type": "start"
        }
        yield f"event: update\ndata: {json.dumps(initial_data)}\n\n"

        attempts = 0
        start_time = time.time()

        while True:
            attempts += 1
            first_half_str = str(random.randint(low, high))

            # We only need to check middle digits that can be the last digit of a prime
            for middle_digit in ['1', '3', '7', '9']:
                palindrome_str = first_half_str + middle_digit + first_half_str[::-1]
                
                # Send a progress update every 100 candidates tested
                if (attempts * 4) % 100 == 0:
                    elapsed_time = time.time() - start_time
                    progress_data = {
                        "message": f"Attempt #{attempts*4:,}: Testing {palindrome_str[:15]}...{palindrome_str[-15:]}",
                        "type": "progress",
                        "time": f"{elapsed_time:.2f}s"
                    }
                    # Yield the data in SSE format
                    yield f"event: update\ndata: {json.dumps(progress_data)}\n\n"

                # The intensive primality test
                candidate = int(palindrome_str)
                if isprime(candidate):
                    end_time = time.time()
                    found_data = {
                        "prime": str(candidate),
                        "digits": len(palindrome_str),
                        "time": f"{end_time - start_time:.2f}",
                        "attempts": attempts * 4
                    }
                    # Yield the final "found" event and stop
                    yield f"event: found\ndata: {json.dumps(found_data)}\n\n"
                    return # Exit the generator

    # Return a streaming response
    return Response(generate_events(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
