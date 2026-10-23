from fastapi import APIRouter, Depends, File, UploadFile
from app.api.dependencies import require_role
from app.models import User
from app.services.s3_service import upload_supplier_file

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("/supplier/{supplier_id}/{folder}")
async def upload(supplier_id: str, folder: str, file: UploadFile = File(...), _: User = Depends(require_role("supplier", "admin"))):
    uri = await upload_supplier_file(file, supplier_id, folder)
    return {"uri": uri}