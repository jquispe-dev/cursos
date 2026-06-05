from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

PORT = int(os.environ.get("PORT", 8080))
server = HTTPServer(("", PORT), SimpleHTTPRequestHandler)
print(f"Escuchando en :{PORT}")
server.serve_forever()