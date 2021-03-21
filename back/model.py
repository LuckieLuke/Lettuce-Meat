from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    is_vegan = db.Column(db.Boolean, nullable=False)
    is_vegetarian = db.Column(db.Boolean, nullable=False)

    def __init__(self, username, email, password, is_vegan, is_vegetarian):
        self.username = username
        self.email = email
        self.password = password
        self.is_vegan = is_vegan
        self.is_vegetarian = is_vegetarian

    def __repr__(self):
        return f'username: {self.username}  email: {self.email}'
