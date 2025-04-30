from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.contact import ContactInfo
from app.schemas.contact import ContactInfo as ContactInfoSchema
from app.schemas.contact import ContactInfoCreate, ContactInfoUpdate

router = APIRouter()

@router.get("/", response_model=ContactInfoSchema)
def get_contact_info(db: Session = Depends(get_db)):
    contact_info = db.query(ContactInfo).first()
    if not contact_info:
        raise HTTPException(status_code=404, detail="Contact information not found")
    return contact_info

@router.post("/", response_model=ContactInfoSchema)
def create_contact_info(contact_info: ContactInfoCreate, db: Session = Depends(get_db)):
    # Check if contact info already exists
    existing_info = db.query(ContactInfo).first()
    if existing_info:
        raise HTTPException(status_code=400, detail="Contact information already exists")
    
    db_contact_info = ContactInfo(**contact_info.dict())
    db.add(db_contact_info)
    db.commit()
    db.refresh(db_contact_info)
    return db_contact_info

@router.put("/", response_model=ContactInfoSchema)
def update_contact_info(
    contact_info: ContactInfoUpdate,
    db: Session = Depends(get_db)
):
    db_contact_info = db.query(ContactInfo).first()
    if not db_contact_info:
        raise HTTPException(status_code=404, detail="Contact information not found")
    
    update_data = contact_info.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_contact_info, field, value)
    
    db.commit()
    db.refresh(db_contact_info)
    return db_contact_info 