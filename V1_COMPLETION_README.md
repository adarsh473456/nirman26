# Nirman V1 completion patch

This patch adds the backend/API foundation for the remaining V1 items without changing the existing visual design.

## Added
- Bulk RFQ: `POST /v1/rfqs/bulk`
- Quote comparison: `GET /v1/rfqs/quote-comparison`
- Real buyer analytics: `GET /v1/buyer/analytics`
- Saved searches: `GET/POST/DELETE /v1/saved-searches`
- RFQ templates: `GET/POST /v1/rfq-templates`
- Order-backed supplier reviews: `POST /v1/reviews`, `GET /v1/suppliers/{id}/reviews`
- Supplier profile-view tracking: `POST /v1/suppliers/{id}/view`
- Supplier analytics + response-time badge: `GET /v1/supplier/analytics`
- AI capability extraction: `POST /v1/ai/extract-capabilities`
- Export-readiness checklist: `POST /v1/export-readiness`
- Advanced search filters: MOQ, lead time, employee count, capabilities
- Coordinate/radius search support
- Matching frontend API methods in `src/lib/api.ts`

## One database step for an existing database
New tables are created automatically by `Base.metadata.create_all()` when FastAPI starts. Existing `suppliers` tables need two new columns for radius search.

From PowerShell, while PostgreSQL is available, run the SQL in:
`backend/migrations/20260921_add_supplier_coordinates.sql`

Example with psql:
`& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d nirman -f backend\migrations\20260921_add_supplier_coordinates.sql`

## Start
Backend:
`cd backend`
`uvicorn app.main:app --reload --host 127.0.0.1 --port 8000`

Frontend (another terminal):
`npm run dev`

Then open the FastAPI docs at `http://127.0.0.1:8000/docs` to test the new endpoints through your authenticated frontend flow.

## Important notes
1. Radius search only applies to suppliers with latitude/longitude saved in their profile. It does not silently geocode addresses.
2. AI capability extraction uses `OPENAI_API_KEY` when configured; a small keyword fallback is returned otherwise.
3. Export readiness is a workflow/checklist feature, not an automated legal determination. SCOMET/export classification still requires authoritative verification.
4. Saved-search storage is complete. Automatic email/push delivery is intentionally not faked; a scheduler/email provider must be connected for real outbound alerts.
5. The frontend API functions are wired, but the existing visual pages were not redesigned. This preserves your current CSS/UI while giving the UI components real endpoints to call.
