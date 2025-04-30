from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.file_utils import save_upload_file
from app.core.config import settings
import os

router = APIRouter()

@router.post("/profile")
async def upload_profile_image(file: UploadFile = File(...)):
    """
    Upload a profile image.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    file_path = await save_upload_file(file, settings.PROFILE_IMAGES_DIR, "profile")
    return {"file_path": file_path}

@router.post("/project")
async def upload_project_image(file: UploadFile = File(...)):
    """
    Upload a project image.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    file_path = await save_upload_file(file, settings.PROJECT_IMAGES_DIR, "project")
    return {"file_path": file_path}

@router.post("/blog")
async def upload_blog_image(file: UploadFile = File(...)):
    """
    Upload a blog post image.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    file_path = await save_upload_file(file, settings.BLOG_IMAGES_DIR, "blog")
    return {"file_path": file_path}

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    # Determine upload directory based on usage (default to blog images)
    upload_dir = settings.BLOG_IMAGES_DIR
    file_path = await save_upload_file(file, upload_dir, "blog")
    url = f"/uploads/blog/{os.path.basename(file_path)}"
    return {"url": url} 