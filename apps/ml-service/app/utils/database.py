import os
from supabase import create_client, Client

class SupabaseManager:
    def __init__(self):
        url: str = os.environ.get("SUPABASE_URL", "")
        key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        self.client: Client = None
        
        if url and key:
            self.client = create_client(url, key)

    def log_anomaly(self, anomaly_data: dict):
        if not self.client:
            print(f"[MOCK LOG]: Anomaly detected - {anomaly_data}")
            return
            
        try:
            self.client.table("alerts").insert(anomaly_data).execute()
        except Exception as e:
            print(f"Failed to log to Supabase: {e}")

db_manager = SupabaseManager()
