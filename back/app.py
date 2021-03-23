from model import User, db
from flask import Flask, make_response, request
import json
import time

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response


@app.route('/')
def main():
    time.sleep(1)
    return {'msg': 'KASZANKAAAAAAA'}


@app.route('/register', methods=['POST'])
def register():
    form = request.form

    username = form.get('username')
    email = form.get('email')
    password = form.get('password')
    is_vegan = True if form.get('is_vegan') == 'true' else False
    is_vegetarian = True if form.get('is_vegetarian') == 'true' else False

    is_added = False
    if username and email and password:
        user = User(
            username=username,
            email=email,
            password=password,
            is_vegan=is_vegan,
            is_vegetarian=is_vegetarian
        )

        db.session.add(user)
        db.session.commit()
        is_added = True

    if is_added:
        return make_response(json.dumps({'login': username}), 200)

    return make_response(json.dumps({'msg': 'Error with creating user'}), 400)


if __name__ == '__main__':
    app.run(debug=True)
