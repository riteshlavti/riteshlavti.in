from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Portfolio API"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./portfolio.db")
    
    @property
    def SQLITE_DB_PATH(self):
        if self.DATABASE_URL.startswith("sqlite:///"):
            return self.DATABASE_URL.replace("sqlite:///", "")
        return "backend/portfolio.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "https://www.riteshlavti-in.vercel.app"]
    
    # File Upload
    MAX_UPLOAD_SIZE: int = int(os.getenv("MAX_UPLOAD_SIZE", "5242880"))  # 5MB in bytes
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/gif"]
    
    # Contact Information
    DEFAULT_EMAIL: str = os.getenv("DEFAULT_EMAIL", "your.email@example.com")
    DEFAULT_PHONE: str = os.getenv("DEFAULT_PHONE", "+1234567890")
    DEFAULT_LOCATION: str = os.getenv("DEFAULT_LOCATION", "Your Location")
    
    # Upload Directories
    UPLOAD_DIR: str = "uploads"
    PROFILE_IMAGES_DIR: str = os.path.join(UPLOAD_DIR, "profile")
    PROJECT_IMAGES_DIR: str = os.path.join(UPLOAD_DIR, "projects")
    BLOG_IMAGES_DIR: str = os.path.join(UPLOAD_DIR, "blog")
    
    class Config:
        case_sensitive = True

settings = Settings() 