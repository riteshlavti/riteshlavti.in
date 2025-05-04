from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.project import Project
from app.schemas.project import Project as ProjectSchema
from app.schemas.project import ProjectCreate, ProjectUpdate
import json
from app.api.endpoints.auth import get_current_user
from app.models.user import User
from app.core.supabase_client import upload_to_supabase
import time

router = APIRouter()

@router.get("/", response_model=List[ProjectSchema])
def get_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    featured_only: bool = False,
    db: Session = Depends(get_db),
    request: Request = None
):
    query = db.query(Project)
    if featured_only:
        query = query.filter(Project.is_featured == True)
        query = query.order_by(Project.featured_order.asc().nullslast(), Project.created_at.desc())
    projects = query.offset(skip).limit(limit).all()
    results = []
    for p in projects:
        item = p.__dict__.copy()
        # Ensure technologies is always a list
        item['technologies'] = json.loads(p.technologies) if p.technologies else []
        # Fix image_url to be absolute URL if needed
        if item.get('image_url') and item['image_url'].startswith('/uploads/'):
            item['image_url'] = str(request.base_url).rstrip('/') + item['image_url']
        # Ensure all expected fields are present
        for field in [
            'id', 'title', 'description', 'excerpt', 'image_url', 'technologies', 'github_url', 'live_url', 'is_featured', 'featured_order', 'created_at', 'updated_at']:
            if field not in item:
                item[field] = None
        results.append(item)
    return results

@router.get("/featured", response_model=List[ProjectSchema])
def get_featured_projects(db: Session = Depends(get_db), request: Request = None):
    query = db.query(Project).filter(Project.is_featured == True)
    query = query.order_by(Project.featured_order.asc().nullslast(), Project.created_at.desc())
    projects = query.all()
    results = []
    for p in projects:
        item = p.__dict__.copy()
        item['technologies'] = json.loads(p.technologies) if p.technologies else []
        if item.get('image_url') and item['image_url'].startswith('/uploads/'):
            item['image_url'] = str(request.base_url).rstrip('/') + item['image_url']
        for field in [
            'id', 'title', 'description', 'excerpt', 'image_url', 'technologies', 'github_url', 'live_url', 'is_featured', 'featured_order', 'created_at', 'updated_at']:
            if field not in item:
                item[field] = None
        results.append(item)
    return results

@router.get("/{project_id}", response_model=ProjectSchema)
def get_project(project_id: int, db: Session = Depends(get_db), request: Request = None):
    project = db.query(Project).filter(Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    item = project.__dict__.copy()
    import json
    item['technologies'] = json.loads(project.technologies) if project.technologies else []
    # Fix image_url to be absolute URL if needed
    if item.get('image_url') and item['image_url'].startswith('/uploads/'):
        item['image_url'] = str(request.base_url).rstrip('/') + item['image_url']
    for field in [
        'id', 'title', 'description', 'excerpt', 'image_url', 'technologies', 'github_url', 'live_url', 'is_featured', 'created_at', 'updated_at']:
        if field not in item:
            item[field] = None
    return item

@router.post("/", response_model=ProjectSchema)
def create_project(project: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if project.image_url and not project.image_url.startswith('http'):
        raise HTTPException(status_code=400, detail="Project image_url must be a public Supabase URL. Upload the image first and use the returned URL.")
    db_project = Project(
        title=project.title,
        description=project.description,
        excerpt=project.excerpt,
        image_url=project.image_url,
        technologies=json.dumps(project.technologies),
        github_url=project.github_url,
        live_url=project.live_url,
        is_featured=project.is_featured,
        featured_order=project.featured_order,
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    data = db_project.__dict__.copy()
    data['technologies'] = json.loads(db_project.technologies) if db_project.technologies else []
    return ProjectSchema(**data)

@router.put("/{project_id}", response_model=ProjectSchema)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project.dict(exclude_unset=True)
    if "image_url" in update_data and update_data["image_url"] and not update_data["image_url"].startswith('http'):
        raise HTTPException(status_code=400, detail="Project image_url must be a public Supabase URL. Upload the image first and use the returned URL.")
    if "technologies" in update_data:
        update_data["technologies"] = json.dumps(update_data["technologies"])
    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    db.commit()
    db.refresh(db_project)
    data = db_project.__dict__.copy()
    data['technologies'] = json.loads(db_project.technologies) if db_project.technologies else []
    return ProjectSchema(**data)

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"} 