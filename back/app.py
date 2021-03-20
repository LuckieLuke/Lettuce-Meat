from flask import Flask
import time

app = Flask(__name__)


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response


@app.route('/')
def main():
    time.sleep(2)
    return {'msg': 'hejka'}


if __name__ == '__main__':
    app.run()
