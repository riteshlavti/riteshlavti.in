from sqlalchemy import Column, Integer, String, JSON
from app.db.database import Base

class ContactInfo(Base):
    __tablename__ = "contact_info"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), nullable=False)
    phone = Column(String(20))
    location = Column(String(100))
    social_links = Column(JSON)  # Store social media links as JSON
    profile_image = Column(String(255))  # URL to profile image 