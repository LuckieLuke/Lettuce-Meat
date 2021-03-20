from flask import Flask

app = Flask(__name__)

firebase_config = {
    'apiKey': 'AIzaSyBEbg5wuvLNLWR2GG4uiWAE1AuyPlHl59c',
    'authDomain': 'lettucemeat-c36a4.firebaseapp.com',
    'projectId': 'lettucemeat-c36a4',
    'storageBucket': 'lettucemeat-c36a4.appspot.com',
    'messagingSenderId': '658041930488',
    'appId': '1:658041930488:web:ec8928a3865fb7064c710d',
    'measurementId': 'G-X9VBYG40BN'

}


@app.route('/')
def main():
    return 'hejka'


if __name__ == '__main__':
    app.run(debug=True)
