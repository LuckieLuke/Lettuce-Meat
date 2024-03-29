from back.model import User, db, Ingredient, Recipe, Recipe_ingredient, Favorite_recipe, Menu, Menu_recipe
from flask import Flask, make_response, request
from flask_cors import CORS
import json
import time
import hashlib
import base64
from datetime import datetime
from itertools import product
import redis


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

red = redis.Redis(host='lettuce-meat_redis-db_1',
                 port=6379, decode_responses=True)

log = app.logger

with app.app_context():
    db.create_all()


@app.route('/')
def main():
    '''
    function responses with all recipes and if the user is logged in, 
    additional info about favorite recipes is included
    '''
    username = request.headers.get('x-user')

    if username != 'null':
        user = User.query.filter_by(username=username).first()
        favorites = [recipe.recipe_id for recipe in Favorite_recipe.query.filter_by(
            user_id=user.id).all()]

        recipes = [{
            'id': str(recipe.id),
            'name': str(recipe.name),
            'kcal': str(recipe.kcal),
            'img': str(recipe.image),
            'added': str(recipe.date_added),
            'favorite': True if recipe.id in favorites else False
        } for recipe in Recipe.query.all()]

        return {'msg': recipes}
    else:
        recipes = [{
            'id': str(recipe.id),
            'name': str(recipe.name),
            'kcal': str(recipe.kcal),
            'img': str(recipe.image),
            'added': str(recipe.date_added)
        } for recipe in Recipe.query.all()]

        return {'msg': recipes}


@app.route('/recipes/<type>')
def get_recipe_of_type(type):
    '''
    function that replies with all recipes from the DB but filtered by their type
    '''
    username = request.headers.get('x-user')
    user = User.query.filter_by(username=username).first()
    if user:
        favorites = [recipe.recipe_id for recipe in Favorite_recipe.query.filter_by(
            user_id=user.id).all()]

        recipes = [{
            'id': str(recipe.id),
            'name': str(recipe.name),
            'kcal': str(recipe.kcal),
            'img': str(recipe.image),
            'added': str(recipe.date_added),
            'favorite': True if recipe.id in favorites else False
        } for recipe in Recipe.query.filter_by(type=type).all()]
        return {'msg': recipes}
    else:
        recipes = [{
            'id': str(recipe.id),
            'name': str(recipe.name),
            'kcal': str(recipe.kcal),
            'img': str(recipe.image),
            'added': str(recipe.date_added)
        } for recipe in Recipe.query.filter_by(type=type).all()]
        return {'msg': recipes}


@app.route('/register', methods=['POST'])
def register():
    '''
    function that get registration info and 
    creates user in the DB
    '''
    form = request.form
    username = form.get('username')
    email = form.get('email')

    user = User.query.filter_by(email=email).first()
    if user:
        return make_response(json.dumps({'msg': 'email already exists'}), 403)

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


@app.route('/ingredient', methods=['POST', 'GET'])
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

        body = request.get_json()
        log.info(body.get('ingredients'))

        full_kcal = 0
        for_vegan = 0
        for_vegetarian = 0
        for ingredient, amount in json.loads(body.get('ingredients')).items():
            ing_from_db = Ingredient.query.filter_by(
                name=ingredient).first()
            part_kcal = float(ing_from_db.kcal) * \
                (int(amount) / 100)
            full_kcal += part_kcal
            if not ing_from_db.for_vegan:
                for_vegan += 1
            if not ing_from_db.for_vegetarian:
                for_vegetarian += 1

        recipe = Recipe(
            name=body['name'],
            kcal=full_kcal / int(body.get('portions')),
            content=body['content'],
            type=body['type'],
            image=body['image'],
            date_added=datetime.now(),
            for_vegan=for_vegan == 0,
            for_vegetarian=for_vegetarian == 0
        )
        db.session.add(recipe)
        db.session.commit()

        recipe = Recipe.query.filter_by(name=body['name']).first()

        for ingredient, amount in json.loads(body.get('ingredients')).items():
            ing_from_db = Ingredient.query.filter_by(
                name=ingredient).first()
            rec_ing = Recipe_ingredient(
                ingr_id=ing_from_db.id,
                recipe_id=recipe.id,
                amount=amount,
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


@app.route('/favorite', methods=['GET', 'POST'])
def favorite():
    if request.method == 'GET':
        body = request.json
        username = body['username']
        user = User.query.filter_by(username=username).first()
        if not user:
            return make_response(json.dumps({'msg': 'user not found'}), 404)

        id = user.id
        recipes = [{
            'id': recipe.recipe_id,
        } for recipe in Favorite_recipe.query.filter_by(user_id=id)]

        for recipe in recipes:
            id = recipe['id']
            name = Recipe.query.filter_by(id=id).first().name
            recipe['name'] = name

        return {'recipes': recipes}
    elif request.method == 'POST':
        info = request.headers.get('Authorization').split()[1].encode()
        message = base64.b64decode(info).decode().split(':')
        login, password = message[0], message[1]
        if not (login == 'adm1n' and password == 'SecurePass'):
            return make_response(json.dumps({'msg': 'Unauthorized'}, 403))

        body = request.json
        username = body['username']
        user = User.query.filter_by(username=username).first()
        if not user:
            return make_response(json.dumps({'msg': 'user not found'}), 404)

        id = user.id
        recipe_id = body['recipe_id']

        if not recipe_id:
            return make_response(json.dumps({'msg': 'no recipe id given'}), 400)

        check_fav = Favorite_recipe.query.filter_by(
            user_id=id, recipe_id=recipe_id).first()
        if check_fav:
            db.session.delete(check_fav)
            db.session.commit()
            return make_response(json.dumps({'msg': 'recipe deleted'}), 200)

        recipe = Recipe.query.filter_by(id=recipe_id).first()
        if not recipe:
            return make_response(json.dumps({'msg': 'no recipe with such id'}), 404)

        fav = Favorite_recipe(recipe_id=recipe_id, user_id=id)
        db.session.add(fav)
        db.session.commit()
        return make_response(json.dumps({'msg': 'fav recipe created'}), 200)


@app.route('/recipe/<id>', methods=['GET'])
def get_recipe(id):
    recipe = Recipe.query.filter_by(id=id).first()

    if not recipe:
        return make_response(json.dumps({'msg': 'recipe not found'}), 404)

    ingredients_db = Recipe_ingredient.query.filter_by(recipe_id=id).all()

    ingredients = [
        {
            'id': ing.ingr_id,
            'name': Ingredient.query.filter_by(id=ing.ingr_id).first().name,
            'amount': ing.amount,
            'unit': ing.unit,
            'kcal': ing.kcal
        } for ing in ingredients_db
    ]

    return make_response(json.dumps({'msg': {
        'id': id,
        'name': recipe.name,
        'kcal': recipe.kcal,
        'content': recipe.content,
        'type': recipe.type,
        'image': recipe.image,
        'date_added': str(recipe.date_added),
        'for_vegan': recipe.for_vegan,
        'for_vegetarian': recipe.for_vegetarian,
        'ingredients': ingredients
    }}), 200)


@app.route('/menus', methods=['GET'])
def get_menus():
    return json.dumps({'msg': 'here are all your menus'})


@app.route('/menu', methods=['POST', 'GET'])
def menu():
    if request.method == 'POST':
        body = request.json

        if not body.get('meals') or not body.get('kcal') or not body.get('username'):
            return make_response({'msg': 'Some data missing'}, 400)

        user = User.query.filter_by(username=body.get('username')).first()
        meals = body['meals']
        target_kcal = int(body['kcal'])

        combinations = []

        if user.is_vegan:
            combinations = list(product(*[Recipe.query.filter_by(
                type=type_of_meal, for_vegan=user.is_vegan).all() for type_of_meal in meals]))
        elif user.is_vegetarian:
            combinations = list(product(*[Recipe.query.filter_by(
                type=type_of_meal, for_vegetarian=user.is_vegetarian).all() for type_of_meal in meals]))
        else:
            combinations = list(product(*[Recipe.query.filter_by(
                type=type_of_meal).all() for type_of_meal in meals]))
        

        current_best = tuple()
        current_best_kcal = -10000000

        for combination in combinations:
            kcal = 0
            for recipe in combination:
                kcal += recipe.kcal
            if abs(current_best_kcal - target_kcal) > abs(kcal - target_kcal):
                current_best = combination
                current_best_kcal = kcal

        favorites = [recipe.recipe_id for recipe in Favorite_recipe.query.filter_by(
            user_id=user.id).all()]

        menu = Menu.query.filter_by(
            user_id=user.id, kcal=current_best_kcal).first()
        if menu:
            return make_response({'msg': {
                'recipes': [
                    {
                        'id': str(recipe.id),
                        'name': str(recipe.name),
                        'kcal': str(recipe.kcal),
                        'img': str(recipe.image),
                        'added': str(recipe.date_added),
                        'favorite': True if recipe.id in favorites else False
                    } for recipe in current_best
                ],
                'kcal': current_best_kcal
            }}, 200)

        menu = Menu(
            kcal=current_best_kcal,
            for_vegan=all(recipe.for_vegan for recipe in current_best),
            for_vegetarian=all(
                recipe.for_vegetarian for recipe in current_best),
            user_id=user.id
        )
        db.session.add(menu)
        db.session.commit()

        menu = Menu.query.filter_by(user_id=user.id).all()[-1]
        for recipe in current_best:
            menu_recipe = Menu_recipe(
                menu_id=menu.id,
                recipe_id=recipe.id
            )
            db.session.add(menu_recipe)
        db.session.commit()

        return make_response({'msg': {
            'recipes': [
                {
                    'id': str(recipe.id),
                    'name': str(recipe.name),
                    'kcal': str(recipe.kcal),
                    'img': str(recipe.image),
                    'added': str(recipe.date_added),
                } for recipe in current_best
            ],
            'kcal': current_best_kcal
        }}, 200)
    else:
        username = request.headers.get('x-user')

        if not username:
            return make_response({'msg': 'Username missing'}, 400)
        user = User.query.filter_by(username=username).first()
        favorites = [recipe.recipe_id for recipe in Favorite_recipe.query.filter_by(
            user_id=user.id).all()]

        menus = Menu.query.filter_by(user_id=user.id).all()
        resp_recipes = []
        for menu in menus:
            menu_recipe_ids = [menu_recipe.recipe_id for menu_recipe in Menu_recipe.query.filter_by(
                menu_id=menu.id).all()]
            menu_recipes = [
                {
                    'id': str(Recipe.query.filter_by(id=id).first().id),
                    'name': str(Recipe.query.filter_by(id=id).first().name),
                    'kcal': str(Recipe.query.filter_by(id=id).first().kcal),
                    'img': str(Recipe.query.filter_by(id=id).first().image),
                    'added': str(Recipe.query.filter_by(id=id).first().date_added),
                    'favorite': True if id in favorites else False
                } for id in menu_recipe_ids
            ]
            resp_recipes.append(menu_recipes)

        return json.dumps({'msg': resp_recipes})


if __name__ == '__main__':
    app.run(debug=True)
