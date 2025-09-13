from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, donations

app = FastAPI(title="ShearBite Auth Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],  # Frontend URLs
    allow_credentials=True,  # Important for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(donations.router, prefix="/donations", tags=["donations"])
