from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ShareCreate(BaseModel):
    content: str
    type: str


class ShareResponse(BaseModel):
    id: int
    content: str
    type: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
