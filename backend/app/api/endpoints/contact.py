from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from app.db.database import get_db
from app.models.contact import ContactInfo
from app.schemas.contact import ContactInfo as ContactInfoSchema
from app.schemas.contact import ContactInfoCreate, ContactInfoUpdate
from app.core.config import settings
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
from app.api.endpoints.auth import get_current_user
from app.models.user import User
from app.core.supabase_client import upload_to_supabase
import time

router = APIRouter()

limiter = Limiter(key_func=get_remote_address)

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str
    linkedin: str = None
    mobile: str = None

@router.get("/", response_model=ContactInfoSchema)
def get_contact_info(db: Session = Depends(get_db)):
    contact_info = db.query(ContactInfo).first()
    if not contact_info:
        raise HTTPException(status_code=404, detail="Contact information not found")
    # Normalize slashes for image paths
    if contact_info.profile_image:
        contact_info.profile_image = contact_info.profile_image.replace("\\", "/")
    if contact_info.contact_profile_image:
        contact_info.contact_profile_image = contact_info.contact_profile_image.replace("\\", "/")
    return contact_info

@router.post("/", response_model=ContactInfoSchema)
def create_contact_info(contact_info: ContactInfoCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if contact info already exists
    existing_info = db.query(ContactInfo).first()
    if existing_info:
        raise HTTPException(status_code=400, detail="Contact information already exists")
    if (contact_info.profile_image and not contact_info.profile_image.startswith('http')) or \
       (contact_info.contact_profile_image and not contact_info.contact_profile_image.startswith('http')):
        raise HTTPException(status_code=400, detail="Profile images must be public Supabase URLs. Upload the image first and use the returned URL.")
    db_contact_info = ContactInfo(**contact_info.dict())
    db.add(db_contact_info)
    db.commit()
    db.refresh(db_contact_info)
    return db_contact_info

@router.put("/", response_model=ContactInfoSchema)
def upsert_contact_info(
    contact_info: ContactInfoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_contact_info = db.query(ContactInfo).first()
    if not db_contact_info:
        # If no row exists, create one
        if (contact_info.profile_image and not contact_info.profile_image.startswith('http')) or \
           (contact_info.contact_profile_image and not contact_info.contact_profile_image.startswith('http')):
            raise HTTPException(status_code=400, detail="Profile images must be public Supabase URLs. Upload the image first and use the returned URL.")
        db_contact_info = ContactInfo(**contact_info.dict(exclude_unset=True))
        db.add(db_contact_info)
    else:
        # If row exists, update it
        update_data = contact_info.dict(exclude_unset=True)
        if (update_data.get('profile_image') and not update_data['profile_image'].startswith('http')) or \
           (update_data.get('contact_profile_image') and not update_data['contact_profile_image'].startswith('http')):
            raise HTTPException(status_code=400, detail="Profile images must be public Supabase URLs. Upload the image first and use the returned URL.")
        for field, value in update_data.items():
            setattr(db_contact_info, field, value)
    db.commit()
    db.refresh(db_contact_info)
    # Normalize slashes for image paths
    if db_contact_info.profile_image:
        db_contact_info.profile_image = db_contact_info.profile_image.replace("\\", "/")
    if db_contact_info.contact_profile_image:
        db_contact_info.contact_profile_image = db_contact_info.contact_profile_image.replace("\\", "/")
    return db_contact_info

@router.post("/send-message")
@limiter.limit("3/hour")
def send_message(data: ContactMessage, request: Request):
    # Compose email
    subject = f"Portfolio Contact Form: Message from {data.name}"
    body = f"Name: {data.name}\nEmail: {data.email}\n"
    if data.linkedin:
        body += f"LinkedIn ID: {data.linkedin}\n"
    if data.mobile:
        body += f"Mobile: {data.mobile}\n"
    body += f"\nMessage:\n{data.message}"
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM_EMAIL
    msg["To"] = settings.SMTP_TO_EMAIL

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_TLS:
                server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM_EMAIL, settings.SMTP_TO_EMAIL, msg.as_string())
        return {"success": True, "message": "Message sent successfully."}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to send message: {str(e)}") 