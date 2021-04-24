from model import User, db
from flask import Flask, make_response, request
import json
import time
import hashlib

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
    users = [str(user.username) + ' ' + str(user.email) + ' '
             for user in User.query.all()]
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


if __name__ == '__main__':
    app.run(debug=True)
