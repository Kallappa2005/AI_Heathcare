from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.lab_reports_service import LabReportsService
import pandas as pd
import os
from werkzeug.utils import secure_filename

lab_reports_bp = Blueprint('lab_reports', __name__)
lab_reports_service = LabReportsService()

ALLOWED_EXTENSIONS = {'csv', 'pdf', 'jpg', 'jpeg', 'png'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@lab_reports_bp.route('/create', methods=['POST'])
@jwt_required()
def create_lab_report():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        print(f"=== DEBUG: Creating lab report for user: {current_user_id}")
        print(f"=== DEBUG: Lab report data: {data}")

        # Validate required fields
        required_fields = ['patientId', 'testType', 'testName', 'collectionDate', 'resultDate']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Create lab report
        result = lab_reports_service.create_lab_report(data, current_user_id)
        
        if result['success']:
            return jsonify({
                'message': 'Lab report created successfully',
                'report': result['report']
            }), 201
        else:
            return jsonify({'error': result['error']}), 400

    except Exception as e:
        print(f"Error in create_lab_report: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@lab_reports_bp.route('/list', methods=['GET'])
@jwt_required()
def get_lab_reports():
    try:
        patient_id = request.args.get('patient_id')
        
        result = lab_reports_service.get_lab_reports(patient_id)
        
        if result['success']:
            return jsonify({
                'reports': result['reports']
            }), 200
        else:
            return jsonify({'error': result['error']}), 400

    except Exception as e:
        print(f"Error in get_lab_reports: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@lab_reports_bp.route('/<report_id>', methods=['GET'])
@jwt_required()
def get_lab_report(report_id):
    try:
        result = lab_reports_service.get_lab_report_by_id(report_id)
        
        if result['success']:
            return jsonify({
                'report': result['report']
            }), 200
        else:
            return jsonify({'error': result['error']}), 404

    except Exception as e:
        print(f"Error in get_lab_report: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@lab_reports_bp.route('/<report_id>', methods=['PUT'])
@jwt_required()
def update_lab_report(report_id):
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        result = lab_reports_service.update_lab_report(report_id, data, current_user_id)
        
        if result['success']:
            return jsonify({
                'message': 'Lab report updated successfully',
                'report': result['report']
            }), 200
        else:
            return jsonify({'error': result['error']}), 400

    except Exception as e:
        print(f"Error in update_lab_report: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@lab_reports_bp.route('/<report_id>', methods=['DELETE'])
@jwt_required()
def delete_lab_report(report_id):
    try:
        result = lab_reports_service.delete_lab_report(report_id)
        
        if result['success']:
            return jsonify({
                'message': 'Lab report deleted successfully'
            }), 200
        else:
            return jsonify({'error': result['error']}), 400

    except Exception as e:
        print(f"Error in delete_lab_report: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@lab_reports_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_lab_report_file():
    try:
        current_user = get_jwt_identity()
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        patient_id = request.form.get('patient_id')  # Only required for non-CSV files
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Supported: CSV, PDF, JPG, PNG'}), 400
        
        # Process CSV files - patient_id must be in CSV
        if file.filename.lower().endswith('.csv'):
            result = lab_reports_service.process_csv_upload(file, current_user)
        else:
            # For PDF/image files, patient_id is required as form data
            if not patient_id:
                return jsonify({'error': 'Patient ID is required for non-CSV files'}), 400
            result = lab_reports_service.upload_file_to_storage(file, patient_id, current_user)
        
        if result['success']:
            return jsonify({
                'message': 'File processed successfully',
                'data': result.get('data', {})
            }), 201
        else:
            return jsonify({'error': result['error']}), 400

    except Exception as e:
        print(f"Error in upload_lab_report_file: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500