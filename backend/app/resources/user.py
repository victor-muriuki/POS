# user.py
from flask_restful import Resource, reqparse
from flask import jsonify
from app.extensions import db, bcrypt
from app.models import User
from flask_jwt_extended import create_access_token

# Parser for registration and login
user_parser = reqparse.RequestParser()
user_parser.add_argument('username', type=str, required=True, help="Username cannot be blank!")
user_parser.add_argument('password', type=str, required=True, help="Password cannot be blank!")
user_parser.add_argument('role', type=str, required=False)

class UserRegister(Resource):
    def post(self):
        data = user_parser.parse_args()
        if User.query.filter_by(username=data['username']).first():
            return {"message": "User already exists"}, 400
        
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        role = data.get('role', 'user')  # default to 'user' if not provided
        new_user = User(username=data['username'], password_hash=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()

        return {"message": "User created successfully."}, 201


class UserLogin(Resource):
    def post(self):
        data = user_parser.parse_args()
        user = User.query.filter_by(username=data['username']).first()
        if user and bcrypt.check_password_hash(user.password_hash, data['password']):
            access_token = create_access_token(identity=user.id)
            return {
                "access_token": access_token,
                "username": user.username,
                "role": user.role  # ✅ Add this line
            }, 200

        return {"message": "Invalid credentials"}, 401
