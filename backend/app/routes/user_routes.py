# User management routes
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.auth_service import AuthService
from app.utils.database import get_supabase_client

# Create blueprint
user_bp = Blueprint('users', __name__)

# Initialize services
auth_service = AuthService()
supabase = get_supabase_client()

@user_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    """Get all users (admin only)"""
    try:
        # Get current user claims
        claims = get_jwt()
        user_role = claims.get('role')
        
        # Check if user is admin
        if user_role != 'admin':
            return jsonify({'error': 'Unauthorized. Admin access required.'}), 403
        
        # Get users from database
        result = supabase.table('users').select(
            'id', 'email', 'first_name', 'last_name', 'role', 
            'specialization', 'license_number', 'department', 
            'is_active', 'created_at'
        ).execute()
        
        return jsonify({
            'success': True,
            'users': result.data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get users: {str(e)}'
        }), 500

@user_bp.route('/<user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Get specific user by ID"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        claims = get_jwt()
        user_role = claims.get('role')
        
        # Check permissions (users can view their own profile, admins can view any)
        if user_id != current_user_id and user_role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Get user from database
        user = auth_service.get_user_by_id(user_id)
        
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

@user_bp.route('/<user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """Update user information"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        claims = get_jwt()
        user_role = claims.get('role')
        
        # Check permissions (users can update their own profile, admins can update any)
        if user_id != current_user_id and user_role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Get JSON data
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Prepare update data (exclude sensitive fields)
        allowed_fields = ['first_name', 'last_name', 'specialization', 'license_number', 'department']
        if user_role == 'admin':
            allowed_fields.extend(['is_active', 'role'])
        
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        if not update_data:
            return jsonify({'error': 'No valid fields to update'}), 400
        
        # Update user in database
        result = supabase.table('users').update(update_data).eq('id', user_id).execute()
        
        if result.data and len(result.data) > 0:
            return jsonify({
                'success': True,
                'message': 'User updated successfully',
                'user': result.data[0]
            }), 200
        else:
            return jsonify({'error': 'User not found or update failed'}), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to update user: {str(e)}'
        }), 500

@user_bp.route('/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """Deactivate user (admin only)"""
    try:
        # Get current user claims
        claims = get_jwt()
        user_role = claims.get('role')
        
        # Check if user is admin
        if user_role != 'admin':
            return jsonify({'error': 'Unauthorized. Admin access required.'}), 403
        
        # Soft delete by setting is_active to False
        result = supabase.table('users').update({'is_active': False}).eq('id', user_id).execute()
        
        if result.data and len(result.data) > 0:
            return jsonify({
                'success': True,
                'message': 'User deactivated successfully'
            }), 200
        else:
            return jsonify({'error': 'User not found'}), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to deactivate user: {str(e)}'
        }), 500

@user_bp.route('/by-role/<role>', methods=['GET'])
@jwt_required()
def get_users_by_role(role):
    """Get users by role (admin and doctors can access)"""
    try:
        # Get current user claims
        claims = get_jwt()
        user_role = claims.get('role')
        
        # Check permissions
        if user_role not in ['admin', 'doctor']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Validate role
        valid_roles = ['admin', 'doctor', 'nurse']
        if role not in valid_roles:
            return jsonify({'error': f'Invalid role. Must be one of: {", ".join(valid_roles)}'}), 400
        
        # Get users by role
        result = supabase.table('users').select(
            'id', 'email', 'first_name', 'last_name', 'specialization', 
            'license_number', 'department', 'created_at'
        ).eq('role', role).eq('is_active', True).execute()
        
        return jsonify({
            'success': True,
            'users': result.data,
            'count': len(result.data)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get users by role: {str(e)}'
        }), 500

# Health check for user routes
@user_bp.route('/health', methods=['GET'])
def users_health():
    """Health check for user service"""
    return jsonify({
        'status': 'healthy',
        'service': 'user_management',
        'endpoints': [
            'GET /api/users/',
            'GET /api/users/{id}',
            'PUT /api/users/{id}',
            'DELETE /api/users/{id}',
            'GET /api/users/by-role/{role}'
        ]
    }), 200