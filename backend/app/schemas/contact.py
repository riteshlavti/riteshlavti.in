from pydantic import BaseModel
from typing import Optional

class ContactInfoBase(BaseModel):
    profile_image: Optional[str] = None
    contact_profile_image: Optional[str] = None

class ContactInfoCreate(ContactInfoBase):
    pass

class ContactInfoUpdate(ContactInfoBase):
    pass

class ContactInfo(ContactInfoBase):
    id: int

    class Config:
        from_attributes = True 