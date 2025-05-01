from fastapi import APIRouter, Depends, HTTPException, Query, Request
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
    db: Session = Depends(get_db),
    request: Request = None
):
    query = db.query(BlogPost)
    
    if category_slug:
        query = query.join(Category).filter(Category.slug == category_slug)
    
    if tag_slug:
        query = query.join(BlogPost.tags).filter(Tag.slug == tag_slug)
    
    posts = query.offset(skip).limit(limit).all()
    # Convert related_posts and tags to list for each post
    results = []
    for post in posts:
        item = post.__dict__.copy()
        item['related_posts'] = post.related_posts.split(',') if post.related_posts else []
        item['tags'] = [tag.name for tag in post.tags]  # or tag.slug
        # Fix featured_image to be absolute URL
        if item.get('featured_image') and item['featured_image'].startswith('/uploads/'):
            item['featured_image'] = str(request.base_url).rstrip('/') + item['featured_image']
        results.append(item)
    return results

@router.get("/{slug}", response_model=BlogPostSchema)
def get_blog_post(slug: str, db: Session = Depends(get_db), request: Request = None):
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    result = post.__dict__.copy()
    result['related_posts'] = post.related_posts.split(',') if post.related_posts else []
    result['tags'] = [tag.name for tag in post.tags]  # or tag.slug
    # Fix featured_image to be absolute URL
    if result.get('featured_image') and result['featured_image'].startswith('/uploads/'):
        result['featured_image'] = str(request.base_url).rstrip('/') + result['featured_image']
    return result

@router.post("/", response_model=BlogPostSchema)
def create_blog_post(post: BlogPostCreate, db: Session = Depends(get_db), request: Request = None):
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
        is_published=post.is_published,
        read_time=post.read_time,
        author_name=post.author_name,
        author_avatar=post.author_avatar,
        related_posts=','.join(post.related_posts) if post.related_posts else None
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    # Convert related_posts and tags to list for response
    result = db_post.__dict__.copy()
    result['related_posts'] = db_post.related_posts.split(',') if db_post.related_posts else []
    result['tags'] = [tag.name for tag in db_post.tags]  # or tag.slug
    # Fix featured_image to be absolute URL
    if result.get('featured_image') and result['featured_image'].startswith('/uploads/'):
        result['featured_image'] = str(request.base_url).rstrip('/') + result['featured_image']
    return result

@router.put("/{slug}", response_model=BlogPostSchema)
def update_blog_post(
    slug: str,
    post: BlogPostUpdate,
    db: Session = Depends(get_db),
    request: Request = None
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
        if field == 'related_posts' and value is not None:
            setattr(db_post, field, ','.join(value))
        elif field != 'tag_ids':
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
    # Convert related_posts and tags to list for response
    result = db_post.__dict__.copy()
    result['related_posts'] = db_post.related_posts.split(',') if db_post.related_posts else []
    result['tags'] = [tag.name for tag in db_post.tags]  # or tag.slug
    # Fix featured_image to be absolute URL
    if result.get('featured_image') and result['featured_image'].startswith('/uploads/'):
        result['featured_image'] = str(request.base_url).rstrip('/') + result['featured_image']
    return result

@router.delete("/{slug}")
def delete_blog_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    db.delete(post)
    db.commit()
    return {"message": "Blog post deleted successfully"} 