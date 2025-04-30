from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from typing import List
from app.db.database import get_db
from app.models.blog import BlogPost, Category, Tag
from app.schemas.blog import BlogPost as BlogPostSchema
from app.schemas.blog import BlogPostCreate, BlogPostUpdate
from slugify import slugify

router = APIRouter()

@router.get("/", response_model=List[BlogPostSchema])
def get_blog_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category_slug: str = None,
    tag_slug: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(BlogPost)
    
    if category_slug:
        query = query.join(Category).filter(Category.slug == category_slug)
    
    if tag_slug:
        query = query.join(BlogPost.tags).filter(Tag.slug == tag_slug)
    
    posts = query.offset(skip).limit(limit).all()
    return posts

@router.get("/{slug}", response_model=BlogPostSchema)
def get_blog_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post

@router.post("/", response_model=BlogPostSchema)
def create_blog_post(post: BlogPostCreate, db: Session = Depends(get_db)):
    base_slug = slugify(post.title)
    slug = base_slug
    i = 1
    # Ensure slug uniqueness
    while db.query(BlogPost).filter(BlogPost.slug == slug).first():
        slug = f"{base_slug}-{i}"
        i += 1
    db_post = BlogPost(
        title=post.title,
        slug=slug,
        content=post.content,
        excerpt=post.excerpt,
        featured_image=post.featured_image,
        is_published=post.is_published
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.put("/{slug}", response_model=BlogPostSchema)
def update_blog_post(
    slug: str,
    post: BlogPostUpdate,
    db: Session = Depends(get_db)
):
    db_post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    # Check if category exists
    if hasattr(post, 'category_id') and post.category_id:
        category = db.query(Category).filter(Category.id == post.category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
    
    # Update post fields
    update_data = post.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field != 'tag_ids':
            setattr(db_post, field, value)
    
    # Update title and slug if title is changed
    if 'title' in update_data:
        base_slug = slugify(db_post.title)
        new_slug = base_slug
        i = 1
        while db.query(BlogPost).filter(BlogPost.slug == new_slug, BlogPost.id != db_post.id).first():
            new_slug = f"{base_slug}-{i}"
            i += 1
        db_post.slug = new_slug
    
    # Update tags if provided
    if 'tag_ids' in update_data:
        tags = db.query(Tag).filter(Tag.id.in_(post.tag_ids)).all()
        if len(tags) != len(post.tag_ids):
            raise HTTPException(status_code=404, detail="One or more tags not found")
        db_post.tags = tags
    
    db.commit()
    db.refresh(db_post)
    return db_post

@router.delete("/{slug}")
def delete_blog_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    db.delete(post)
    db.commit()
    return {"message": "Blog post deleted successfully"} 