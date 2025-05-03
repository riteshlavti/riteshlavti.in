from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.testimonial import Testimonial
from app.schemas.testimonial import Testimonial as TestimonialSchema, TestimonialCreate, TestimonialUpdate
from app.api.endpoints.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[TestimonialSchema])
def get_testimonials(db: Session = Depends(get_db)):
    return db.query(Testimonial).all()

@router.get("/{testimonial_id}", response_model=TestimonialSchema)
def get_testimonial(testimonial_id: int, db: Session = Depends(get_db)):
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return testimonial

@router.post("/", response_model=TestimonialSchema)
def create_testimonial(testimonial: TestimonialCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_testimonial = Testimonial(**testimonial.dict())
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

@router.put("/{testimonial_id}", response_model=TestimonialSchema)
def update_testimonial(testimonial_id: int, testimonial: TestimonialUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for field, value in testimonial.dict(exclude_unset=True).items():
        setattr(db_testimonial, field, value)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

@router.delete("/{testimonial_id}")
def delete_testimonial(testimonial_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(db_testimonial)
    db.commit()
    return {"detail": "Testimonial deleted"} 