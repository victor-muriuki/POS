# app/seed.py
import uuid
from datetime import datetime
from app import create_app
from app.extensions import db, bcrypt
from app.models import User, Supplier, Item, TransactionGroup, Transaction

def seed_data():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()

        # --- Users ---
        admin = User(
            username="admin",
            password_hash=bcrypt.generate_password_hash("admin123").decode("utf-8"),
            role="admin"
        )
        user1 = User(
            username="teacher",
            password_hash=bcrypt.generate_password_hash("teacher123").decode("utf-8"),
            role="user"
        )
        user2 = User(
            username="student",
            password_hash=bcrypt.generate_password_hash("student123").decode("utf-8"),
            role="user"
        )
        db.session.add_all([admin, user1, user2])

        # --- Suppliers ---
        supplier1 = Supplier(name="Kenya Literature Bureau", contact="0722123456", email="sales@klb.co.ke")
        supplier2 = Supplier(name="Longhorn Publishers", contact="0733445566", email="info@longhorn.co.ke")
        db.session.add_all([supplier1, supplier2])

        # --- Items (Kenya Primary & Secondary Books) ---
        books = [
            # --- Primary (Grades 1–8) ---
            ("Primary Mathematics Grade 1", 40, 350, 500, "BK001", supplier1),
            ("Primary Mathematics Grade 2", 35, 370, 520, "BK002", supplier1),
            ("Primary Mathematics Grade 3", 30, 400, 550, "BK003", supplier1),
            ("Primary Mathematics Grade 4", 28, 450, 600, "BK004", supplier1),
            ("Primary Mathematics Grade 5", 25, 470, 650, "BK005", supplier1),
            ("Primary Mathematics Grade 6", 22, 480, 680, "BK006", supplier1),
            ("Primary Mathematics Grade 7", 20, 500, 700, "BK007", supplier1),
            ("Primary Mathematics Grade 8", 18, 520, 750, "BK008", supplier1),
            ("English Activities Grade 1", 50, 300, 450, "BK009", supplier2),
            ("English Activities Grade 2", 45, 320, 470, "BK010", supplier2),
            ("English Activities Grade 3", 40, 340, 490, "BK011", supplier2),
            ("English Activities Grade 4", 35, 360, 520, "BK012", supplier2),
            ("Kiswahili Mufti Grade 1", 42, 300, 450, "BK013", supplier1),
            ("Kiswahili Mufti Grade 2", 38, 320, 470, "BK014", supplier1),
            ("Kiswahili Mufti Grade 3", 36, 340, 490, "BK015", supplier1),
            ("Science & Technology Grade 4", 28, 420, 600, "BK016", supplier2),
            ("Science & Technology Grade 5", 25, 430, 620, "BK017", supplier2),
            ("Social Studies Grade 6", 30, 400, 580, "BK018", supplier1),
            ("CRE Activities Grade 7", 22, 380, 560, "BK019", supplier1),
            ("CRE Activities Grade 8", 20, 400, 580, "BK020", supplier1),

            # --- Secondary (Form 1–4) ---
            ("Secondary Mathematics Form 1", 40, 550, 800, "BK021", supplier2),
            ("Secondary Mathematics Form 2", 38, 570, 850, "BK022", supplier2),
            ("Secondary Mathematics Form 3", 35, 600, 900, "BK023", supplier2),
            ("Secondary Mathematics Form 4", 32, 650, 950, "BK024", supplier2),
            ("Secondary English Form 1", 45, 500, 780, "BK025", supplier1),
            ("Secondary English Form 2", 42, 520, 800, "BK026", supplier1),
            ("Secondary English Form 3", 38, 540, 820, "BK027", supplier1),
            ("Secondary English Form 4", 36, 560, 850, "BK028", supplier1),
            ("Secondary Kiswahili Form 1", 40, 480, 750, "BK029", supplier2),
            ("Secondary Kiswahili Form 2", 38, 500, 770, "BK030", supplier2),
            ("Secondary Kiswahili Form 3", 35, 520, 800, "BK031", supplier2),
            ("Secondary Kiswahili Form 4", 32, 550, 850, "BK032", supplier2),
            ("Secondary Physics Form 1", 30, 600, 900, "BK033", supplier1),
            ("Secondary Physics Form 2", 28, 650, 950, "BK034", supplier1),
            ("Secondary Chemistry Form 1", 30, 620, 920, "BK035", supplier2),
            ("Secondary Chemistry Form 2", 28, 670, 970, "BK036", supplier2),
            ("Secondary Biology Form 1", 32, 580, 880, "BK037", supplier1),
            ("Secondary Biology Form 2", 30, 600, 900, "BK038", supplier1),
            ("Secondary History Form 1", 35, 500, 780, "BK039", supplier2),
            ("Secondary Geography Form 1", 35, 520, 800, "BK040", supplier2),
        ]

        items = [Item(
            name=name,
            quantity=qty,
            buying_price=buy,
            selling_price=sell,
            barcode=barcode,
            supplier=supplier
        ) for name, qty, buy, sell, barcode, supplier in books]

        db.session.add_all(items)

        # --- Sample Transactions ---
        tx_group1 = TransactionGroup(transaction_id=str(uuid.uuid4()), date=datetime.utcnow())
        tx1 = Transaction(group=tx_group1, item=items[0], quantity_sold=2, total_price=2 * items[0].selling_price)
        tx2 = Transaction(group=tx_group1, item=items[10], quantity_sold=1, total_price=1 * items[10].selling_price)

        tx_group2 = TransactionGroup(transaction_id=str(uuid.uuid4()), date=datetime.utcnow())
        tx3 = Transaction(group=tx_group2, item=items[25], quantity_sold=3, total_price=3 * items[25].selling_price)

        db.session.add_all([tx_group1, tx1, tx2, tx_group2, tx3])

        # ✅ Commit everything
        db.session.commit()
        print("✅ Kenyan Bookshop database seeded with users, suppliers, 40 textbooks, and transactions!")

if __name__ == "__main__":
    seed_data()
