# dashboard.py
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Item, TransactionGroup, Transaction
from app.extensions import db
from datetime import datetime, timedelta

class UserInfo(Resource):
    @jwt_required()  # Requires a valid JWT token
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404
        return {
            "username": user.username,
            "role": user.role
        }

class Stats(Resource):
    @jwt_required()
    def get(self):
        total_stock = db.session.query(db.func.sum(Item.quantity)).scalar() or 0

        today = datetime.utcnow().date()
        tomorrow = today + timedelta(days=1)

        todays_sales = (
            db.session.query(db.func.sum(Transaction.total_price))
            .join(TransactionGroup)
            .filter(TransactionGroup.date >= today, TransactionGroup.date < tomorrow)
            .scalar()
        ) or 0

        return {
            "totalStock": total_stock,
            "todaysSales": todays_sales
        }
