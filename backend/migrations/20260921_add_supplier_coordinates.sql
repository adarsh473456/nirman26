-- Run once against an existing Nirman PostgreSQL database.
-- New installations get these columns automatically from SQLAlchemy create_all.
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
CREATE INDEX IF NOT EXISTS ix_suppliers_latitude ON suppliers(latitude);
CREATE INDEX IF NOT EXISTS ix_suppliers_longitude ON suppliers(longitude);
