from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from app.core.supabase_client import upload_to_supabase
import time

router = APIRouter()

def generate_file_name(prefix: str, filename: str):
    timestamp = int(time.time())
    ext = filename.split('.')[-1]
    return f"{prefix}/{timestamp}_{filename.replace(' ', '_')}"

@router.post("/profile")
async def upload_profile_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    contents = await file.read()
    filename = generate_file_name("profile", file.filename)
    url = upload_to_supabase("profile-images", filename, contents, file.content_type)
    return {"url": url}

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    contents = await file.read()
    filename = generate_file_name("project", file.filename)
    url = upload_to_supabase("project-images", filename, contents, file.content_type)
    return {"url": url}
