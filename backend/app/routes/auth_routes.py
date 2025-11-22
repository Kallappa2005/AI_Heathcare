# Authentication routes for registration and login
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.auth_service import AuthService

# Create blueprint
auth_bp = Blueprint('auth', __name__)

# Initialize service
auth_service = AuthService()

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Register user
        success, message, user = auth_service.register_user(data)
        
        if success and user:
            # Generate token for immediate login after registration
            from flask_jwt_extended import create_access_token
            token = create_access_token(
                identity=user.id,
                additional_claims={
                    'email': user.email,
                    'role': user.role,
                    'full_name': user.full_name
                }
            )
            
            return jsonify({
                'user': user.to_dict(),
                'token': token,
                'message': message
            }), 201
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Registration failed: {str(e)}'
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        # Get JSON data with better error handling
        data = request.get_json()
        
        # Handle case where data is string instead of dict
        if isinstance(data, str):
            import json
            try:
                data = json.loads(data)
            except json.JSONDecodeError:
                return jsonify({'error': 'Invalid JSON format'}), 400
        
        if not data or not isinstance(data, dict):
            return jsonify({'error': 'No valid JSON data provided'}), 400
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Test direct database query first
        from app.utils.database import get_supabase_client
        supabase = get_supabase_client()
        
        result = supabase.table('users').select('*').eq('email', email.lower().strip()).execute()
        
        if not result.data or len(result.data) == 0:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        user_data = result.data[0]
        
        # Simple password check using bcrypt directly
        import bcrypt
        stored_hash = user_data.get('password_hash')
        
        if not stored_hash:
            return jsonify({'error': 'Account setup incomplete'}), 401
            
        if not bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8')):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Create simple token
        from flask_jwt_extended import create_access_token
        
        token = create_access_token(
            identity=user_data['id'],
            additional_claims={
                'email': user_data['email'],
                'role': user_data.get('role', 'nurse'),
                'full_name': f"{user_data['first_name']} {user_data['last_name']}"
            }
        )
        
        # Return simple response
        return jsonify({
            'user': {
                'id': user_data['id'],
                'email': user_data['email'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'full_name': f"{user_data['first_name']} {user_data['last_name']}",
                'role': user_data.get('role', 'nurse'),
                'department': user_data.get('department'),
                'is_active': user_data.get('is_active', True)
            },
            'token': token,
            'message': 'Login successful'
        }), 200
            
    except Exception as e:
        # Log the full error for debugging
        print(f"Login error: {str(e)}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        
        return jsonify({
            'success': False,
            'error': f'Login failed: {str(e)}'
        }), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user information"""
    try:
        # Get user ID from JWT token
        current_user_id = get_jwt_identity()
        
        # Get user from database
        user = auth_service.get_user_by_id(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get user: {str(e)}'
        }), 500

@auth_bp.route('/verify-token', methods=['POST'])
@jwt_required()
def verify_token():
    """Verify JWT token validity"""
    try:
        # Get user ID and claims from JWT
        current_user_id = get_jwt_identity()
        claims = get_jwt()
        
        return jsonify({
            'success': True,
            'valid': True,
            'user_id': current_user_id,
            'claims': claims
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Token verification failed: {str(e)}'
        }), 401

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout endpoint (token invalidation would be handled client-side)"""
    try:
        return jsonify({
            'success': True,
            'message': 'Logged out successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Logout failed: {str(e)}'
        }), 500

# Health check for auth routes
@auth_bp.route('/health', methods=['GET'])
def auth_health():
    """Health check for authentication service"""
    return jsonify({
        'status': 'healthy',
        'service': 'authentication',
        'endpoints': [
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/auth/me',
            'POST /api/auth/verify-token',
            'POST /api/auth/logout'
        ]
    }), 200