# trasnaction.py
from flask_restful import Resource, reqparse
from app.extensions import db
from app.models import Transaction, Item
from datetime import datetime, timedelta

transaction_parser = reqparse.RequestParser()
transaction_parser.add_argument('item_id', type=int, required=True, help="Item ID is required")
transaction_parser.add_argument('quantity_sold', type=int, required=True, help="Quantity sold is required")

class TransactionResource(Resource):
    def get(self, tx_id):
        tx = Transaction.query.get_or_404(tx_id)
        return {
            "id": tx.id,
            "item_id": tx.item_id,
            "quantity_sold": tx.quantity_sold,
            "total_price": tx.total_price,
            "date": tx.date.isoformat()
        }
    
    def delete(self, tx_id):
        tx = Transaction.query.get_or_404(tx_id)
        db.session.delete(tx)
        db.session.commit()
        return {"message": "Transaction deleted."}, 200

class TransactionList(Resource):
    def get(self):
        # Grab date filter from query param
        filter_date_str = None
        if 'date' in reqparse.request.args:
            filter_date_str = reqparse.request.args.get('date')

        query = Transaction.query.join(Item)

        if filter_date_str:
            try:
                filter_date = datetime.strptime(filter_date_str, '%Y-%m-%d')
                next_day = filter_date + timedelta(days=1)
                query = query.filter(Transaction.date >= filter_date, Transaction.date < next_day)
            except ValueError:
                return {"message": "Invalid date format. Use YYYY-MM-DD."}, 400

        transactions = query.order_by(Transaction.date.desc()).all()
        
        return [{
            "id": tx.id,
            "item_id": tx.item_id,
            "item_name": tx.item.name,
            "quantity_sold": tx.quantity_sold,
            "total_price": tx.total_price,
            "date": tx.date.isoformat()
        } for tx in transactions]
    
    def post(self):
        data = transaction_parser.parse_args()
        item = Item.query.get_or_404(data['item_id'])

        if data['quantity_sold'] > item.quantity:
            return {"message": "Not enough stock to complete sale."}, 400
        
        total_price = item.selling_price * data['quantity_sold']

        tx = Transaction(item_id=item.id, quantity_sold=data['quantity_sold'], total_price=total_price, date=datetime.utcnow())
        item.quantity -= data['quantity_sold']

        db.session.add(tx)
        db.session.commit()

        return {"message": "Transaction recorded successfully.", "transaction_id": tx.id}, 201
