from fastapi import FastAPI

from app.api.routes import router
from app.db.database import Base, engine
from app.models.share import ShareItem
from app.models.user import User

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Setu API",
    description="Backend API for Setu",
    version="0.1.0",
)


app.include_router(router)


@app.get("/health")
def health_check():
    return {"status": "ok"}

