# # dashboard.py
# from flask_restful import Resource
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from app.models import User, Item, TransactionGroup, Transaction
# from app.extensions import db
# from datetime import datetime, timedelta

# class UserInfo(Resource):
#     @jwt_required()  # Requires a valid JWT token
#     def get(self):
#         user_id = get_jwt_identity()
#         user = User.query.get(user_id)
#         if not user:
#             return {"message": "User not found"}, 404
#         return {
#             "username": user.username,
#             "role": user.role
#         }


# class Stats(Resource):
#     @jwt_required()
#     def get(self):
#         # Total stock calculation
#         total_stock = db.session.query(db.func.sum(Item.quantity)).scalar() or 0

#         # Define start and end of the current UTC day
#         today = datetime.utcnow().date()
#         start = datetime.combine(today, datetime.min.time())
#         end = datetime.combine(today, datetime.max.time())

#         # Calculate today's sales
#         todays_sales = (
#             db.session.query(db.func.sum(Transaction.total_price))
#             .join(TransactionGroup, Transaction.group_id == TransactionGroup.id)
#             .filter(TransactionGroup.date >= start, TransactionGroup.date <= end)
#             .scalar()
#         ) or 0

#         # Debug print (optional, remove in production)
#         print(f"[Stats] Total Stock: {total_stock}, Today's Sales: {todays_sales}")

#         return {
#             "totalStock": total_stock,
#             "todaysSales": round(todays_sales, 2)  # rounded to 2 decimal places
#         }
# dashboard.py
from flask_restful import Resource
from app.models import User, Item, TransactionGroup, Transaction
from app.extensions import db
from datetime import datetime, timedelta

# -----------------------
# TEMPORARY: JWT BYPASS
# -----------------------

class UserInfo(Resource):
    # Remove @jwt_required temporarily
    def get(self):
        # For testing, just fetch the first user
        user = User.query.first()
        if not user:
            return {"message": "No users found in the database"}, 404
        return {
            "username": user.username,
            "role": user.role
        }

class Stats(Resource):
    # Remove @jwt_required temporarily
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

