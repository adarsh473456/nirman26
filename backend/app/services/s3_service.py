from pathlib import Path
import uuid
import boto3
from fastapi import UploadFile, HTTPException
from app.core.config import settings

ALLOWED_FOLDERS = {"images", "certifications"}
MAX_BYTES = 10 * 1024 * 1024


def s3_client():
    kwargs = {"region_name": settings.aws_region}
    if settings.aws_access_key_id and settings.aws_secret_access_key:
        kwargs.update(aws_access_key_id=settings.aws_access_key_id, aws_secret_access_key=settings.aws_secret_access_key)
    return boto3.client("s3", **kwargs)


async def upload_supplier_file(file: UploadFile, supplier_id: str, folder: str) -> str:
    if folder not in ALLOWED_FOLDERS:
        raise HTTPException(status_code=400, detail="Invalid upload folder")
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")
    if len(content) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 10 MB)")
    suffix = Path(file.filename or "upload.bin").suffix.lower()
    key = f"suppliers/{supplier_id}/{folder}/{uuid.uuid4().hex}{suffix}"

    if settings.aws_s3_bucket:
        s3_client().put_object(Bucket=settings.aws_s3_bucket, Key=key, Body=content, ContentType=file.content_type or "application/octet-stream")
        return f"s3://{settings.aws_s3_bucket}/{key}"

    local = Path(settings.local_upload_dir) / key
    local.parent.mkdir(parents=True, exist_ok=True)
    local.write_bytes(content)
    return f"/files/{key}"
