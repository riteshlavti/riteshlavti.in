from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.skill import Skill
from app.schemas.skill import Skill as SkillSchema
from app.schemas.skill import SkillCreate, SkillUpdate
from app.api.endpoints.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[SkillSchema])
def get_skills(db: Session = Depends(get_db)):
    skills = db.query(Skill).all()
    results = []
    for skill in skills:
        item = skill.__dict__.copy()
        for field in ['id', 'name', 'level', 'created_at', 'updated_at']:
            if field not in item:
                item[field] = None
        if item.get('image_url') and item['image_url'].startswith('/uploads/'):
            item['image_url'] = str(request.base_url).rstrip('/') + item['image_url']
        results.append(item)
    return results

@router.get("/{skill_id}", response_model=SkillSchema)
def get_skill(skill_id: int, db: Session = Depends(get_db)):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    item = skill.__dict__.copy()
    for field in ['id', 'name', 'level', 'created_at', 'updated_at']:
        if field not in item:
            item[field] = None
    if item.get('image_url') and item['image_url'].startswith('/uploads/'):
        item['image_url'] = str(request.base_url).rstrip('/') + item['image_url']
    return item

@router.post("/", response_model=SkillSchema)
def create_skill(skill: SkillCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_skill = Skill(**skill.dict())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.put("/{skill_id}", response_model=SkillSchema)
def update_skill(
    skill_id: int,
    skill: SkillUpdate,
    db: Session = Depends(get_db)
):
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if db_skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    update_data = skill.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_skill, field, value)
    
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.delete("/{skill_id}")
def delete_skill(skill_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    db.delete(skill)
    db.commit()
    return {"message": "Skill deleted successfully"} 