from sqlalchemy import Column, Integer, String
from app.db.database import Base

class ContactInfo(Base):
    __tablename__ = "contact_info"

    id = Column(Integer, primary_key=True, index=True)
    profile_image = Column(String(255))  # Hero section
    contact_profile_image = Column(String(255))  # Contact section 