from model import User, db, Ingredient, Recipe, Recipe_ingredient
from flask import Flask, make_response, request
import json
import time
import hashlib
import base64
from datetime import datetime

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

log = app.logger

with app.app_context():
    db.create_all()


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', '*')
    response.headers.add('Access-Control-Allow-Methods', '*')
    return response


@app.route('/')
def main():
    time.sleep(1)
    users = [{
        'id': str(user.id),
        'username': str(user.name),
        'email': str(user.kcal) + ' kcal per 100' + str(user.default_unit)
    } for user in Ingredient.query.all()]
    return {'msg': users}


@app.route('/register', methods=['POST'])
def register():
    form = request.form
    username = form.get('username')
    email = form.get('email')
    password = form.get('password').encode('utf-8')
    hashed = hashlib.sha512(password).hexdigest()
    is_vegan = form.get('isVegan') is not None
    is_vegetarian = form.get('isVegetarian') is not None

    is_added = False
    if username and email and password:
        user = User(
            username=username,
            email=email,
            password=hashed,
            is_vegan=is_vegan,
            is_vegetarian=is_vegetarian
        )

        db.session.add(user)
        db.session.commit()
        is_added = True

    if is_added:
        return make_response(json.dumps({'login': username}), 200)

    return make_response(json.dumps({'msg': 'Error with creating user'}), 400)


@app.route('/login', methods=['POST'])
def login():
    form = request.form
    email = form.get('email')
    password = form.get('password').encode('utf-8')

    if email and password:
        user = User.query.filter_by(email=email).first()
        hashed = hashlib.sha512(password).hexdigest()

        if not user:
            return make_response(json.dumps({'msg': 'Wrong data'}), 401)
        if hashed == user.password:
            return make_response(json.dumps({'login': user.username}), 200)
        return make_response(json.dumps({'msg': 'Wrong password'}), 404)
    return make_response(json.dumps({'msg': 'Wrong data'}), 400)


@app.route('/ingredient', methods=['POST', 'GET'])  # TODO dodać jajka
def add_ingredient():
    if request.method == 'POST':
        info = request.headers.get('Authorization').split()[1].encode()
        message = base64.b64decode(info).decode().split(':')
        login, password = message[0], message[1]
        if not (login == 'adm1n' and password == 'SecurePass'):
            return make_response(json.dumps({'msg': 'Unauthorized'}, 403))

        body = request.json

        init_size = len(body.get('ingredients'))
        created = 0
        for ing in body.get('ingredients'):
            ingredient = Ingredient(
                name=ing['name'],
                kcal=ing['kcal'],
                default_unit=ing['default_unit'],
                for_vegan=ing['for_vegan'] == 1,
                for_vegetarian=ing['for_vegetarian'] == 1
            )
            db.session.add(ingredient)
            created += 1
        db.session.commit()

        return make_response(json.dumps({'msg': f'Created {created} of total {init_size} ingredients'}), 201)
    elif request.method == 'GET':
        ingredients = [{
            'id': ingredient.id,
            'name': str(ingredient.name),
            'kcal': ingredient.kcal,
            'default_unit': str(ingredient.default_unit),
            'for_vegan': ingredient.for_vegan,
            'for_vegetarian': ingredient.for_vegetarian
        } for ingredient in Ingredient.query.all()]

        return {'msg': ingredients}

    return make_response(json.dumps({'msg': 'Something wrong'}), 400)


@app.route('/recipe', methods=['GET', 'POST'])
def recipe():
    if request.method == 'POST':
        info = request.headers.get('Authorization').split()[1].encode()
        message = base64.b64decode(info).decode().split(':')
        login, password = message[0], message[1]
        if not (login == 'adm1n' and password == 'SecurePass'):
            return make_response(json.dumps({'msg': 'Unauthorized'}, 403))

        body = request.json

        check_recipe = Recipe.query.filter_by(name=body['name']).first()
        if check_recipe:
            return make_response(json.dumps({'msg': 'recipe already created'}), 400)

        ingredients = body['ingredients']
        full_kcal = 0
        for ingredient in ingredients:
            ing_from_db = Ingredient.query.filter_by(
                name=ingredient['name']).first()
            part_kcal = float(ing_from_db.kcal) * \
                (int(ingredient['amount']) / 100)
            full_kcal += part_kcal

        recipe = Recipe(
            name=body['name'],
            kcal=full_kcal,
            content=body['content'],
            type=body['type'],
            image=body['image'],
            date_added=datetime.now()
        )
        db.session.add(recipe)
        db.session.commit()

        recipe = Recipe.query.filter_by(name=body['name']).first()

        for ingredient in ingredients:
            ing_from_db = Ingredient.query.filter_by(
                name=ingredient['name']).first()
            rec_ing = Recipe_ingredient(
                ingr_id=ing_from_db.id,
                recipe_id=recipe.id,
                amount=ingredient['amount'],
                unit=ing_from_db.default_unit,
                kcal=part_kcal,
                for_vegan=ing_from_db.for_vegan,
                for_vegetarian=ing_from_db.for_vegetarian
            )
            db.session.add(rec_ing)
        db.session.commit()
        return make_response(json.dumps({'msg': 'recipe created'}), 200)

    elif request.method == 'GET':
        recipes = [{
            'id': recipe.id,
            'name': str(recipe.name),
            'kcal': recipe.kcal,
            'content': recipe.content,
            'type': recipe.type,
            'image': recipe.image,
            'date_added': str(recipe.date_added)
        } for recipe in Recipe.query.all()]

        return {'msg': recipes}


if __name__ == '__main__':
    app.run(debug=True)
