from flask import Flask
from flask_restful import Api
from .extensions import db, migrate, bcrypt, jwt
from flask_cors import CORS
from app.resources.item import ItemByBarcode

# Import resources
from .resources.user import UserRegister, UserLogin
from .resources.item import ItemResource, ItemList
from .resources.transaction import TransactionResource, TransactionList


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app)

    api = Api(app)

    # User endpoints
    api.add_resource(UserRegister, '/register')
    api.add_resource(UserLogin, '/login')

    # Inventory endpoints
    api.add_resource(ItemList, '/items')
    api.add_resource(ItemResource, '/items/<int:item_id>')
    api.add_resource(ItemByBarcode, '/items/barcode/<string:barcode>')
    # Item by barcode endpoint

    # Transaction endpoints
    api.add_resource(TransactionList, '/transactions')
    api.add_resource(TransactionResource, '/transactions/<int:tx_id>')

    return app