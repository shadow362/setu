from fastapi import FastAPI

app = FastAPI(
    title="Setu API",
    description="Backend API for Setu",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}