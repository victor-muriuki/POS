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


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    buying_price = db.Column(db.Float, nullable=False)
    selling_price = db.Column(db.Float, nullable=False)
    barcode = db.Column(db.String(64), unique=True, nullable=True)

    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=True)

    def __repr__(self):
        return f"<Item {self.name}>"


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'))
    quantity_sold = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    item = db.relationship('Item', backref='transactions')

    def __repr__(self):
        return f"<Transaction {self.id}>"
