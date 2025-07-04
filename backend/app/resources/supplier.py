from flask_restful import Resource, reqparse
from app.models import Supplier
from app.extensions import db

supplier_parser = reqparse.RequestParser()
supplier_parser.add_argument('name', type=str, required=True)
supplier_parser.add_argument('contact', type=str)
supplier_parser.add_argument('email', type=str)

class SupplierList(Resource):
    def get(self):
        suppliers = Supplier.query.all()
        return [ {"id": s.id, "name": s.name, "contact": s.contact, "email": s.email} for s in suppliers ], 200

    def post(self):
        data = supplier_parser.parse_args()
        if Supplier.query.filter_by(name=data['name']).first():
            return {"message": "Supplier already exists"}, 400

        supplier = Supplier(**data)
        db.session.add(supplier)
        db.session.commit()
        return {"message": "Supplier created", "supplier": {"id": supplier.id, "name": supplier.name}}, 201
