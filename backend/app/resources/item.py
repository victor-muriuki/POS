from flask_restful import Resource, reqparse
from app.extensions import db
from app.models import Item

item_parser = reqparse.RequestParser()
item_parser.add_argument('name', type=str, required=True, help="Name cannot be blank")
item_parser.add_argument('quantity', type=int, required=True, help="Quantity is required")
item_parser.add_argument('buying_price', type=float, required=True, help="Buying price is required")
item_parser.add_argument('selling_price', type=float, required=True, help="Selling price is required")
item_parser.add_argument('supplier', type=str, required=False)

class ItemResource(Resource):
    def get(self, item_id):
        item = Item.query.get_or_404(item_id)
        return {
            "id": item.id,
            "name": item.name,
            "quantity": item.quantity,
            "buying_price": item.buying_price,
            "selling_price": item.selling_price,
            "supplier": item.supplier
        }
    
    def put(self, item_id):
        data = item_parser.parse_args()
        item = Item.query.get_or_404(item_id)

        item.name = data['name']
        item.quantity = data['quantity']
        item.buying_price = data['buying_price']
        item.selling_price = data['selling_price']
        item.supplier = data.get('supplier', item.supplier)

        db.session.commit()
        return {"message": "Item updated successfully."}, 200
    
    def delete(self, item_id):
        item = Item.query.get_or_404(item_id)
        db.session.delete(item)
        db.session.commit()
        return {"message": "Item deleted."}, 200


class ItemList(Resource):
    def get(self):
        items = Item.query.all()
        return [{"id": item.id, "name": item.name, "quantity": item.quantity,
                 "buying_price": item.buying_price, "selling_price": item.selling_price,
                 "supplier": item.supplier} for item in items]
    
    def post(self):
        data = item_parser.parse_args()
        item = Item(**data)
        db.session.add(item)
        db.session.commit()
        return {"message": "Item created successfully.", "id": item.id}, 201
