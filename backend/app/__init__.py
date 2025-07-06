# __init__.py
from flask import Flask
from flask_restful import Api
from .extensions import db, migrate, bcrypt, jwt, mail  # ✅ Add mail
from flask_cors import CORS

# Import resources
from .resources.user import UserRegister, UserLogin
from .resources.item import ItemResource, ItemList, ItemByBarcode
from .resources.transaction import TransactionResource, TransactionList
from .resources.supplier import SupplierList

# ✅ Import blueprint for sending quotations
from .routes.quotation import quotation_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)  # ✅ Initialize mail
    CORS(app)

    # Register Flask-Restful API
    api = Api(app)

    # User endpoints
    api.add_resource(UserRegister, '/register')
    api.add_resource(UserLogin, '/login')

    # Inventory endpoints
    api.add_resource(ItemList, '/items')
    api.add_resource(ItemResource, '/items/<int:item_id>')
    api.add_resource(ItemByBarcode, '/items/barcode/<string:barcode>')

    # Transaction endpoints
    api.add_resource(TransactionList, '/transactions')
    api.add_resource(TransactionResource, '/transactions/<int:tx_id>')

    # Supplier endpoints
    api.add_resource(SupplierList, '/suppliers')

    # ✅ Register blueprint for email feature
    app.register_blueprint(quotation_bp)

    return app
