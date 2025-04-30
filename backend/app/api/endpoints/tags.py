from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.blog import Tag
from app.schemas.blog import Tag as TagSchema
from app.schemas.blog import TagCreate
from slugify import slugify

router = APIRouter()

@router.get("/", response_model=List[TagSchema])
def get_tags(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    tags = db.query(Tag).offset(skip).limit(limit).all()
    return tags

@router.get("/{slug}", response_model=TagSchema)
def get_tag(slug: str, db: Session = Depends(get_db)):
    tag = db.query(Tag).filter(Tag.slug == slug).first()
    if tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag

@router.post("/", response_model=TagSchema)
def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    db_tag = Tag(
        name=tag.name,
        slug=slugify(tag.name)
    )
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

@router.put("/{slug}", response_model=TagSchema)
def update_tag(
    slug: str,
    tag: TagCreate,
    db: Session = Depends(get_db)
):
    db_tag = db.query(Tag).filter(Tag.slug == slug).first()
    if db_tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    db_tag.name = tag.name
    db_tag.slug = slugify(tag.name)
    
    db.commit()
    db.refresh(db_tag)
    return db_tag

@router.delete("/{slug}")
def delete_tag(slug: str, db: Session = Depends(get_db)):
    tag = db.query(Tag).filter(Tag.slug == slug).first()
    if tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    db.delete(tag)
    db.commit()
    return {"message": "Tag deleted successfully"} 