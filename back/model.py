import re
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


class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=False, nullable=False)
    kcal = db.Column(db.Integer, nullable=False)
    default_unit = db.Column(db.String(10), nullable=False)
    for_vegan = db.Column(db.Boolean, nullable=False)
    for_vegetarian = db.Column(db.Boolean, nullable=False)

    def __init__(self, name, kcal, default_unit, for_vegan, for_vegetarian):
        self.name = name
        self.kcal = kcal
        self.default_unit = default_unit
        self.for_vegan = for_vegan
        self.for_vegetarian = for_vegetarian


class Recipe_ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ingr_id = db.Column(db.Integer, nullable=False)
    recipe_id = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    unit = db.Column(db.String(10), nullable=False)
    kcal = db.Column(db.Float, nullable=False)
    for_vegan = db.Column(db.Boolean, nullable=False)
    for_vegetarian = db.Column(db.Boolean, nullable=False)

    def __init__(self, ingr_id, recipe_id, amount, unit, kcal, for_vegan, for_vegetarian):
        self.ingr_id = ingr_id
        self.recipe_id = recipe_id
        self.amount = amount
        self.unit = unit
        self.kcal = kcal
        self.for_vegan = for_vegan
        self.for_vegetarian = for_vegetarian


class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=False, nullable=False)
    kcal = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(20), nullable=False)
    image = db.Column(db.String(300), nullable=True)
    date_added = db.Column(db.DateTime, nullable=False)
    # ingredients are under recipe's id in recipe_ingredient table

    def __init__(self, name, kcal, content, type, image, date_added):
        self.name = name
        self.kcal = kcal
        self.content = content
        self.type = type
        self.image = image
        self.date_added = date_added


class Favorite_recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey(
        'recipe.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=False)

    def __init__(self, recipe_id, user_id):
        self.recipe_id = recipe_id
        self.user_id = user_id


class Menu_recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    menu_id = db.Column(db.Integer, nullable=False, unique=False)
    recipe_id = db.Column(db.Integer, nullable=False)

    def __init__(self, menu_id, recipe_id):
        self.menu_id = menu_id
        self.recipe_id = recipe_id


class Menu(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    kcal = db.Column(db.Integer, nullable=False)
    # recipes są w tabeli menu_recipe i mają tutejsze id jako swoje menu_id
    for_vegan = db.Column(db.Boolean, nullable=False)
    for_vegetarian = db.Column(db.Boolean, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=False)

    def __int__(self, kcal, for_vegan, for_vegetarian, user_id):
        self.kcal = kcal
        self.for_vegan = for_vegan
        self.for_vegetarian = for_vegetarian
        self.user_id = user_id
