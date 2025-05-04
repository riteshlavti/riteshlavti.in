# backend/app/core/supabase_client.py

import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")

def get_supabase_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_to_supabase(bucket: str, path: str, file_content: bytes, content_type: str) -> str:
    supabase = get_supabase_client()
    # Upload file
    supabase.storage.from_(bucket).upload(path, file_content, {"content-type": content_type})
    # Get public URL
    public_url = supabase.storage.from_(bucket).get_public_url(path)
    return public_url