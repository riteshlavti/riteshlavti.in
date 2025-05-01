from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.endpoints import blog as blog_api, projects, skills, contact, upload, auth as auth_api
from app.core.config import settings
from app.db.database import Base, engine
from app.models import blog as blog_models  # For model registration only
from app.models import user as user_models  # Ensure users table is created
import os

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for the portfolio website",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(blog_api.router, prefix=f"{settings.API_V1_STR}/blog", tags=["blog"])
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["projects"])
app.include_router(skills.router, prefix=f"{settings.API_V1_STR}/skills", tags=["skills"])
app.include_router(contact.router, prefix=f"{settings.API_V1_STR}/contact", tags=["contact"])
app.include_router(upload.router, prefix=f"{settings.API_V1_STR}/upload", tags=["upload"])
app.include_router(auth_api.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])

@app.get("/")
def root():
    return {"message": "Welcome to the Portfolio API"}

@app.on_event("startup")
def init_db():
    Base.metadata.create_all(bind=engine) 