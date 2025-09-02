from flask_restful import Resource
from flask import request
from app.extensions import db
from app.models import Transaction, Item, TransactionGroup
from datetime import datetime, timedelta
import uuid


class TransactionResource(Resource):
    def get(self, tx_id):
        tx = Transaction.query.get_or_404(tx_id)
        return {
            "id": tx.id,
            "transaction_group_id": tx.group_id,
            "item_id": tx.item_id,
            "quantity_sold": tx.quantity_sold,
            "total_price": tx.total_price,
            "date": tx.group.date.isoformat() if tx.group else None,
            "payment_method": tx.group.payment_method if tx.group else None,
            "customer_name": tx.group.customer_name if tx.group else None
        }

    def delete(self, tx_id):
        tx = Transaction.query.get_or_404(tx_id)
        db.session.delete(tx)
        db.session.commit()
        return {"message": "Transaction deleted."}, 200


class TransactionList(Resource):
    def get(self):
        """Fetch transactions grouped by transaction_group_id, optionally filtered by date."""
        filter_date_str = request.args.get("date")
        query = Transaction.query.join(Item).join(TransactionGroup)

        if filter_date_str:
            try:
                filter_date = datetime.strptime(filter_date_str, "%Y-%m-%d")
                next_day = filter_date + timedelta(days=1)
                query = query.filter(TransactionGroup.date >= filter_date,
                                     TransactionGroup.date < next_day)
            except ValueError:
                return {"message": "Invalid date format. Use YYYY-MM-DD."}, 400

        transactions = query.order_by(TransactionGroup.date.desc()).all()

        grouped = {}
        for tx in transactions:
            gid = tx.group_id
            if gid not in grouped:
                grouped[gid] = {
                    "transaction_id": tx.group.transaction_id if tx.group else None,
                    "date": tx.group.date.isoformat() if tx.group else None,
                    "payment_method": tx.group.payment_method if tx.group else None,
                    "customer_name": tx.group.customer_name if tx.group else None,
                    "transactions": []
                }
            grouped[gid]["transactions"].append({
                "id": tx.id,
                "item_id": tx.item_id,
                "item_name": tx.item.name if tx.item else None,
                "quantity_sold": tx.quantity_sold,
                "total_price": tx.total_price
            })

        return list(grouped.values())

    def post(self):
        """Create a grouped purchase transaction (multiple items under one purchase)."""
        data = request.get_json()

        if not data:
            return {"message": "No data provided."}, 400

        payment_method = data.get("payment_method", "cash")
        customer_name = data.get("customer_name", "N/A")
        items_payload = data.get("items", [])

        if not isinstance(items_payload, list) or not items_payload:
            return {"message": "Items list is required."}, 400

        transaction_id = str(uuid.uuid4())
        tx_group = TransactionGroup(
            transaction_id=transaction_id,
            date=datetime.utcnow(),
            payment_method=payment_method,
            customer_name=customer_name
        )
        db.session.add(tx_group)
        transactions = []

        try:
            for item_data in items_payload:
                item_id = item_data.get("item_id")
                qty = item_data.get("quantity_sold")

                if not item_id or not qty:
                    return {"message": "Each item must include item_id and quantity_sold"}, 400

                item = Item.query.get(item_id)
                if not item:
                    return {"message": f"Item with id {item_id} not found."}, 404

                if qty > item.quantity:
                    return {"message": f"Not enough stock for {item.name}."}, 400

                # Deduct stock
                item.quantity -= qty

                total_price = item.selling_price * qty

                tx = Transaction(
                    group_id=tx_group.id,
                    item_id=item.id,
                    quantity_sold=qty,
                    total_price=total_price
                )
                db.session.add(tx)

                transactions.append({
                    "item_name": item.name,
                    "quantity_sold": qty,
                    "total_price": total_price
                })

            db.session.commit()

        except Exception as e:
            db.session.rollback()
            return {"message": f"Transaction failed: {str(e)}"}, 500

        return {
            "message": "Purchase recorded successfully.",
            "transaction_id": transaction_id,
            "payment_method": payment_method,
            "customer_name": customer_name,
            "transactions": transactions
        }, 201
