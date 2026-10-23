from typing import Literal
from pydantic import BaseModel
from .common import ORMModel


class UserOut(ORMModel):
    id: str
    auth0_id: str
    email: str
    name: str
    company: str
    role: str


class RoleUpdate(BaseModel):
    role: Literal["buyer", "supplier"]