from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os
import time
import json
import hashlib
import jwt
from datetime import datetime, timedelta
import sqlite3
from contextlib import contextmanager
import traceback

app = Flask(__name__)
CORS(app, origins=["*"])

# Configuración
SECRET_KEY = "edoo_connect_production_secret_key_2024"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")
DB_PATH = os.path.join("/tmp", "edooconnect.db")  # Usar /tmp para evitar problemas de permisos

print(f"📁 Base directory: {BASE_DIR}")
print(f"📁 Static directory: {STATIC_DIR}")
print(f"📁 Database path: {DB_PATH}")

# Inicializar base de datos SQLite
def init_database():
    """Inicializar la base de datos SQLite"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Tabla de usuarios
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                is_premium BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabla de simulaciones
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS simulations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                wizard_data TEXT,
                report_data TEXT,
                status TEXT DEFAULT 'draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        print("✅ Base de datos SQLite inicializada correctamente")
        return True
    except Exception as e:
        print(f"❌ Error inicializando base de datos: {e}")
        traceback.print_exc()
        return False

@contextmanager
def get_db():
    """Context manager para conexiones a la base de datos"""
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        yield conn
    except Exception as e:
        print(f"Database error: {e}")
        if conn:
            conn.rollback()
        raise
    finally:
        if conn:
            conn.close()

def hash_password(password):
    """Hash de contraseña"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed):
    """Verificar contraseña"""
    return hashlib.sha256(password.encode()).hexdigest() == hashed

def generate_token(user_id):
    """Generar token JWT"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    """Verificar token JWT"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except Exception as e:
        print(f"Token verification error: {e}")
        return None

def require_auth(f):
    """Decorador para rutas que requieren autenticación"""
    def decorated_function(*args, **kwargs):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({'success': False, 'message': 'Token requerido'}), 401
            
            token = auth_header.split(' ')[1]
            user_id = verify_token(token)
            if not user_id:
                return jsonify({'success': False, 'message': 'Token inválido'}), 401
            
            request.user_id = user_id
            return f(*args, **kwargs)
        except Exception as e:
            print(f"Auth error: {e}")
            return jsonify({'success': False, 'message': 'Error de autenticación'}), 401
    
    decorated_function.__name__ = f.__name__
    return decorated_function

# Motor financiero simplificado
def calculate_financial_analysis(wizard_data):
    """Calcular análisis financiero"""
    try:
        # Datos base por país
        cost_data = {
            'canada': {'tuition': 25000, 'housing': 1200, 'food': 450, 'transport': 120, 'insurance': 100, 'misc': 350},
            'usa': {'tuition': 35000, 'housing': 1800, 'food': 600, 'transport': 180, 'insurance': 200, 'misc': 450}
        }
        
        country = wizard_data.get('step6', {}).get('country', 'canada').lower()
        costs = cost_data.get(country, cost_data['canada'])
        
        # Factor de ajuste por familia
        family_multiplier = 1.0
        family_status = wizard_data.get('step3', {}).get('familyStatus', 'single')
        if family_status == 'couple':
            family_multiplier = 1.7
        elif family_status == 'family':
            family_multiplier = 2.3
        
        # Calcular costos
        adjusted_costs = {
            'tuition': costs['tuition'],
            'housing': int(costs['housing'] * family_multiplier),
            'food': int(costs['food'] * family_multiplier),
            'transport': int(costs['transport'] * family_multiplier),
            'insurance': int(costs['insurance'] * family_multiplier),
            'miscellaneous': int(costs['misc'] * family_multiplier)
        }
        
        monthly_total = sum(adjusted_costs.values()) - adjusted_costs['tuition']
        yearly_total = adjusted_costs['tuition'] + (monthly_total * 12)
        
        # Análisis de riesgo
        savings = int(wizard_data.get('step5', {}).get('currentSavings', 0))
        risk_level = 'low'
        risk_score = 85
        
        if savings < yearly_total * 0.2:
            risk_level = 'high'
            risk_score = 25
        elif savings < yearly_total * 0.5:
            risk_level = 'medium'
            risk_score = 55
        
        # Recomendaciones
        recommendations = [
            {
                'title': 'Optimizar costos de vivienda',
                'description': 'Busca opciones de vivienda compartida para reducir gastos.',
                'category': 'cost_optimization',
                'priority': 1
            },
            {
                'title': 'Explorar becas y ayudas',
                'description': 'Investiga becas disponibles para estudiantes internacionales.',
                'category': 'funding',
                'priority': 2
            },
            {
                'title': 'Trabajo de medio tiempo',
                'description': 'Considera trabajar medio tiempo para generar ingresos adicionales.',
                'category': 'income_generation',
                'priority': 3
            }
        ]
        
        return {
            'costs': {
                'breakdown': adjusted_costs,
                'totals': {
                    'monthly': monthly_total,
                    'yearly': yearly_total,
                    'tuitionOnly': adjusted_costs['tuition'],
                    'livingExpenses': monthly_total * 12
                }
            },
            'summary': {
                'monthlyExpenses': monthly_total,
                'yearlyTotal': yearly_total,
                'riskLevel': risk_level,
                'riskScore': risk_score
            },
            'basicRecommendations': recommendations,
            'metadata': {
                'generatedAt': datetime.utcnow().isoformat(),
                'location': f"{wizard_data.get('step7', {}).get('city', 'Toronto')}, {country.title()}"
            }
        }
    except Exception as e:
        print(f"Financial analysis error: {e}")
        traceback.print_exc()
        return None

# Rutas de API
@app.route('/health')
def health_check():
    """Health check"""
    try:
        # Verificar base de datos
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT 1')
            db_status = True
    except:
        db_status = False
    
    return jsonify({
        "success": True,
        "message": "EdooConnect funcionando correctamente",
        "services": {
            "flask_app": True,
            "database": db_status
        },
        "timestamp": time.time()
    })

@app.route('/api/health')
def api_health():
    """API Health check"""
    return jsonify({
        "success": True,
        "message": "EdooConnect API funcionando correctamente",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Registro de usuario"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'Datos requeridos'}), 400
            
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not all([name, email, password]):
            return jsonify({'success': False, 'message': 'Todos los campos son requeridos'}), 400
        
        if len(password) < 6:
            return jsonify({'success': False, 'message': 'La contraseña debe tener al menos 6 caracteres'}), 400
        
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Verificar si el email ya existe
            cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
            if cursor.fetchone():
                return jsonify({'success': False, 'message': 'El email ya está registrado'}), 400
            
            # Crear usuario
            hashed_password = hash_password(password)
            cursor.execute('''
                INSERT INTO users (name, email, password) 
                VALUES (?, ?, ?)
            ''', (name, email, hashed_password))
            
            user_id = cursor.lastrowid
            conn.commit()
            
            # Generar token
            token = generate_token(user_id)
            
            return jsonify({
                'success': True,
                'message': 'Usuario registrado exitosamente',
                'data': {
                    'token': token,
                    'user': {
                        'id': user_id,
                        'name': name,
                        'email': email,
                        'is_premium': False
                    }
                }
            })
    
    except Exception as e:
        print(f"Error in register: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Inicio de sesión"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'Datos requeridos'}), 400
            
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not all([email, password]):
            return jsonify({'success': False, 'message': 'Email y contraseña son requeridos'}), 400
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
            user = cursor.fetchone()
            
            if not user or not verify_password(password, user['password']):
                return jsonify({'success': False, 'message': 'Credenciales inválidas'}), 401
            
            token = generate_token(user['id'])
            
            return jsonify({
                'success': True,
                'message': 'Inicio de sesión exitoso',
                'data': {
                    'token': token,
                    'user': {
                        'id': user['id'],
                        'name': user['name'],
                        'email': user['email'],
                        'is_premium': bool(user['is_premium'])
                    }
                }
            })
    
    except Exception as e:
        print(f"Error in login: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

@app.route('/api/auth/profile', methods=['GET'])
@require_auth
def get_profile():
    """Obtener perfil del usuario"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE id = ?', (request.user_id,))
            user = cursor.fetchone()
            
            if not user:
                return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404
            
            return jsonify({
                'success': True,
                'data': {
                    'user': {
                        'id': user['id'],
                        'name': user['name'],
                        'email': user['email'],
                        'is_premium': bool(user['is_premium'])
                    }
                }
            })
    
    except Exception as e:
        print(f"Error in get_profile: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

@app.route('/api/simulations', methods=['POST'])
@require_auth
def save_simulation():
    """Guardar datos del wizard"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'Datos requeridos'}), 400
            
        wizard_data = json.dumps(data)
        
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Verificar si ya existe una simulación
            cursor.execute('SELECT id FROM simulations WHERE user_id = ?', (request.user_id,))
            existing = cursor.fetchone()
            
            if existing:
                cursor.execute('''
                    UPDATE simulations 
                    SET wizard_data = ?, created_at = CURRENT_TIMESTAMP 
                    WHERE user_id = ?
                ''', (wizard_data, request.user_id))
            else:
                cursor.execute('''
                    INSERT INTO simulations (user_id, wizard_data) 
                    VALUES (?, ?)
                ''', (request.user_id, wizard_data))
            
            conn.commit()
            
            return jsonify({
                'success': True,
                'message': 'Datos guardados exitosamente'
            })
    
    except Exception as e:
        print(f"Error in save_simulation: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

@app.route('/api/simulations/current', methods=['GET'])
@require_auth
def get_current_simulation():
    """Obtener simulación actual"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM simulations WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', (request.user_id,))
            simulation = cursor.fetchone()
            
            if not simulation:
                return jsonify({'success': False, 'message': 'No se encontró simulación'}), 404
            
            wizard_data = json.loads(simulation['wizard_data']) if simulation['wizard_data'] else {}
            
            return jsonify({
                'success': True,
                'data': {
                    'wizardData': wizard_data,
                    'status': simulation['status']
                }
            })
    
    except Exception as e:
        print(f"Error in get_current_simulation: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

@app.route('/api/reports/generate', methods=['POST'])
@require_auth
def generate_report():
    """Generar análisis financiero"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Obtener simulación
            cursor.execute('SELECT * FROM simulations WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', (request.user_id,))
            simulation = cursor.fetchone()
            
            if not simulation or not simulation['wizard_data']:
                return jsonify({'success': False, 'message': 'Completa el wizard primero'}), 400
            
            wizard_data = json.loads(simulation['wizard_data'])
            
            # Generar análisis
            analysis = calculate_financial_analysis(wizard_data)
            
            if not analysis:
                return jsonify({'success': False, 'message': 'Error generando análisis'}), 500
            
            # Guardar reporte
            report_data = json.dumps(analysis)
            cursor.execute('''
                UPDATE simulations 
                SET report_data = ?, status = 'completed'
                WHERE id = ?
            ''', (report_data, simulation['id']))
            conn.commit()
            
            return jsonify({
                'success': True,
                'data': analysis,
                'message': 'Análisis generado exitosamente'
            })
    
    except Exception as e:
        print(f"Error in generate_report: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

@app.route('/api/reports/current', methods=['GET'])
@require_auth
def get_current_report():
    """Obtener reporte actual"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM simulations WHERE user_id = ? AND report_data IS NOT NULL ORDER BY created_at DESC LIMIT 1', (request.user_id,))
            simulation = cursor.fetchone()
            
            if not simulation:
                return jsonify({'success': False, 'message': 'No se encontró análisis previo'}), 404
            
            report_data = json.loads(simulation['report_data'])
            
            return jsonify({
                'success': True,
                'data': report_data
            })
    
    except Exception as e:
        print(f"Error in get_current_report: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

# Rutas de pagos (demo)
@app.route('/api/payments/create-checkout-session', methods=['POST'])
@require_auth
def create_checkout_session():
    """Crear sesión de pago (demo)"""
    return jsonify({
        'success': True,
        'data': {
            'checkout_url': 'https://checkout.stripe.com/pay/demo#demo-payment-success'
        },
        'message': 'Sesión de pago creada (demo)'
    })

@app.route('/api/payments/plan', methods=['GET'])
@require_auth
def get_user_plan():
    """Obtener plan del usuario"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT is_premium FROM users WHERE id = ?', (request.user_id,))
            user = cursor.fetchone()
            
            return jsonify({
                'success': True,
                'data': {
                    'plan': 'premium' if user and user['is_premium'] else 'free',
                    'is_premium': bool(user['is_premium']) if user else False
                }
            })
    
    except Exception as e:
        print(f"Error in get_user_plan: {e}")
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

# Servir archivos estáticos (simplificado)
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """Servir archivos de assets"""
    return jsonify({"message": "Assets served by frontend"}), 200

@app.route('/favicon.ico')
def serve_favicon():
    """Servir favicon"""
    return '', 204

# Catch-all route
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    """Catch-all para rutas no API"""
    if path.startswith('api/') or path.startswith('health'):
        return jsonify({"error": "Endpoint no encontrado"}), 404
    
    return jsonify({
        "message": "EdooConnect API funcionando",
        "frontend": "Desplegado por separado",
        "api_endpoints": [
            "/api/health",
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/profile",
            "/api/simulations",
            "/api/reports/generate"
        ]
    })

if __name__ == '__main__':
    print("🚀 Iniciando EdooConnect API...")
    
    # Inicializar base de datos
    db_initialized = init_database()
    
    if not db_initialized:
        print("❌ Error inicializando base de datos")
    
    # Iniciar Flask
    port = int(os.environ.get('PORT', 5000))
    print(f"🌐 Iniciando servidor en puerto {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
