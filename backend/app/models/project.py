from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.database import Base
import json

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(String(255))
    technologies = Column(String)  # Store as JSON string
    github_url = Column(String(255))
    live_url = Column(String(255))
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    @property
    def technologies_list(self):
        try:
            return json.loads(self.technologies) if self.technologies else []
        except Exception:
            return []

    @technologies_list.setter
    def technologies_list(self, value):
        self.technologies = json.dumps(value) 
