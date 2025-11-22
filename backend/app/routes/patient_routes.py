# Patient routes for patient management operations
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.patient_service import PatientService

# Create blueprint
patient_bp = Blueprint('patients', __name__)

# Initialize service
patient_service = PatientService()

@patient_bp.route('/register', methods=['POST'])
@jwt_required()
def register_patient():
    """Register a new patient"""
    try:
        # Get current user ID from JWT token
        current_user_id = get_jwt_identity()
        
        # Get JSON data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Register patient
        success, message, patient = patient_service.register_patient(data, current_user_id)
        
        if success and patient:
            return jsonify({
                'success': True,
                'message': message,
                'patient': patient.to_dict()
            }), 201
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Patient registration failed: {str(e)}'
        }), 500

@patient_bp.route('/', methods=['GET'])
@patient_bp.route('/list', methods=['GET'])
@jwt_required()
def get_all_patients():
    """Get all patients"""
    try:
        # Get current user ID from JWT token
        current_user_id = get_jwt_identity()
        
        # Get patients
        success, message, patients = patient_service.get_all_patients()
        
        if success:
            patients_data = []
            if patients:
                patients_data = [patient.to_dict() for patient in patients]
            
            return jsonify({
                'success': True,
                'message': message,
                'patients': patients_data,
                'count': len(patients_data)
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get patients: {str(e)}'
        }), 500

@patient_bp.route('/<patient_id>', methods=['GET'])
@jwt_required()
def get_patient_by_id(patient_id):
    """Get patient by ID"""
    try:
        # Get patient
        success, message, patient = patient_service.get_patient_by_id(patient_id)
        
        if success and patient:
            return jsonify({
                'success': True,
                'message': message,
                'patient': patient.to_dict()
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get patient: {str(e)}'
        }), 500

@patient_bp.route('/mrn/<mrn>', methods=['GET'])
@jwt_required()
def get_patient_by_mrn(mrn):
    """Get patient by medical record number"""
    try:
        # Get patient
        success, message, patient = patient_service.get_patient_by_medical_record_number(mrn)
        
        if success and patient:
            return jsonify({
                'success': True,
                'message': message,
                'patient': patient.to_dict()
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get patient: {str(e)}'
        }), 500

@patient_bp.route('/<patient_id>', methods=['PUT'])
@jwt_required()
def update_patient(patient_id):
    """Update patient information"""
    try:
        # Get current user ID from JWT token
        current_user_id = get_jwt_identity()
        
        # Get JSON data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update patient
        success, message, patient = patient_service.update_patient(patient_id, data, current_user_id)
        
        if success and patient:
            return jsonify({
                'success': True,
                'message': message,
                'patient': patient.to_dict()
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Patient update failed: {str(e)}'
        }), 500

@patient_bp.route('/search', methods=['GET'])
@jwt_required()
def search_patients():
    """Search patients by name, email, or medical record number"""
    try:
        # Get search term from query parameters
        search_term = request.args.get('q', '').strip()
        
        if not search_term:
            return jsonify({
                'success': False,
                'error': 'Search term is required'
            }), 400
        
        # Get current user ID from JWT token
        current_user_id = get_jwt_identity()
        
        # Search patients
        success, message, patients = patient_service.search_patients(search_term)
        
        if success:
            patients_data = []
            if patients:
                patients_data = [patient.to_dict() for patient in patients]
            
            return jsonify({
                'success': True,
                'message': message,
                'patients': patients_data,
                'count': len(patients_data),
                'searchTerm': search_term
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Patient search failed: {str(e)}'
        }), 500

@patient_bp.route('/validate-patient-id/<patient_id>', methods=['GET'])
@jwt_required()
def validate_patient_id(patient_id):
    """Validate if patient ID is available"""
    try:
        # Check if patient ID format is valid
        if not patient_service.validate_patient_id(patient_id):
            return jsonify({
                'success': False,
                'available': False,
                'error': 'Patient ID must be at least 3 characters and contain only letters, numbers, and hyphens'
            }), 400
        
        # Check if patient ID already exists
        exists = patient_service.patient_id_exists(patient_id)
        
        return jsonify({
            'success': True,
            'available': not exists,
            'message': 'Patient ID is available' if not exists else 'Patient ID already exists'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Patient ID validation failed: {str(e)}'
        }), 500

# Health check for patient routes
@patient_bp.route('/health', methods=['GET'])
def patient_health():
    """Health check for patient service"""
    return jsonify({
        'status': 'healthy',
        'service': 'patient-management',
        'endpoints': [
            'POST /api/patients/register',
            'GET /api/patients/',
            'GET /api/patients/<id>',
            'GET /api/patients/mrn/<mrn>',
            'PUT /api/patients/<id>',
            'GET /api/patients/search?q=<search_term>',
            'GET /api/patients/validate-patient-id/<patient_id>'
        ]
    }), 200