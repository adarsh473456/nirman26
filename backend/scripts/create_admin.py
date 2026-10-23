import sys
from app.database.session import SessionLocal
from app.models import User


def main(auth0_id: str, email: str, name: str = "Nirman Admin"):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.auth0_id == auth0_id).first()
        if not user:
            user = User(auth0_id=auth0_id, email=email, name=name, role="admin")
            db.add(user)
        else:
            user.role = "admin"
        db.commit()
        print(f"Admin ready: {email}")
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python -m scripts.create_admin <auth0_sub> <email> [name]")
        raise SystemExit(1)
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "Nirman Admin")