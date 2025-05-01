from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True

# Tag Schemas
class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: int
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True

# Comment Schemas
class CommentBase(BaseModel):
    content: str
    author_name: str
    author_email: EmailStr

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    post_id: int
    parent_id: Optional[int] = None
    created_at: datetime
    replies: List['Comment'] = []

    class Config:
        from_attributes = True

# Blog Post Schemas
class BlogPostBase(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    is_published: bool = False
    read_time: Optional[str] = None
    author_name: Optional[str] = None
    author_avatar: Optional[str] = None
    related_posts: Optional[List[str]] = []

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BlogPostBase):
    title: Optional[str] = None
    content: Optional[str] = None

class BlogPost(BlogPostBase):
    id: int
    slug: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    comments: List[Comment] = []

    class Config:
        from_attributes = True 