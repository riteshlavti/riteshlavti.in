from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BlogPostBase(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BlogPostBase):
    pass

class BlogPostInDBBase(BlogPostBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class BlogPost(BlogPostInDBBase):
    pass 