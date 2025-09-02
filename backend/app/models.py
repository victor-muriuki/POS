from .extensions import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'

    def __repr__(self):
        return f"<User {self.username} - Role: {self.role}>"


class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    contact = db.Column(db.String(120), nullable=True)
    email = db.Column(db.String(120), nullable=True)

    items = db.relationship('Item', backref='supplier', lazy=True)

    def __repr__(self):
        return f"<Supplier {self.name}>"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact': self.contact,
            'email': self.email
        }


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    buying_price = db.Column(db.Float, nullable=False)
    selling_price = db.Column(db.Float, nullable=False)
    barcode = db.Column(db.String(64), unique=True, nullable=True)

    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=True)

    transactions = db.relationship('Transaction', backref='item', lazy=True)

    def __repr__(self):
        return f"<Item {self.name}>"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'quantity': self.quantity,
            'buying_price': self.buying_price,
            'selling_price': self.selling_price,
            'barcode': self.barcode,
            'supplier': self.supplier.to_dict() if self.supplier else None
        }


# 🔹 TransactionGroup represents a single receipt / purchase
class TransactionGroup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.String(36), unique=True, nullable=False)  # UUID
    date = db.Column(db.DateTime, default=datetime.utcnow)

    # ✅ New fields for payment info
    payment_method = db.Column(db.String(20), default='cash')
    customer_name = db.Column(db.String(120), nullable=True)

    transactions = db.relationship('Transaction', backref='group', lazy=True)

    def __repr__(self):
        return f"<TransactionGroup {self.transaction_id}>"

    def to_dict(self):
        return {
            'transaction_id': self.transaction_id,
            'date': self.date.strftime("%Y-%m-%d %H:%M:%S"),
            'payment_method': self.payment_method,
            'customer_name': self.customer_name,
            'items': [t.to_dict() for t in self.transactions]
        }


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('transaction_group.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False)
    quantity_sold = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f"<Transaction {self.id} in Group {self.group_id}>"

    def to_dict(self):
        return {
            'id': self.id,
            'item': self.item.to_dict(),
            'quantity_sold': self.quantity_sold,
            'total_price': self.total_price
        }
