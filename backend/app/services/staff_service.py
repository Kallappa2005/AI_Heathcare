# Staff service for managing staff operations
from typing import Optional, Dict, Any, Tuple, List
from app.models.staff import Staff
from app.utils.database import get_supabase_client
import re
from datetime import datetime

class StaffService:
    """Service class for staff management operations"""
    
    def __init__(self):
        self.supabase = get_supabase_client()
    
    def validate_employee_id(self, employee_id: str) -> bool:
        """Validate employee ID format"""
        if not employee_id:
            return False
        
        # Allow alphanumeric and hyphens, minimum 3 characters
        pattern = r'^[A-Za-z0-9\-]{3,}$'
        return bool(re.match(pattern, employee_id))
    
    def employee_id_exists(self, employee_id: str, exclude_id: str = None) -> bool:
        """Check if employee ID already exists"""
        try:
            query = self.supabase.table('staff').select('id').eq('employee_id', employee_id)
            if exclude_id:
                query = query.neq('id', exclude_id)
            
            result = query.execute()
            return len(result.data) > 0
        except Exception as e:
            print(f"Error checking employee ID existence: {str(e)}")
            return False
    
    def email_exists(self, email: str, exclude_id: str = None) -> bool:
        """Check if email already exists for another staff member"""
        try:
            query = self.supabase.table('staff').select('id').eq('email', email)
            if exclude_id:
                query = query.neq('id', exclude_id)
            
            result = query.execute()
            return len(result.data) > 0
        except Exception as e:
            print(f"Error checking email existence: {str(e)}")
            return False
    
    def register_staff(self, staff_data: Dict[str, Any], created_by: str) -> Tuple[bool, str, Optional[Staff]]:
        """Register a new staff member"""
        try:
            # Create staff object from form data
            staff = Staff.from_dict(staff_data)
            
            # Only set created_by if we can verify the user exists
            # For now, we'll make it optional to avoid foreign key issues
            staff.created_by = created_by if created_by else None
            
            # Validate staff data
            is_valid, validation_message = staff.validate()
            if not is_valid:
                return False, validation_message, None
            
            # Validate employee ID format
            if not self.validate_employee_id(staff.employee_id):
                return False, "Employee ID must be at least 3 characters and contain only letters, numbers, and hyphens", None
            
            # Check if employee ID already exists
            if self.employee_id_exists(staff.employee_id):
                return False, "Employee ID already exists. Please use a different ID", None
            
            # Check if email already exists
            if self.email_exists(staff.email):
                return False, "Email address already exists for another staff member", None
            
            # Prepare data for database insertion
            db_data = staff.to_db_dict()
            
            # Insert staff into database
            result = self.supabase.table('staff').insert(db_data).execute()
            
            if result.data and len(result.data) > 0:
                # Get the inserted staff data with generated ID
                inserted_data = result.data[0]
                staff.id = inserted_data.get('id')
                staff.created_at = datetime.fromisoformat(inserted_data.get('created_at', '').replace('Z', '+00:00'))
                staff.updated_at = datetime.fromisoformat(inserted_data.get('updated_at', '').replace('Z', '+00:00'))
                
                return True, "Staff member registered successfully", staff
            else:
                return False, "Failed to register staff member", None
                
        except Exception as e:
            print(f"Staff registration error: {str(e)}")
            return False, f"Registration failed: {str(e)}", None
    
    def get_all_staff(self, created_by: str = None) -> Tuple[bool, str, Optional[List[Staff]]]:
        """Get all staff members"""
        try:
            query = self.supabase.table('staff').select('*').order('created_at', desc=True)
            
            # If created_by is provided, filter by creator (for role-based access)
            if created_by:
                query = query.eq('created_by', created_by)
            
            result = query.execute()
            
            if result.data:
                staff_list = []
                for staff_data in result.data:
                    staff = Staff.from_dict(staff_data)
                    staff_list.append(staff)
                
                return True, "Staff retrieved successfully", staff_list
            else:
                return True, "No staff found", []
                
        except Exception as e:
            print(f"Error getting staff: {str(e)}")
            return False, f"Failed to get staff: {str(e)}", None
    
    def get_staff_by_id(self, staff_id: str) -> Tuple[bool, str, Optional[Staff]]:
        """Get staff member by database ID"""
        try:
            result = self.supabase.table('staff').select('*').eq('id', staff_id).execute()
            
            if result.data and len(result.data) > 0:
                staff = Staff.from_dict(result.data[0])
                return True, "Staff found", staff
            else:
                return False, "Staff not found", None
                
        except Exception as e:
            print(f"Error getting staff by ID: {str(e)}")
            return False, f"Failed to get staff: {str(e)}", None
    
    def get_staff_by_employee_id(self, employee_id: str) -> Tuple[bool, str, Optional[Staff]]:
        """Get staff member by employee ID"""
        try:
            result = self.supabase.table('staff').select('*').eq('employee_id', employee_id).execute()
            
            if result.data and len(result.data) > 0:
                staff = Staff.from_dict(result.data[0])
                return True, "Staff found", staff
            else:
                return False, "Staff not found", None
                
        except Exception as e:
            print(f"Error getting staff by employee ID: {str(e)}")
            return False, f"Failed to get staff: {str(e)}", None
    
    def update_staff(self, staff_id: str, staff_data: Dict[str, Any], updated_by: str) -> Tuple[bool, str, Optional[Staff]]:
        """Update staff information"""
        try:
            # Get existing staff
            success, message, existing_staff = self.get_staff_by_id(staff_id)
            if not success:
                return False, message, None
            
            # Create updated staff object
            updated_staff = Staff.from_dict(staff_data)
            updated_staff.id = staff_id
            updated_staff.created_by = existing_staff.created_by
            updated_staff.created_at = existing_staff.created_at
            
            # Validate updated data
            is_valid, validation_message = updated_staff.validate()
            if not is_valid:
                return False, validation_message, None
            
            # Check employee ID uniqueness (exclude current staff)
            if updated_staff.employee_id != existing_staff.employee_id:
                if self.employee_id_exists(updated_staff.employee_id, staff_id):
                    return False, "Employee ID already exists for another staff member", None
            
            # Check email uniqueness (exclude current staff)
            if updated_staff.email != existing_staff.email:
                if self.email_exists(updated_staff.email, staff_id):
                    return False, "Email address already exists for another staff member", None
            
            # Prepare update data
            update_data = updated_staff.to_db_dict()
            update_data['updated_at'] = datetime.utcnow().isoformat()
            
            # Update staff in database
            result = self.supabase.table('staff').update(update_data).eq('id', staff_id).execute()
            
            if result.data and len(result.data) > 0:
                updated_data = result.data[0]
                updated_staff.updated_at = datetime.fromisoformat(updated_data.get('updated_at', '').replace('Z', '+00:00'))
                
                return True, "Staff updated successfully", updated_staff
            else:
                return False, "Failed to update staff", None
                
        except Exception as e:
            print(f"Staff update error: {str(e)}")
            return False, f"Update failed: {str(e)}", None
    
    def delete_staff(self, staff_id: str) -> Tuple[bool, str]:
        """Delete staff member"""
        try:
            # Check if staff exists
            success, message, existing_staff = self.get_staff_by_id(staff_id)
            if not success:
                return False, message
            
            # Delete staff from database
            result = self.supabase.table('staff').delete().eq('id', staff_id).execute()
            
            if result.data:
                return True, "Staff member deleted successfully"
            else:
                return False, "Failed to delete staff member"
                
        except Exception as e:
            print(f"Staff deletion error: {str(e)}")
            return False, f"Deletion failed: {str(e)}"
    
    def search_staff(self, search_term: str, role_filter: str = None) -> Tuple[bool, str, Optional[List[Staff]]]:
        """Search staff by name, email, or employee ID"""
        try:
            # Get all staff first
            success, message, all_staff = self.get_all_staff()
            if not success:
                return False, message, None
            
            if not all_staff:
                return True, "No staff found", []
            
            # Filter staff based on search term and role
            search_term_lower = search_term.lower()
            filtered_staff = []
            
            for staff in all_staff:
                # Search in name, email, employee ID, and department
                matches_search = (
                    search_term_lower in staff.full_name.lower() or
                    search_term_lower in staff.email.lower() or
                    search_term_lower in staff.employee_id.lower() or
                    search_term_lower in staff.department.lower()
                )
                
                # Filter by role if provided
                matches_role = role_filter is None or staff.role == role_filter
                
                if matches_search and matches_role:
                    filtered_staff.append(staff)
            
            return True, f"Found {len(filtered_staff)} staff members", filtered_staff
            
        except Exception as e:
            print(f"Staff search error: {str(e)}")
            return False, f"Search failed: {str(e)}", None
    
    def get_staff_by_role(self, role: str) -> Tuple[bool, str, Optional[List[Staff]]]:
        """Get staff members by role"""
        try:
            result = self.supabase.table('staff').select('*').eq('role', role).order('created_at', desc=True).execute()
            
            if result.data:
                staff_list = []
                for staff_data in result.data:
                    staff = Staff.from_dict(staff_data)
                    staff_list.append(staff)
                
                return True, f"Found {len(staff_list)} {role}s", staff_list
            else:
                return True, f"No {role}s found", []
                
        except Exception as e:
            print(f"Error getting staff by role: {str(e)}")
            return False, f"Failed to get staff: {str(e)}", None
    
    def get_staff_statistics(self) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        """Get staff statistics"""
        try:
            # Get all staff
            success, message, all_staff = self.get_all_staff()
            if not success:
                return False, message, None
            
            if not all_staff:
                return True, "No staff data available", {
                    'total': 0,
                    'by_role': {},
                    'by_status': {},
                    'by_department': {}
                }
            
            # Calculate statistics
            stats = {
                'total': len(all_staff),
                'by_role': {},
                'by_status': {},
                'by_department': {}
            }
            
            for staff in all_staff:
                # Count by role
                stats['by_role'][staff.role] = stats['by_role'].get(staff.role, 0) + 1
                
                # Count by status
                stats['by_status'][staff.status] = stats['by_status'].get(staff.status, 0) + 1
                
                # Count by department
                stats['by_department'][staff.department] = stats['by_department'].get(staff.department, 0) + 1
            
            return True, "Statistics retrieved successfully", stats
            
        except Exception as e:
            print(f"Error getting staff statistics: {str(e)}")
            return False, f"Failed to get statistics: {str(e)}", None