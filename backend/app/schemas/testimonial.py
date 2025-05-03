from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TestimonialBase(BaseModel):
    name: str
    role: Optional[str] = None
    text: str
    rating: Optional[int] = 5
    verify_url: Optional[str] = None

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(TestimonialBase):
    pass

class Testimonial(TestimonialBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True 