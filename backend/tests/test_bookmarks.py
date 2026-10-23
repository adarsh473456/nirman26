from app.models import Bookmark

def test_bookmark_table_name():
    assert Bookmark.__tablename__ == "bookmarks"
