from flask_restful import Resource, reqparse
from app.extensions import db
from app.models import Item, Supplier

# Parser for creating/updating items
item_parser = reqparse.RequestParser()
item_parser.add_argument('name', type=str, required=True, help="Name cannot be blank")
item_parser.add_argument('quantity', type=int, required=True, help="Quantity is required")
item_parser.add_argument('buying_price', type=float, required=True, help="Buying price is required")
item_parser.add_argument('selling_price', type=float, required=True, help="Selling price is required")
item_parser.add_argument('supplier_id', type=int, required=False)
item_parser.add_argument('barcode', type=str, required=False)

class ItemResource(Resource):
    def get(self, item_id):
        item = Item.query.get_or_404(item_id)
        return item.to_dict(), 200

    def put(self, item_id):
        data = item_parser.parse_args()
        item = Item.query.get_or_404(item_id)

        item.name = data['name']
        item.quantity = data['quantity']
        item.buying_price = data['buying_price']
        item.selling_price = data['selling_price']
        item.barcode = data.get('barcode', item.barcode)

        if data['supplier_id']:
            supplier = Supplier.query.get(data['supplier_id'])
            if not supplier:
                return {"message": "Supplier not found."}, 404
            item.supplier = supplier

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
        return [item.to_dict() for item in items], 200

    def post(self):
        data = item_parser.parse_args()

        supplier = None
        if data['supplier_id']:
            supplier = Supplier.query.get(data['supplier_id'])
            if not supplier:
                return {"message": "Supplier not found."}, 404

        new_item = Item(
            name=data['name'],
            quantity=data['quantity'],
            buying_price=data['buying_price'],
            selling_price=data['selling_price'],
            barcode=data.get('barcode'),
            supplier=supplier
        )

        db.session.add(new_item)
        db.session.commit()
        return {"message": "Item created successfully.", "id": new_item.id}, 201


class ItemByBarcode(Resource):
    def get(self, barcode):
        item = Item.query.filter_by(barcode=barcode).first()
        if not item:
            return {"message": "Item not found"}, 404
        return item.to_dict(), 200
