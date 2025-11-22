from app.utils.database import get_supabase_client
from app.models.lab_report import LabReport
from datetime import datetime
import uuid
import pandas as pd
import pandas as pd
import os
from werkzeug.utils import secure_filename

class LabReportsService:
    def __init__(self):
        self.supabase = get_supabase_client()

    def create_lab_report(self, report_data, user_id):
        try:
            # Generate unique ID
            report_id = str(uuid.uuid4())
            
            # Debug: print the received data
            print(f"Creating lab report with data: {report_data}")
            
            # Prepare data for insertion
            lab_report_data = {
                'id': report_id,
                'patient_id': report_data['patientId'],
                'test_type': report_data['testType'],
                'test_name': report_data['testName'],
                'order_date': report_data.get('orderDate'),
                'collection_date': report_data['collectionDate'],
                'result_date': report_data['resultDate'],
                'status': report_data.get('status', 'completed'),
                'priority': report_data.get('priority', 'normal'),
                'notes': report_data.get('notes', ''),
                'test_results': report_data.get('results', []),  # Store as JSONB
                'created_by': user_id,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }

            print(f"Inserting lab report data: {lab_report_data}")

            # Insert into database
            result = self.supabase.table('lab_reports').insert(lab_report_data).execute()
            
            if result.data:
                return {
                    'success': True,
                    'report': result.data[0],
                    'message': 'Lab report created successfully'
                }
            else:
                print(f"No data returned from insert: {result}")
                return {
                    'success': False,
                    'error': 'Failed to create lab report - no data returned'
                }

        except Exception as e:
            print(f"Error creating lab report: {str(e)}")
            print(f"Report data that caused error: {report_data}")
            return {
                'success': False,
                'error': f'Database error: {str(e)}'
            }

    def get_lab_reports(self, patient_id=None):
        try:
            query = self.supabase.table('lab_reports').select('''
                *,
                patients:patient_id(id, name, patient_id, room)
            ''')
            
            if patient_id:
                query = query.eq('patient_id', patient_id)
            
            result = query.order('created_at', desc=True).execute()
            
            if result.data:
                # Format the data to include patient info at the top level
                formatted_reports = []
                for report in result.data:
                    formatted_report = dict(report)
                    if report.get('patients'):
                        formatted_report['patient_name'] = report['patients']['name']
                        formatted_report['patient_id_display'] = report['patients']['patient_id']
                        formatted_report['patient_room'] = report['patients'].get('room', 'N/A')
                    
                    formatted_reports.append(formatted_report)
                
                return {
                    'success': True,
                    'reports': formatted_reports
                }
            else:
                return {
                    'success': True,
                    'reports': []
                }

        except Exception as e:
            print(f"Error fetching lab reports: {str(e)}")
            return {
                'success': False,
                'error': f'Database error: {str(e)}'
            }

    def get_lab_report_by_id(self, report_id):
        try:
            result = self.supabase.table('lab_reports').select('''
                *,
                patients:patient_id(id, name, patient_id, room)
            ''').eq('id', report_id).execute()
            
            if result.data:
                return {
                    'success': True,
                    'report': result.data[0]
                }
            else:
                return {
                    'success': False,
                    'error': 'Lab report not found'
                }

        except Exception as e:
            print(f"Error fetching lab report: {str(e)}")
            return {
                'success': False,
                'error': f'Database error: {str(e)}'
            }

    def update_lab_report(self, report_id, update_data, user_id):
        try:
            update_data['updated_at'] = datetime.now().isoformat()
            
            result = self.supabase.table('lab_reports').update(update_data).eq('id', report_id).execute()
            
            if result.data:
                return {
                    'success': True,
                    'report': result.data[0],
                    'message': 'Lab report updated successfully'
                }
            else:
                return {
                    'success': False,
                    'error': 'Failed to update lab report'
                }

        except Exception as e:
            print(f"Error updating lab report: {str(e)}")
            return {
                'success': False,
                'error': f'Database error: {str(e)}'
            }

    def delete_lab_report(self, report_id):
        try:
            result = self.supabase.table('lab_reports').delete().eq('id', report_id).execute()
            
            return {
                'success': True,
                'message': 'Lab report deleted successfully'
            }

        except Exception as e:
            print(f"Error deleting lab report: {str(e)}")
            return {
                'success': False,
                'error': f'Database error: {str(e)}'
            }

    def process_csv_upload(self, file, user_id):
        try:
            # Read CSV file
            df = pd.read_csv(file)
            
            # Validate CSV structure - patient_id is now mandatory in CSV
            required_columns = ['patient_id', 'test_type', 'test_name', 'collection_date', 'result_date']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                return {
                    'success': False,
                    'error': f'Missing required columns: {", ".join(missing_columns)}. patient_id is mandatory in CSV!'
                }
            
            # Validate patient_id is not null/empty in any row
            if df['patient_id'].isnull().any() or (df['patient_id'] == '').any():
                null_rows = df[df['patient_id'].isnull() | (df['patient_id'] == '')].index.tolist()
                return {
                    'success': False,
                    'error': f'patient_id is mandatory and cannot be empty. Found empty patient_id in rows: {[r+2 for r in null_rows]}'
                }
            
            # Group rows by test (same patient_id, test_type, test_name, collection_date)
            grouped_reports = {}
            created_reports = []
            errors = []
            
            for index, row in df.iterrows():
                try:
                    # Validate patient_id for this row
                    if pd.isna(row['patient_id']) or str(row['patient_id']).strip() == '':
                        errors.append(f"Row {index + 1}: patient_id is required and cannot be empty")
                        continue
                    
                    patient_id = str(row['patient_id']).strip()
                    test_key = f"{patient_id}_{row['test_type']}_{row['test_name']}_{row['collection_date']}"
                    
                    if test_key not in grouped_reports:
                        grouped_reports[test_key] = {
                            'patientId': patient_id,  # Use patient_id from CSV
                            'testType': row['test_type'],  # Map to camelCase
                            'testName': row['test_name'],  # Map to camelCase
                            'orderDate': row.get('order_date') if pd.notna(row.get('order_date')) else None,  # Map to camelCase
                            'collectionDate': row['collection_date'],  # Map to camelCase
                            'resultDate': row['result_date'],  # Map to camelCase
                            'status': row.get('status', 'completed'),
                            'priority': row.get('priority', 'normal'),
                            'notes': row.get('notes', ''),
                            'results': []
                        }
                    
                    # Add test parameter if present
                    if pd.notna(row.get('parameter')) and pd.notna(row.get('value')):
                        grouped_reports[test_key]['results'].append({
                            'parameter': str(row['parameter']).strip(),
                            'value': str(row['value']).strip(),
                            'unit': str(row.get('unit', '')).strip(),
                            'normalRange': str(row.get('normal_range', '')).strip(),
                            'status': str(row.get('result_status', 'normal')).strip()
                        })
                        
                except Exception as e:
                    errors.append(f"Row {index + 1}: {str(e)}")
            
            # Create lab reports
            for report_data in grouped_reports.values():
                try:
                    result = self.create_lab_report(report_data, user_id)
                    
                    if result['success']:
                        created_reports.append(result['report'])
                    else:
                        errors.append(f"Report for patient {report_data['patientId']}: {result['error']}")
                        
                except Exception as e:
                    errors.append(f"Report for patient {report_data['patientId']}: {str(e)}")
            
            return {
                'success': True,
                'message': f'Successfully created {len(created_reports)} lab reports{". Errors: " + str(len(errors)) if errors else ""}',
                'data': {
                    'reports_created': len(created_reports),
                    'errors': errors
                }
            }
            
        except Exception as e:
            print(f"Error processing CSV upload: {str(e)}")
            return {
                'success': False,
                'error': f'CSV processing error: {str(e)}'
            }
            
        except Exception as e:
            print(f"Error processing CSV upload: {str(e)}")
            return {
                'success': False,
                'error': f'CSV processing error: {str(e)}'
            }

    def upload_file_to_storage(self, file, patient_id, user_id):
        try:
            # Generate unique filename
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = f"lab-reports/{patient_id}/{unique_filename}"
            
            # Upload to Supabase storage
            file_data = file.read()
            
            result = self.supabase.storage.from_('medical-files').upload(
                file_path, 
                file_data,
                file_options={"content-type": file.content_type}
            )
            
            if hasattr(result, 'error') and result.error:
                return {
                    'success': False,
                    'error': f'File upload failed: {result.error.message}'
                }
            
            # Get public URL
            file_url = self.supabase.storage.from_('medical-files').get_public_url(file_path)
            
            # Create a basic lab report entry for the uploaded file
            report_data = {
                'patientId': patient_id,
                'testType': 'File Upload',
                'testName': f'Uploaded {filename}',
                'collectionDate': datetime.now().date().isoformat(),
                'resultDate': datetime.now().date().isoformat(),
                'status': 'completed',
                'priority': 'normal',
                'notes': f'Uploaded file: {filename}',
                'results': [],
                'file_url': file_url.data.get('publicUrl') if hasattr(file_url, 'data') else None
            }
            
            # Create the lab report record
            lab_result = self.create_lab_report(report_data, user_id)
            
            if lab_result['success']:
                return {
                    'success': True,
                    'message': 'File uploaded successfully',
                    'data': {
                        'file_url': file_url.data.get('publicUrl') if hasattr(file_url, 'data') else None,
                        'report': lab_result['report']
                    }
                }
            else:
                return lab_result
                
        except Exception as e:
            print(f"Error uploading file to storage: {str(e)}")
            return {
                'success': False,
                'error': f'File upload error: {str(e)}'
            }