import json
import os
from dataclasses import dataclass

import requests
from flask import Flask, request, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from models import AccountResponse, BankResponse, AccountsResponse, AccountData

template_dir = os.path.join('/', 'frontend')
template_dir = os.path.join(template_dir, 'html')

static_dir = os.path.join('/', 'frontend')
static_dir = os.path.join(static_dir, 'static')
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.db'
db = SQLAlchemy(app)
CORS(app)


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
    """
    Получение списка счетов по идентификатору пользователя
    """
    js = request.json
    user_id = js['user_id']
    user = db.get_or_404(User, user_id)

    result = {}
    for account in user.accounts:
        bank = db.get_or_404(Bank, account.bank_id)

        # костыль ;)
        bank.application_uri = bank.application_uri.replace('localhost:8080', 'bank1:8080')
        bank.application_uri = bank.application_uri.replace('localhost:5467', 'bank2:5467')

        account_data = AccountData(open_api_account={},
                                   account_name=account.name,
                                   account_id=account.id)
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


@app.route("/payment", methods=['POST', ])
def payment():
    """
    Платеж с счета debtor_id на счёт creditor_id c суммой amount
    """
    body = request.json
    debtor_id = body['debtor_id']
    creditor_id = body['creditor_id']
    amount = body['amount']
    debtor = db.get_or_404(Account, debtor_id)
    creditor = db.get_or_404(Account, creditor_id)

    bank = db.get_or_404(Bank, debtor.bank_id)

    # костыль ;)
    bank.application_uri = bank.application_uri.replace('localhost:8080', 'bank1:8080')
    bank.application_uri = bank.application_uri.replace('localhost:5467', 'bank2:5467')
    try:
        r = requests.post(f'{bank.application_uri}open-banking/v1.3/aisp/vrp-payments',
                          data=json.dumps({'debtor_id': debtor.account_id,
                                           'creditor_id': creditor.account_id,
                                           'amount': amount}),
                          headers={'Content-Type': 'application/json'})

    except requests.exceptions.ConnectionError:
        return 'Bad request', 400
    print(r.status_code)
    if r.status_code == 200:
        return 'Ok', 200
    elif r.status_code == 403:
        return 'Money not sufficient', 403
    elif r.status_code == 400:
        return 'Debtor or creditor not found', 400


@app.route("/", methods=['GET'])
def index():
    return render_template('authorization.html')


@app.route("/main", methods=['GET', ])
def main():
    return render_template('main.html')


@app.route("/transactions", methods=['GET', ])
def transactions():
    return render_template('transactions.html')


@app.route("/analytics", methods=['GET', ])
def analytics():
    return render_template('analytics.html')


if __name__ == '__main__':
    with app.app_context():
        app.run(host='0.0.0.0', port=5000)
