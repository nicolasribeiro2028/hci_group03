"""Vercel function for POST /plan (the page calls /plan, vercel.json rewrites it here). Runs the Gurobi planner in solver/plan.py."""
import json
import os
import sys
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'solver'))


class handler(BaseHTTPRequestHandler):
    def _send(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        try:
            n = int(self.headers.get('content-length') or 0)
            req = json.loads(self.rfile.read(n) or b'{}')
            from plan import solve
            self._send(200, solve(req))
        except Exception as e:  # the page falls back to its own search when this fails
            self._send(500, {'error': str(e)[:300]})

    def do_GET(self):
        self._send(405, {'error': 'POST only'})
