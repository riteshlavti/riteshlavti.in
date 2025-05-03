from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(255))  # e.g., Company or Role
    text = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    verify_url = Column(String(255), nullable=True)  # Link to verify authenticity, optional
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 