from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.session import Base, engine

# IMPORTANT:
# Import models before create_all so SQLAlchemy knows
# which tables need to exist.
import app.models


# ---------------------------------------------------------
# CREATE DATABASE TABLES
# ---------------------------------------------------------

Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------
# FASTAPI APPLICATION
# ---------------------------------------------------------

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# ROUTERS
# ---------------------------------------------------------

from app.api.routes import (
    users,
    suppliers,
    bookmarks,
    rfqs,
    orders,
    verification,
    search,
    uploads,
    v1_features,
)

app.include_router(users.router)
app.include_router(suppliers.router)
app.include_router(bookmarks.router)
app.include_router(rfqs.router)
app.include_router(orders.router)
app.include_router(verification.router)
app.include_router(search.router)
app.include_router(uploads.router)
app.include_router(v1_features.router)


# ---------------------------------------------------------
# ROOT
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Nirman Supplier Discovery API is running"
    }


# ---------------------------------------------------------
# HEALTH
# ---------------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "ok"
    }