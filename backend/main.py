from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from controllers import app


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


if __name__ == '__main__':
    with app.app_context():
        app.run()
