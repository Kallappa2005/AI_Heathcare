from datetime import datetime

class LabReport:
    def __init__(self, patient_id, test_type, test_name, collection_date, result_date, 
                 status='completed', priority='normal', order_date=None, notes='', 
                 test_results=None, created_by=None, id=None):
        self.id = id
        self.patient_id = patient_id
        self.test_type = test_type
        self.test_name = test_name
        self.order_date = order_date
        self.collection_date = collection_date
        self.result_date = result_date
        self.status = status
        self.priority = priority
        self.notes = notes
        self.test_results = test_results or []
        self.created_by = created_by
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'test_type': self.test_type,
            'test_name': self.test_name,
            'order_date': self.order_date.isoformat() if self.order_date else None,
            'collection_date': self.collection_date.isoformat() if self.collection_date else None,
            'result_date': self.result_date.isoformat() if self.result_date else None,
            'status': self.status,
            'priority': self.priority,
            'notes': self.notes,
            'test_results': self.test_results,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            id=data.get('id'),
            patient_id=data.get('patient_id'),
            test_type=data.get('test_type'),
            test_name=data.get('test_name'),
            order_date=datetime.fromisoformat(data['order_date']) if data.get('order_date') else None,
            collection_date=datetime.fromisoformat(data['collection_date']) if data.get('collection_date') else None,
            result_date=datetime.fromisoformat(data['result_date']) if data.get('result_date') else None,
            status=data.get('status', 'completed'),
            priority=data.get('priority', 'normal'),
            notes=data.get('notes', ''),
            test_results=data.get('test_results', []),
            created_by=data.get('created_by')
        )