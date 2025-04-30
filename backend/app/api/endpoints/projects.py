from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.project import Project
from app.schemas.project import Project as ProjectSchema
from app.schemas.project import ProjectCreate, ProjectUpdate
import json

router = APIRouter()

@router.get("/", response_model=List[ProjectSchema])
def get_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    featured_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    if featured_only:
        query = query.filter(Project.is_featured == True)
    projects = query.offset(skip).limit(limit).all()
    return [ProjectSchema(
        **p.__dict__,
        technologies=json.loads(p.technologies) if p.technologies else []
    ) for p in projects]

@router.get("/{project_id}", response_model=ProjectSchema)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectSchema(
        **project.__dict__,
        technologies=json.loads(project.technologies) if project.technologies else []
    )

@router.post("/", response_model=ProjectSchema)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(
        title=project.title,
        description=project.description,
        image_url=project.image_url,
        technologies=json.dumps(project.technologies),
        github_url=project.github_url,
        live_url=project.live_url,
        is_featured=project.is_featured
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return ProjectSchema(
        **db_project.__dict__,
        technologies=json.loads(db_project.technologies) if db_project.technologies else []
    )

@router.put("/{project_id}", response_model=ProjectSchema)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project.dict(exclude_unset=True)
    if "technologies" in update_data:
        update_data["technologies"] = json.dumps(update_data["technologies"])
    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    db.commit()
    db.refresh(db_project)
    return ProjectSchema(
        **db_project.__dict__,
        technologies=json.loads(db_project.technologies) if db_project.technologies else []
    )

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"} 