from .extensions import db, bcrypt
from .models import User, Item, Transaction
from datetime import datetime

def seed_data():
    # Admin user
    admin = User(
        username="admin",
        password_hash=bcrypt.generate_password_hash("admin123").decode("utf-8"),
        is_admin=True
    )

    # Regular user
    user = User(
        username="cashier1",
        password_hash=bcrypt.generate_password_hash("pass123").decode("utf-8"),
        is_admin=False
    )

    # Items
    book1 = Item(
        name="Flask for Beginners",
        quantity=20,
        buying_price=10.00,
        selling_price=20.00,
        supplier="O'Reilly"
    )
    book2 = Item(
        name="Advanced React",
        quantity=15,
        buying_price=12.00,
        selling_price=25.00,
        supplier="Manning"
    )

    # Transactions
    tx = Transaction(
        item=book1,
        quantity_sold=2,
        total_price=40.00,
        date=datetime.utcnow()
    )

    db.session.add_all([admin, user, book1, book2, tx])
    db.session.commit()