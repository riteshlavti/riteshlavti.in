from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func
from app.db.database import Base

# Association table for many-to-many relationship between posts and tags
post_tags = Table(
    'post_tags',
    Base.metadata,
    Column('post_id', Integer, ForeignKey('blog_posts.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    description = Column(String(200))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship with posts
    posts = relationship("BlogPost", back_populates="category")

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship with posts
    posts = relationship("BlogPost", secondary=post_tags, back_populates="tags")

class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(String(500))
    featured_image = Column(String(255))
    is_published = Column(Boolean, default=False)
    read_time = Column(String(50))
    author_name = Column(String(100))
    author_avatar = Column(String(255))
    related_posts = Column(String(500))  # comma-separated slugs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    category_id = Column(Integer, ForeignKey('categories.id'))
    
    # Relationships
    category = relationship("Category", back_populates="posts")
    tags = relationship("Tag", secondary=post_tags, back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    author_name = Column(String(100), nullable=False)
    author_email = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign keys
    post_id = Column(Integer, ForeignKey('blog_posts.id'))
    parent_id = Column(Integer, ForeignKey('comments.id'), nullable=True)
    
    # Relationships
    post = relationship("BlogPost", back_populates="comments")
    replies = relationship(
        "Comment",
        backref=backref("parent", remote_side=[id]),
        cascade="all, delete-orphan"
    ) 