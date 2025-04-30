from pydantic import BaseModel, EmailStr
from typing import Dict, Optional

class SocialLinks(BaseModel):
    github: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    instagram: Optional[str] = None

class ContactInfoBase(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    social_links: SocialLinks
    profile_image: Optional[str] = None

class ContactInfoCreate(ContactInfoBase):
    pass

class ContactInfoUpdate(ContactInfoBase):
    email: Optional[EmailStr] = None
    social_links: Optional[SocialLinks] = None

class ContactInfo(ContactInfoBase):
    id: int

    class Config:
        from_attributes = True 