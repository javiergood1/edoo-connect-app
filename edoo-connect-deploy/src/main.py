
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os
import time
import json
import hashlib
import jwt
from datetime import datetime, timedelta
from supabase import create_client, Client
import traceback

app = Flask(__name__)
CORS(app, origins=["*"])

# Supabase Configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Configuración
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "super-secret-jwt-key") # Use environment variable for secret key
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")

print(f"📁 Base directory: {BASE_DIR}")
print(f"📁 Static directory: {STATIC_DIR}")

def require_auth(f):
    """Decorador para rutas que requieren autenticación"""
    def decorated_function(*args, **kwargs):
        try:
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return jsonify({"success": False, "message": "Token requerido"}), 401
            
            token = auth_header.split(" ")[1]
            # Supabase handles JWT verification internally when getting user
            user_response = supabase.auth.get_user(token)
            if not user_response.user:
                return jsonify({"success": False, "message": "Token inválido o expirado"}), 401
            
            request.user_id = user_response.user.id
            request.access_token = token # Store access token for further Supabase calls
            return f(*args, **kwargs)
        except Exception as e:
            print(f"Auth error: {e}")
            traceback.print_exc()
            return jsonify({"success": False, "message": "Error de autenticación"}), 401
    
    decorated_function.__name__ = f.__name__
    return decorated_function

# Motor financiero simplificado (assuming it doesn't need direct DB access)
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
        # Verify Supabase connection by trying to get a session
        # This is a basic check, a more robust one might query a public table
        session_response = supabase.auth.get_session()
        db_status = session_response.user is not None or session_response.session is not None
    except Exception as e:
        print(f"Supabase health check failed: {e}")
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
        
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        
        if response.user:
            # Optionally, insert user name into a 'profiles' table if needed
            # For now, just return success
            return jsonify({
                'success': True,
                'message': 'Usuario registrado exitosamente',
                'data': {
                    'user': {
                        'id': response.user.id,
                        'email': response.user.email,
                    }
                }
            }), 201
        else:
            error_message = response.json().get('msg', 'Unknown error during registration')
            return jsonify({'success': False, 'message': error_message}), 400

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
        
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if response.user and response.session:
            return jsonify({
                'success': True,
                'message': 'Inicio de sesión exitoso',
                'data': {
                    'user': {
                        'id': response.user.id,
                        'email': response.user.email,
                    },
                    'access_token': response.session.access_token,
                    'refresh_token': response.session.refresh_token
                }
            }), 200
        else:
            error_message = response.json().get('msg', 'Credenciales inválidas')
            return jsonify({'success': False, 'message': error_message}), 401

    except Exception as e:
        print(f"Error in login: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

@app.route('/api/auth/profile', methods=['GET'])
@require_auth
def get_profile():
    """Obtener perfil del usuario"""
    try:
        # The user is already authenticated by require_auth decorator
        # We can fetch user details from Supabase if needed, or just return basic info
        user_id = request.user_id
        # Example: Fetch user data from a 'profiles' table if you have one
        # response = supabase.table('profiles').select('*').eq('id', user_id).single().execute()
        # user_data = response.data

        # For now, just return the user ID and email from the authenticated session
        user_response = supabase.auth.get_user(request.access_token)
        if user_response.user:
            return jsonify({
                'success': True,
                'data': {
                    'user': {
                        'id': user_response.user.id,
                        'email': user_response.user.email,
                        'is_premium': False # This would come from your profiles table
                    }
                }
            })
        else:
            return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404
    
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
        user_id = request.user_id

        # Check if a simulation already exists for the user
        existing_simulation = supabase.table('simulations').select('id').eq('user_id', user_id).execute()
        
        if existing_simulation.data:
            # Update existing simulation
            response = supabase.table('simulations').update({'wizard_data': wizard_data, 'created_at': datetime.utcnow().isoformat()}).eq('user_id', user_id).execute()
        else:
            # Insert new simulation
            response = supabase.table('simulations').insert({'user_id': user_id, 'wizard_data': wizard_data, 'status': 'draft'}).execute()
            
        if response.data:
            return jsonify({
                'success': True,
                'message': 'Datos guardados exitosamente'
            })
        else:
            return jsonify({'success': False, 'message': 'Error al guardar simulación'}), 500
    
    except Exception as e:
        print(f"Error in save_simulation: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

@app.route('/api/simulations/current', methods=['GET'])
@require_auth
def get_current_simulation():
    """Obtener simulación actual"""
    try:
        user_id = request.user_id
        response = supabase.table('simulations').select('*').eq('user_id', user_id).order('created_at', desc=True).limit(1).execute()
        
        if response.data:
            simulation = response.data[0]
            wizard_data = json.loads(simulation['wizard_data']) if simulation['wizard_data'] else {}
            
            return jsonify({
                'success': True,
                'data': {
                    'wizardData': wizard_data,
                    'status': simulation['status']
                }
            })
        else:
            return jsonify({'success': False, 'message': 'No se encontró simulación'}), 404
    
    except Exception as e:
        print(f"Error in get_current_simulation: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

@app.route('/api/reports/generate', methods=['POST'])
@require_auth
def generate_report():
    """Generar análisis financiero"""
    try:
        user_id = request.user_id
        # Get simulation data
        simulation_response = supabase.table('simulations').select('wizard_data').eq('user_id', user_id).order('created_at', desc=True).limit(1).execute()
        
        if not simulation_response.data or not simulation_response.data[0]['wizard_data']:
            return jsonify({'success': False, 'message': 'No se encontraron datos de simulación para generar el reporte'}), 404
        
        wizard_data = json.loads(simulation_response.data[0]['wizard_data'])
        report_data = calculate_financial_analysis(wizard_data)
        
        if report_data:
            # Update simulation with report data
            supabase.table('simulations').update({'report_data': json.dumps(report_data), 'status': 'completed'}).eq('user_id', user_id).execute()
            return jsonify({
                'success': True,
                'message': 'Reporte generado exitosamente',
                'data': report_data
            })
        else:
            return jsonify({'success': False, 'message': 'Error al generar el análisis financiero'}), 500
    
    except Exception as e:
        print(f"Error in generate_report: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

@app.route('/api/reports/current', methods=['GET'])
@require_auth
def get_current_report():
    """Obtener reporte actual"""
    try:
        user_id = request.user_id
        response = supabase.table('simulations').select('report_data').eq('user_id', user_id).order('created_at', desc=True).limit(1).execute()
        
        if response.data and response.data[0]['report_data']:
            report_data = json.loads(response.data[0]['report_data'])
            return jsonify({
                'success': True,
                'data': report_data
            })
        else:
            return jsonify({'success': False, 'message': 'No se encontró análisis previo'}), 404
    
    except Exception as e:
        print(f"Error in get_current_report: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

# Rutas de pagos (demo)
@app.route('/api/payments/create-checkout-session', methods=['POST'])
@require_auth
def create_checkout_session():
    """Crear sesión de pago (demo)"""
    # In a real application, integrate with a payment gateway like Stripe
    return jsonify({
        'success': True,
        'data': {
            'checkout_url': 'https://checkout.stripe.com/pay/demo#demo-payment-success' # Placeholder
        },
        'message': 'Sesión de pago creada (demo)'
    })

@app.route('/api/payments/plan', methods=['GET'])
@require_auth
def get_user_plan():
    """Obtener plan del usuario"""
    try:
        user_id = request.user_id
        # Assuming 'profiles' table has 'is_premium' column linked to auth.users
        response = supabase.table('profiles').select('is_premium').eq('id', user_id).single().execute()
        
        if response.data:
            is_premium = response.data.get('is_premium', False)
            return jsonify({
                'success': True,
                'data': {
                    'plan': 'premium' if is_premium else 'free',
                    'is_premium': is_premium
                }
            })
        else:
            # Default to free if profile not found
            return jsonify({
                'success': True,
                'data': {
                    'plan': 'free',
                    'is_premium': False
                }
            })
    
    except Exception as e:
        print(f"Error in get_user_plan: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

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
    print("🚀 Iniciando EdooConnect Flask Backend...")
    
    # Verificar que el frontend existe
    if os.path.exists(STATIC_DIR):
        print("✅ Frontend encontrado")
    else:
        print("⚠️ Frontend no encontrado en", STATIC_DIR)
    
    # Iniciar Flask
    port = int(os.environ.get('PORT', 5000))
    print(f"🌐 Iniciando servidor en puerto {port}")
    app.run(host='0.0.0.0', port=port, debug=False)

