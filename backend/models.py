from dataclasses import dataclass


@dataclass
class BankResponse:
    id: str
    name: str


@dataclass
class AccountData:
    open_api_account: dict
    account_name: str
    account_id: int


@dataclass
class AccountResponse:
    balance: dict
    account: AccountData


@dataclass
class AccountsResponse:
    bank: BankResponse
    accounts: list[AccountResponse]


def generate_data():
    from main import Bank, User, Account, db, app
    bank1 = Bank(name="Зеленый банк", application_uri="http://localhost:8080/")
    bank2 = Bank(name="Желтый банк", application_uri="http://bank2:5467/")
    db.session.add(bank1)
    db.session.add(bank2)
    db.session.commit()

    user1 = User(username='user1')
    # user2 = User(username='user2')
    # user3 = User(username='user3')
    db.session.add(user1)
    # db.session.add(user2)
    # db.session.add(user3)
    db.session.commit()

    account1 = Account(user_id=user1.id, account_id='1', bank_id=bank1.id, name='Зарплатный счёт')
    account2 = Account(user_id=user1.id, account_id='2', bank_id=bank1.id, name='Дебетовый счёт')
    account3 = Account(user_id=user1.id, account_id='3', bank_id=bank1.id, name='Накопительный счёт')

    account4 = Account(user_id=user1.id, account_id='4', bank_id=bank2.id, name='Кредитный счёт4')
    account5 = Account(user_id=user1.id, account_id='5', bank_id=bank2.id, name='Дебетовый счёт')

    account6 = Account(user_id=user1.id, account_id='6', bank_id=bank1.id, name='Дебетовый счёт')
    account7 = Account(user_id=user1.id, account_id='7', bank_id=bank1.id, name='Дебетовый счёт с повышенным кэщбеком')
    account8 = Account(user_id=user1.id, account_id='8', bank_id=bank2.id, name='Накопительный счёт')
    account9 = Account(user_id=user1.id, account_id='9', bank_id=bank2.id, name='Инвестиционный счёт')
    account10 = Account(user_id=user1.id, account_id='10', bank_id=bank2.id, name='Дебетовый счёт')
    print(bank1.application_uri)
    print(bank2.application_uri)
    db.session.add(account1)
    db.session.add(account2)
    db.session.add(account3)
    db.session.add(account4)
    db.session.add(account5)
    db.session.add(account6)
    db.session.add(account7)
    db.session.add(account8)
    db.session.add(account9)
    db.session.add(account10)
    db.session.commit()


if __name__ == '__main__':
    from main import Bank, User, Account, db, app
    with app.app_context():
        db.drop_all()
        db.create_all()
        generate_data()
