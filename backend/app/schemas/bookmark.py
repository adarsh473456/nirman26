from pydantic import BaseModel

class BookmarkState(BaseModel):
    ok: bool = True
