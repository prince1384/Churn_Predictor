from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_db, Base, engine
from app.models.user import User
from app.auth import get_password_hash, verify_password, create_access_token

# Create DB tables
Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/auth", tags=["Auth"])

# Register
@router.post("/register")
def register(username: str, email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter((User.username == username) | (User.email == email)).first()
    if user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    hashed_pw = get_password_hash(password)
    new_user = User(username=username, email=email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "User registered successfully"}

# Login
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
