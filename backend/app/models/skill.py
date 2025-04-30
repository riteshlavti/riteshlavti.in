from sqlalchemy import Column, Integer, String
from app.db.database import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    icon = Column(String(50), nullable=False)  # Icon name from react-icons
    color = Column(String(7), nullable=False)  # Hex color code 