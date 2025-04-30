from fastapi import APIRouter, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
import bcrypt

router = APIRouter()

@router.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == username).first()
    if not user or not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user": {"email": user.email, "name": user.name, "role": user.role}} 