from dataclasses import dataclass

import requests
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from backend.models import AccountResponse, BankResponse, AccountsResponse, AccountData

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.db'
db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    accounts = relationship("Account", backref='users', cascade="all, delete, delete-orphan")

    def __repr__(self):
        return '<User %r>' % self.username


class Bank(db.Model):
    __tablename__ = 'banks'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    accounts = relationship("Account", backref='banks', cascade="all, delete, delete-orphan")
    application_uri = db.Column(db.String(255), nullable=False)


@dataclass
class Account(db.Model):
    __tablename__ = 'accounts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    account_id = db.Column(db.String(255), unique=True, nullable=False)
    bank_id = Column(Integer, ForeignKey('banks.id', ondelete='CASCADE'))
    name = db.Column(db.String(255), nullable=False)


@app.route("/get_accounts", methods=['POST'])
def get_accounts():
    js = request.json
    user_id = js['user_id']
    user = db.get_or_404(User, user_id)

    result = {}
    for account in user.accounts:
        bank = db.get_or_404(Bank, account.bank_id)
        account_data = AccountData(open_api_account={}, account_name=account.name)
        account_response = AccountResponse(balance={},
                                           account=account_data)

        if result.get(bank.id) is None:
            result[bank.id] = AccountsResponse(bank=BankResponse(id=bank.id, name=bank.name),
                                               accounts=[])

        try:
            r = requests.get(f'{bank.application_uri}open-banking/v1.3/aisp/accounts/{account.account_id}')
        except requests.exceptions.ConnectionError:
            continue

        if r.status_code == 200:
            account_response.account.open_api_account = r.json()

        try:
            r = requests.get(f'{bank.application_uri}open-banking/v1.3/aisp/accounts/{account.account_id}/balances')
        except requests.exceptions.ConnectionError:
            continue

        if r.status_code == 200:
            account_response.balance = r.json()

        result[bank.id].accounts.append(account_response)

    return result


if __name__ == '__main__':
    with app.app_context():
        app.run()
