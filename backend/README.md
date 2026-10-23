# Nirman Pilot Backend

FastAPI backend for the Phase 1 supplier-discovery pilot. It provides Auth0-protected user, supplier, search, bookmark, RFQ, manual-verification and upload endpoints. PostgreSQL is the source of truth; Elasticsearch is used for supplier search; S3 is used for production file storage.

Run locally from `backend/` with:

```powershell
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Swagger: `http://127.0.0.1:8000/docs`
