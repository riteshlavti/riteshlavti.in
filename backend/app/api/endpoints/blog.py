from fastapi import APIRouter, Depends, HTTPException, Query, Request, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from typing import List
from app.db.database import get_db
from app.models.blog import BlogPost, Category, Tag
from app.schemas.blog import BlogPost as BlogPostSchema
from app.schemas.blog import BlogPostCreate, BlogPostUpdate
from slugify import slugify
from app.core.file_utils import save_upload_file
from app.core.config import settings
from app.api.endpoints.auth import get_current_user
from app.models.user import User

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
        # Ensure related_posts is always a list of strings
        item['related_posts'] = post.related_posts.split(',') if post.related_posts else []
        # Ensure tags is always a list of tag names
        item['tags'] = [tag.name for tag in post.tags]
        # Fix featured_image to be absolute URL
        if item.get('featured_image') and item['featured_image'].startswith('/uploads/'):
            item['featured_image'] = str(request.base_url).rstrip('/') + item['featured_image']
        # Ensure all expected fields are present
        for field in [
            'id', 'slug', 'title', 'content', 'excerpt', 'featured_image', 'is_published',
            'read_time', 'author_name', 'author_avatar', 'created_at', 'updated_at', 'related_posts', 'tags']:
            if field not in item:
                item[field] = None
        results.append(item)
    return results

@router.get("/{slug}", response_model=BlogPostSchema)
def get_blog_post(slug: str, db: Session = Depends(get_db), request: Request = None):
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    result = post.__dict__.copy()
    # Ensure related_posts is always a list of strings
    result['related_posts'] = post.related_posts.split(',') if post.related_posts else []
    # Ensure tags is always a list of tag names
    result['tags'] = [tag.name for tag in post.tags]
    # Fix featured_image to be absolute URL
    if result.get('featured_image') and result['featured_image'].startswith('/uploads/'):
        result['featured_image'] = str(request.base_url).rstrip('/') + result['featured_image']
    # Ensure all expected fields are present
    for field in [
        'id', 'slug', 'title', 'content', 'excerpt', 'featured_image', 'is_published',
        'read_time', 'author_name', 'author_avatar', 'created_at', 'updated_at', 'related_posts', 'tags']:
        if field not in result:
            result[field] = None
    return result

@router.post("/", response_model=BlogPostSchema)
async def create_blog_post(
    title: str = Form(...),
    content: str = Form(...),
    excerpt: str = Form(None),
    is_published: bool = Form(False),
    read_time: str = Form(None),
    author_name: str = Form(None),
    author_avatar: str = Form(None),
    related_posts: str = Form(None),  # comma-separated slugs
    tags: str = Form(None),  # comma-separated tag names
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    request: Request = None,
    current_user: User = Depends(get_current_user)  # Require authentication
):
    # Validation for required fields
    if not title or not title.strip():
        raise HTTPException(status_code=400, detail="Title is required.")
    if not content or not content.strip():
        raise HTTPException(status_code=400, detail="Content is required.")
    # Save image if provided
    featured_image = None
    if image:
        image_path = await save_upload_file(image, settings.BLOG_IMAGES_DIR, "blog")
        # Always use forward slashes and only the filename for the URL
        filename = image_path.replace("\\", "/").split("/")[-1]
        featured_image = f"/uploads/blog/{filename}"
    # Handle related_posts as list
    related_posts_list = related_posts.split(',') if related_posts else []
    base_slug = slugify(title)
    slug = base_slug
    i = 1
    while db.query(BlogPost).filter(BlogPost.slug == slug).first():
        slug = f"{base_slug}-{i}"
        i += 1
    db_post = BlogPost(
        title=title,
        slug=slug,
        content=content,
        excerpt=excerpt,
        featured_image=featured_image,
        is_published=is_published,
        read_time=read_time,
        author_name=author_name,
        author_avatar=author_avatar,
        related_posts=','.join(related_posts_list) if related_posts_list else None
    )
    # Handle tags
    tag_objs = []
    if tags:
        tag_names = [t.strip() for t in tags.split(',') if t.strip()]
        for tag_name in tag_names:
            tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if not tag:
                tag = Tag(name=tag_name, slug=slugify(tag_name))
                db.add(tag)
                db.commit()
                db.refresh(tag)
            tag_objs.append(tag)
    db_post.tags = tag_objs
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    result = db_post.__dict__.copy()
    result['related_posts'] = db_post.related_posts.split(',') if db_post.related_posts else []
    result['tags'] = [tag.name for tag in db_post.tags]
    # Fix featured_image to be absolute URL
    if result.get('featured_image') and result['featured_image'].startswith('/uploads/'):
        result['featured_image'] = str(request.base_url).rstrip('/') + result['featured_image']
    return result

@router.put("/{slug}", response_model=BlogPostSchema)
async def update_blog_post(
    slug: str,
    title: str = Form(None),
    content: str = Form(None),
    excerpt: str = Form(None),
    is_published: bool = Form(None),
    read_time: str = Form(None),
    author_name: str = Form(None),
    author_avatar: str = Form(None),
    related_posts: str = Form(None),  # comma-separated slugs
    tags: str = Form(None),  # comma-separated tag names
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    request: Request = None,
    current_user: User = Depends(get_current_user)  # Require authentication
):
    db_post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    # Validation for required fields if updating them
    if title is not None and not title.strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty.")
    if content is not None and not content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    # Update fields if provided
    if title is not None:
        db_post.title = title
        # Optionally update slug if title changes
        base_slug = slugify(title)
        new_slug = base_slug
        i = 1
        while db.query(BlogPost).filter(BlogPost.slug == new_slug, BlogPost.id != db_post.id).first():
            new_slug = f"{base_slug}-{i}"
            i += 1
        db_post.slug = new_slug
    if content is not None:
        db_post.content = content
    if excerpt is not None:
        db_post.excerpt = excerpt
    if is_published is not None:
        db_post.is_published = is_published
    if read_time is not None:
        db_post.read_time = read_time
    if author_name is not None:
        db_post.author_name = author_name
    if author_avatar is not None:
        db_post.author_avatar = author_avatar
    if related_posts is not None:
        db_post.related_posts = related_posts
    # Handle tags
    tag_objs = []
    if tags:
        tag_names = [t.strip() for t in tags.split(',') if t.strip()]
        for tag_name in tag_names:
            tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if not tag:
                tag = Tag(name=tag_name, slug=slugify(tag_name))
                db.add(tag)
                db.commit()
                db.refresh(tag)
            tag_objs.append(tag)
    if tags is not None:
        db_post.tags = tag_objs
    # Handle image upload
    if image:
        image_path = await save_upload_file(image, settings.BLOG_IMAGES_DIR, "blog")
        filename = image_path.replace("\\", "/").split("/")[-1]
        db_post.featured_image = f"/uploads/blog/{filename}"
    db.commit()
    db.refresh(db_post)
    result = db_post.__dict__.copy()
    result['related_posts'] = db_post.related_posts.split(',') if db_post.related_posts else []
    result['tags'] = [tag.name for tag in db_post.tags]
    if result.get('featured_image') and result['featured_image'].startswith('/uploads/'):
        result['featured_image'] = str(request.base_url).rstrip('/') + result['featured_image']
    return result

@router.delete("/{slug}")
def delete_blog_post(slug: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    db.delete(post)
    db.commit()
    return {"message": "Blog post deleted successfully"} 