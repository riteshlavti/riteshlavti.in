from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class ProjectBase(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    technologies: List[str]
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    is_featured: bool = False

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    title: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None

class Project(ProjectBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True 