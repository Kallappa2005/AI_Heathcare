# Vitals routes for vital signs management
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.vitals_service import VitalsService
from app.services.patient_service import PatientService

# Create blueprint
vitals_bp = Blueprint('vitals', __name__)

# Initialize services
vitals_service = VitalsService()
patient_service = PatientService()

@vitals_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_vitals():
    """Upload vital signs for a patient"""
    try:
        print("=== DEBUG: Starting upload_vitals ===")
        
        # Get JSON data
        data = request.get_json()
        print(f"=== DEBUG: Received data: {data}")
        
        if not data:
            print("=== DEBUG: No data provided")
            return jsonify({'error': 'No data provided'}), 400
        
        # Get current user ID from JWT token
        current_user_id = get_jwt_identity()
        print(f"=== DEBUG: Current user ID: {current_user_id}")
        
        # Upload vitals
        print("=== DEBUG: Calling vitals_service.create_vital_upload")
        success, message, vital_id = vitals_service.create_vital_upload(data, current_user_id)
        print(f"=== DEBUG: create_vital_upload returned: success={success}, message={message}, vital_id={vital_id}")
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'vital_id': vital_id
            }), 201
        else:
            print(f"=== DEBUG: Upload failed: {message}")
            return jsonify({
                'success': False,
                'error': message
            }), 400
            
    except Exception as e:
        print(f"=== DEBUG: Exception in upload_vitals: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': f'Upload failed: {str(e)}'
        }), 500

@vitals_bp.route('/patient/<patient_id>', methods=['GET'])
@jwt_required()
def get_patient_vitals(patient_id):
    """Get vital signs for a specific patient"""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        success, message, vitals = vitals_service.get_patient_vitals(patient_id, limit)
        
        return jsonify({
            'success': True,
            'message': message,
            'vitals': vitals or []
        }), 200
            
    except Exception as e:
        print(f"Error in get_patient_vitals: {str(e)}")
        return jsonify({
            'success': True,
            'message': 'No vitals found (vitals table may not exist yet)',
            'vitals': []
        }), 200

@vitals_bp.route('/recent', methods=['GET'])
@jwt_required()
def get_recent_vitals():
    """Get recent vital signs across all patients"""
    try:
        print("=== DEBUG: Starting get_recent_vitals route ===")
        limit = request.args.get('limit', 20, type=int)
        print(f"=== DEBUG: Limit requested: {limit} ===")
        
        success, message, vitals = vitals_service.get_recent_vitals(limit)
        print(f"=== DEBUG: Service returned: success={success}, message={message}, vitals_count={len(vitals or [])} ===")
        
        if vitals:
            print(f"=== DEBUG: First vital example: {vitals[0] if vitals else 'None'} ===")
        
        return jsonify({
            'success': True,
            'message': message,
            'vitals': vitals or []
        }), 200
            
    except Exception as e:
        print(f"=== DEBUG: Exception in get_recent_vitals route: {str(e)} ===")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': True,
            'message': 'No vitals found (vitals table may not exist yet)',
            'vitals': []
        }), 200

@vitals_bp.route('/patients', methods=['GET'])
@jwt_required()
def get_all_patients():
    """Get all patients for vitals upload selection"""
    try:
        print("=== DEBUG: Starting get_all_patients ===")
        
        success, message, patients = patient_service.get_all_patients()
        print(f"=== DEBUG: patient_service.get_all_patients() returned: success={success}, message={message}, patients_count={len(patients) if patients else 0}")
        
        if success:
            # Format patients for vitals upload component
            formatted_patients = []
            for i, patient in enumerate(patients or []):
                print(f"=== DEBUG: Processing patient {i}: {patient}")
                
                # Convert Patient object to dict if needed
                if hasattr(patient, '__dict__'):
                    print(f"=== DEBUG: Patient {i} is object with __dict__")
                    patient_dict = {
                        'id': patient.id,
                        'patient_id': patient.medical_record_number or patient.id,
                        'name': patient.full_name,
                        'age': patient.age if hasattr(patient, 'age') else None,
                        'room': getattr(patient, 'room_number', 'N/A'),
                        'condition': getattr(patient, 'primary_diagnosis', 'N/A'),
                        'phone': patient.phone,
                        'email': patient.email,
                        'emergency_contact': patient.emergency_contact_name,
                        'emergency_phone': patient.emergency_contact_phone,
                        'first_name': patient.first_name,
                        'last_name': patient.last_name
                    }
                else:
                    print(f"=== DEBUG: Patient {i} is dict")
                    # If it's already a dict
                    patient_dict = {
                        'id': patient.get('id'),
                        'patient_id': patient.get('medical_record_number') or patient.get('id'),
                        'name': f"{patient.get('first_name', '')} {patient.get('last_name', '')}".strip(),
                        'age': patient.get('age'),
                        'room': patient.get('room_number', 'N/A'),
                        'condition': patient.get('primary_diagnosis', 'N/A'),
                        'phone': patient.get('phone'),
                        'email': patient.get('email'),
                        'emergency_contact': patient.get('emergency_contact_name'),
                        'emergency_phone': patient.get('emergency_contact_phone'),
                        'first_name': patient.get('first_name'),
                        'last_name': patient.get('last_name')
                    }
                
                print(f"=== DEBUG: Formatted patient {i}: {patient_dict}")
                formatted_patients.append(patient_dict)
            
            print(f"=== DEBUG: Total formatted patients: {len(formatted_patients)}")
            
            return jsonify({
                'success': True,
                'message': message,
                'patients': formatted_patients
            }), 200
        else:
            print(f"=== DEBUG: Patient service failed: {message}")
            return jsonify({
                'success': False,
                'error': message
            }), 500
            
    except Exception as e:
        print(f"=== DEBUG: Exception in get_all_patients: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': f'Failed to get patients: {str(e)}'
        }), 500

# Health check for vitals routes
@vitals_bp.route('/health', methods=['GET'])
def vitals_health():
    """Health check for vitals service"""
    return jsonify({
        'status': 'healthy',
        'service': 'vitals',
        'endpoints': [
            'POST /api/vitals/upload',
            'GET /api/vitals/patient/<patient_id>',
            'GET /api/vitals/recent',
            'GET /api/vitals/patients'
        ]
    }), 200

# Test endpoint without authentication
@vitals_bp.route('/test-patients', methods=['GET'])
def test_get_patients():
    """Test endpoint to get patients without authentication"""
    try:
        success, message, patients = patient_service.get_all_patients()
        
        if success:
            # Format patients for vitals upload component
            formatted_patients = []
            for patient in patients or []:
                # Convert Patient object to dict if needed
                if hasattr(patient, '__dict__'):
                    patient_dict = {
                        'id': patient.id,
                        'patient_id': patient.medical_record_number or patient.id,
                        'name': patient.full_name,
                        'age': patient.age if hasattr(patient, 'age') else None,
                        'room': getattr(patient, 'room_number', 'N/A'),
                        'condition': getattr(patient, 'primary_diagnosis', 'N/A'),
                        'phone': patient.phone,
                        'email': patient.email,
                        'first_name': patient.first_name,
                        'last_name': patient.last_name
                    }
                else:
                    # If it's already a dict
                    patient_dict = {
                        'id': patient.get('id'),
                        'patient_id': patient.get('medical_record_number') or patient.get('id'),
                        'name': f"{patient.get('first_name', '')} {patient.get('last_name', '')}".strip(),
                        'age': patient.get('age'),
                        'room': patient.get('room_number', 'N/A'),
                        'condition': patient.get('primary_diagnosis', 'N/A'),
                        'phone': patient.get('phone'),
                        'email': patient.get('email'),
                        'first_name': patient.get('first_name'),
                        'last_name': patient.get('last_name')
                    }
                
                formatted_patients.append(patient_dict)
            
            return jsonify({
                'success': True,
                'message': message,
                'patients': formatted_patients
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 500
            
    except Exception as e:
        print(f"Error in test_get_patients: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': f'Failed to get patients: {str(e)}'
        }), 500