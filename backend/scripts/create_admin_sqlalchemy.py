import os
import bcrypt
from dotenv import load_dotenv
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.db.database import SessionLocal
from app.models.user import User

# Load environment variables from .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

def create_admin():
    email = os.getenv("ADMIN_EMAIL")
    password = os.getenv("ADMIN_PASSWORD")
    name = os.getenv("ADMIN_NAME", "Admin")
    if not email or not password:
        print("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env")
        return

    db = SessionLocal()
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    admin = User(
        email=email,
        password=hashed_pw.decode("utf-8"),
        name=name,
        role="admin"
    )
    db.add(admin)
    db.commit()
    db.close()
    print(f"Admin user {email} created successfully.")

if __name__ == "__main__":
    create_admin() 