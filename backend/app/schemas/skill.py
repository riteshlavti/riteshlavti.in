from pydantic import BaseModel
from typing import Optional

class SkillBase(BaseModel):
    name: str
    icon: str
    color: str

class SkillCreate(SkillBase):
    pass

class SkillUpdate(SkillBase):
    name: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None

class Skill(SkillBase):
    id: int

    class Config:
        from_attributes = True 