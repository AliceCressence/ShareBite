from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin, UserOut
from app.crud.user import create_user, authenticate_user, get_user_by_email
from app.utils.jwt import create_access_token, create_refresh_token, decode_token
from app.deps import get_db, get_current_user
from app.core.config import settings

router = APIRouter()


@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(db, user_in.email, user_in.password)
    return user


@router.post("/login")
def login(response: Response, creds: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, creds.email, creds.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access = create_access_token({"sub": str(user.id)})
    refresh = create_refresh_token({"sub": str(user.id)})

    # Set access token cookie
    response.set_cookie(
        key="access_token",
        value=access,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=60 * 15,  # 15 minutes
    )

    # Set refresh token cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 7 days
        path="/auth/refresh",
    )

    return {"success": True, "message": "Logged in successfully"}


@router.get("/me", response_model=UserOut)
def get_current_user_info(current_user: UserOut = Depends(get_current_user)):
    """Get current user information"""
    return current_user


@router.post("/refresh")
def refresh(response: Response, refresh_token: str = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")
    try:
        payload = decode_token(refresh_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user_id = payload.get("sub")
    access = create_access_token({"sub": user_id})
    new_refresh = create_refresh_token({"sub": user_id})

    # Set new access token cookie
    response.set_cookie(
        key="access_token",
        value=access,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=60 * 15,  # 15 minutes
    )

    # Set new refresh token cookie
    response.set_cookie(
        key="refresh_token",
        value=new_refresh,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 7 days
        path="/auth/refresh",
    )

    return {"success": True, "message": "Token refreshed successfully"}


@router.post("/logout")
def logout(response: Response):
    """Logout by clearing auth cookies"""
    response.delete_cookie(
        key="access_token",
    )
    response.delete_cookie(
        key="refresh_token",
        path="/auth/refresh",
    )
    return {"success": True, "message": "Logged out successfully"}
