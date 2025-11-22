# Staff routes for healthcare staff management
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.staff_service import StaffService
from functools import wraps
import traceback

# Create blueprint for staff routes
staff_bp = Blueprint('staff', __name__, url_prefix='/api/staff')

# Initialize staff service
staff_service = StaffService()

def handle_errors(f):
    """Decorator to handle common errors"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            current_app.logger.error(f"Error in {f.__name__}: {str(e)}")
            current_app.logger.error(traceback.format_exc())
            return jsonify({
                'success': False,
                'message': 'An internal error occurred',
                'error': str(e) if current_app.debug else 'Internal server error'
            }), 500
    return decorated_function

@staff_bp.route('/register', methods=['POST'])
@jwt_required()
@handle_errors
def register_staff():
    """Register a new staff member"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        
        # Get request data
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Register staff
        success, message, staff = staff_service.register_staff(data, current_user_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'staff': staff.to_dict() if staff else None
            }), 201
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 400
            
    except Exception as e:
        current_app.logger.error(f"Staff registration error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Registration failed: {str(e)}'
        }), 500

@staff_bp.route('', methods=['GET'])
@staff_bp.route('/', methods=['GET'])
@jwt_required()
@handle_errors
def get_staff():
    """Get all staff members with optional filtering"""
    try:
        # Get query parameters
        role_filter = request.args.get('role', None)
        search_term = request.args.get('search', None)
        
        if search_term:
            # Search staff
            success, message, staff_list = staff_service.search_staff(search_term, role_filter)
        elif role_filter:
            # Filter by role
            success, message, staff_list = staff_service.get_staff_by_role(role_filter)
        else:
            # Get all staff
            success, message, staff_list = staff_service.get_all_staff()
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'staff': [staff.to_dict() for staff in staff_list] if staff_list else []
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 400
            
    except Exception as e:
        current_app.logger.error(f"Get staff error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Failed to get staff: {str(e)}'
        }), 500

@staff_bp.route('/<staff_id>', methods=['GET'])
@jwt_required()
@handle_errors
def get_staff_by_id(staff_id):
    """Get staff member by ID"""
    try:
        success, message, staff = staff_service.get_staff_by_id(staff_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'staff': staff.to_dict() if staff else None
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 404
            
    except Exception as e:
        current_app.logger.error(f"Get staff by ID error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Failed to get staff: {str(e)}'
        }), 500

@staff_bp.route('/<staff_id>', methods=['PUT'])
@jwt_required()
@handle_errors
def update_staff(staff_id):
    """Update staff member"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        
        # Get request data
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Update staff
        success, message, staff = staff_service.update_staff(staff_id, data, current_user_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'staff': staff.to_dict() if staff else None
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 400
            
    except Exception as e:
        current_app.logger.error(f"Staff update error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Update failed: {str(e)}'
        }), 500

@staff_bp.route('/<staff_id>', methods=['DELETE'])
@jwt_required()
@handle_errors
def delete_staff(staff_id):
    """Delete staff member"""
    try:
        success, message = staff_service.delete_staff(staff_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': message
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 400
            
    except Exception as e:
        current_app.logger.error(f"Staff deletion error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Deletion failed: {str(e)}'
        }), 500

@staff_bp.route('/employee/<employee_id>', methods=['GET'])
@jwt_required()
@handle_errors
def get_staff_by_employee_id(employee_id):
    """Get staff member by employee ID"""
    try:
        success, message, staff = staff_service.get_staff_by_employee_id(employee_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'staff': staff.to_dict() if staff else None
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 404
            
    except Exception as e:
        current_app.logger.error(f"Get staff by employee ID error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Failed to get staff: {str(e)}'
        }), 500

@staff_bp.route('/statistics', methods=['GET'])
@jwt_required()
@handle_errors
def get_staff_statistics():
    """Get staff statistics"""
    try:
        success, message, stats = staff_service.get_staff_statistics()
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'statistics': stats
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 400
            
    except Exception as e:
        current_app.logger.error(f"Get staff statistics error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Failed to get statistics: {str(e)}'
        }), 500

@staff_bp.route('/search', methods=['GET'])
@jwt_required()
@handle_errors
def search_staff():
    """Search staff members"""
    try:
        # Get query parameters
        search_term = request.args.get('q', '').strip()
        role_filter = request.args.get('role', None)
        
        if not search_term:
            return jsonify({
                'success': False,
                'message': 'Search term is required'
            }), 400
        
        # Search staff
        success, message, staff_list = staff_service.search_staff(search_term, role_filter)
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'staff': [staff.to_dict() for staff in staff_list] if staff_list else []
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 400
            
    except Exception as e:
        current_app.logger.error(f"Staff search error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Search failed: {str(e)}'
        }), 500

# Error handlers for the blueprint
@staff_bp.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': 'Endpoint not found'
    }), 404

@staff_bp.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'success': False,
        'message': 'Method not allowed'
    }), 405