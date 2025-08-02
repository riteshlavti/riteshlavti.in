from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Base schema
class ProjectBase(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    technologies: List[str]
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    is_featured: bool = False

# For POST (create)
class ProjectCreate(ProjectBase):
    pass

# For PUT (update)
class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    technologies: Optional[List[str]] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    is_featured: Optional[bool] = None

# Response schema
class Project(ProjectBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True