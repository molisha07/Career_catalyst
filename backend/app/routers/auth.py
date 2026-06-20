from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=schemas.Token)
def signup(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == payload.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create user
    hashed_password = auth.get_password_hash(payload.password)
    user = models.User(email=payload.email, hashed_password=hashed_password, role=payload.role)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Initialize profiles
    if payload.role == "student":
        # Split username from email as initial default name
        default_name = payload.email.split("@")[0].capitalize()
        student = models.Student(user_id=user.id, name=default_name, profile_completion=10.0)
        db.add(student)
    elif payload.role == "recruiter":
        default_name = payload.email.split("@")[0].capitalize()
        # Create a mock company or default to null
        recruiter = models.Recruiter(user_id=user.id, name=default_name)
        db.add(recruiter)
    
    db.commit()

    # Generate token
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=schemas.Token)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not auth.verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}


# Standard Form support for FastAPI Swagger UI login testing
@router.post("/login/swagger", response_model=schemas.Token)
def login_swagger(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me")
def get_me(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    profile = None
    if current_user.role == "student":
        profile = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    elif current_user.role == "recruiter":
        profile = db.query(models.Recruiter).filter(models.Recruiter.user_id == current_user.id).first()

    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "created_at": current_user.created_at,
        "profile": profile
    }
