import http.server
import socketserver
import os

os.chdir(os.path.join(os.path.dirname(__file__), ".."))

class Handler(http.server.SimpleHTTPRequestHandler):
    def guess_type(self, path):
        if path.endswith((".js", ".mjs")):
            return "text/javascript; charset=utf-8"
        if path.endswith(".css"):
            return "text/css; charset=utf-8"
        if path.endswith(".json"):
            return "application/json; charset=utf-8"
        if path.endswith(".html"):
            return "text/html; charset=utf-8"
        return super().guess_type(path)

with socketserver.TCPServer(("", 8766), Handler) as httpd:
    print("Serving on http://localhost:8766")
    httpd.serve_forever()

