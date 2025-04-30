import os
import shutil
from fastapi import UploadFile, HTTPException
from datetime import datetime
from typing import Optional
from app.core.config import settings

# Create upload directories if they don't exist
for directory in [
    settings.UPLOAD_DIR,
    settings.PROFILE_IMAGES_DIR,
    settings.PROJECT_IMAGES_DIR,
    settings.BLOG_IMAGES_DIR
]:
    os.makedirs(directory, exist_ok=True)

async def save_upload_file(
    upload_file: UploadFile,
    directory: str,
    prefix: Optional[str] = None
) -> str:
    """
    Save an uploaded file to the specified directory.
    Returns the relative path to the saved file.
    """
    # Validate file size
    file_size = 0
    for chunk in upload_file.file:
        file_size += len(chunk)
        if file_size > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE} bytes"
            )
    
    # Reset file pointer
    await upload_file.seek(0)
    
    # Validate file type
    if upload_file.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(settings.ALLOWED_IMAGE_TYPES)}"
        )
    
    # Generate a unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{prefix}_{timestamp}_{upload_file.filename}" if prefix else f"{timestamp}_{upload_file.filename}"
    
    # Create the full file path
    file_path = os.path.join(directory, filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    # Return the relative path
    return os.path.join(directory, filename)

async def delete_file(file_path: str) -> bool:
    """
    Delete a file if it exists.
    Returns True if the file was deleted, False otherwise.
    """
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
    except Exception:
        return False 