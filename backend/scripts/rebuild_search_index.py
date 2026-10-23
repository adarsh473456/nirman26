from app.database.session import SessionLocal
from app.search.index_sync import rebuild_supplier_index

if __name__ == "__main__":
    db = SessionLocal()
    try:
        print(f"Indexed {rebuild_supplier_index(db)} suppliers")
    finally:
        db.close()
