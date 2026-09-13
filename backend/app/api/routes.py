from fastapi import APIRouter, Depends, HTTPException
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.share import ShareItem
from app.schemas.share import ShareCreate, ShareResponse

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/shares", response_model=ShareResponse)
def create_share(share: ShareCreate, db: Session = Depends(get_db)):
    new_share = ShareItem(
        user_id=1,
        content=share.content,
        type=share.type,
    )

    db.add(new_share)
    db.commit()
    db.refresh(new_share)

    return new_share


@router.get("/shares", response_model=list[ShareResponse])
def get_shares(db: Session = Depends(get_db)):
    return (
        db.query(ShareItem)
        .filter(ShareItem.user_id == 1)
        .order_by(ShareItem.created_at.desc())
        .all()
    )


@router.delete("/shares/{share_id}")
def delete_share(share_id: int, db: Session = Depends(get_db)):
    share = (
        db.query(ShareItem)
        .filter(
            ShareItem.id == share_id,
            ShareItem.user_id == 1,
        )
        .first()
    )

    if not share:
        raise HTTPException(status_code=404, detail="Share not found")

    db.delete(share)
    db.commit()

    return {"message": "Share deleted successfully"}
