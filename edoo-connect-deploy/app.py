from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import requests
import os
import subprocess
import threading
import time
import signal
import sys

app = Flask(__name__)
CORS(app, origins=["*"])

# Configuración
NODE_BACKEND_URL = "http://localhost:3001"
NODE_PROCESS = None
STATIC_DIR = "/home/ubuntu/edoo-connect-deploy/static"

def start_node_backend():
    """Iniciar el backend de Node.js"""
    global NODE_PROCESS
    try:
        # Cambiar al directorio del backend
        backend_dir = "/home/ubuntu/edoo-connect/backend"
        
        # Iniciar el proceso de Node.js
        NODE_PROCESS = subprocess.Popen(
            ["npm", "run", "prod"],
            cwd=backend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env={**os.environ, "NODE_ENV": "production"}
        )
        
        # Esperar un poco para que el servidor se inicie
        time.sleep(5)
        print("✅ Backend Node.js iniciado correctamente")
        
    except Exception as e:
        print(f"❌ Error iniciando backend Node.js: {e}")

def stop_node_backend():
    """Detener el backend de Node.js"""
    global NODE_PROCESS
    if NODE_PROCESS:
        NODE_PROCESS.terminate()
        NODE_PROCESS.wait()
        print("🛑 Backend Node.js detenido")

# Iniciar el backend de Node.js en un hilo separado
def init_backend():
    backend_thread = threading.Thread(target=start_node_backend)
    backend_thread.daemon = True
    backend_thread.start()

# Manejar señales para limpiar procesos
def signal_handler(sig, frame):
    print('🔄 Cerrando aplicación...')
    stop_node_backend()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

@app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
def proxy_to_node(path):
    """Proxy todas las peticiones de API al backend de Node.js"""
    try:
        # Construir la URL completa
        url = f"{NODE_BACKEND_URL}/api/{path}"
        
        # Obtener los parámetros de la petición
        params = request.args.to_dict()
        headers = dict(request.headers)
        
        # Remover headers que pueden causar problemas
        headers.pop('Host', None)
        headers.pop('Content-Length', None)
        
        # Realizar la petición al backend de Node.js
        if request.method == 'GET':
            response = requests.get(url, params=params, headers=headers, timeout=30)
        elif request.method == 'POST':
            response = requests.post(url, json=request.get_json(), params=params, headers=headers, timeout=30)
        elif request.method == 'PUT':
            response = requests.put(url, json=request.get_json(), params=params, headers=headers, timeout=30)
        elif request.method == 'DELETE':
            response = requests.delete(url, params=params, headers=headers, timeout=30)
        elif request.method == 'PATCH':
            response = requests.patch(url, json=request.get_json(), params=params, headers=headers, timeout=30)
        
        # Devolver la respuesta
        return response.json(), response.status_code
        
    except requests.exceptions.ConnectionError:
        return jsonify({
            "success": False,
            "message": "Backend no disponible. Iniciando...",
            "error": "CONNECTION_ERROR"
        }), 503
    except requests.exceptions.Timeout:
        return jsonify({
            "success": False,
            "message": "Timeout en la petición al backend",
            "error": "TIMEOUT"
        }), 504
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Error interno del servidor",
            "error": str(e)
        }), 500

@app.route('/health')
def health_check():
    """Verificar el estado de salud del sistema completo"""
    try:
        # Verificar el backend de Node.js
        response = requests.get(f"{NODE_BACKEND_URL}/api/health", timeout=5)
        node_status = response.status_code == 200
        node_data = response.json() if node_status else None
        
        return jsonify({
            "success": True,
            "message": "EdooConnect funcionando correctamente",
            "services": {
                "flask_gateway": True,
                "node_backend": node_status,
                "database": node_data.get("success", False) if node_data else False
            },
            "timestamp": time.time()
        })
    except:
        return jsonify({
            "success": False,
            "message": "Problemas de conectividad",
            "services": {
                "flask_gateway": True,
                "node_backend": False,
                "database": False
            },
            "timestamp": time.time()
        }), 503

# Servir archivos estáticos del frontend
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """Servir archivos de assets (CSS, JS, etc.)"""
    return send_from_directory(os.path.join(STATIC_DIR, 'assets'), filename)

@app.route('/favicon.ico')
def serve_favicon():
    """Servir favicon"""
    return send_from_directory(STATIC_DIR, 'favicon.ico')

# Catch-all route para servir la aplicación React
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    """Servir la aplicación React para todas las rutas no API"""
    # Si es una ruta de API, no servir React
    if path.startswith('api/') or path.startswith('health'):
        return jsonify({"error": "Endpoint no encontrado"}), 404
    
    # Servir index.html para todas las rutas de React Router
    index_path = os.path.join(STATIC_DIR, 'index.html')
    if os.path.exists(index_path):
        return send_file(index_path)
    else:
        return jsonify({
            "error": "Frontend no encontrado",
            "message": "La aplicación React no está disponible"
        }), 404

if __name__ == '__main__':
    print("🚀 Iniciando EdooConnect...")
    
    # Verificar que el frontend existe
    if os.path.exists(STATIC_DIR):
        print("✅ Frontend encontrado")
    else:
        print("⚠️ Frontend no encontrado en", STATIC_DIR)
    
    # Inicializar el backend de Node.js
    init_backend()
    
    # Iniciar Flask
    app.run(host='0.0.0.0', port=5000, debug=False)
