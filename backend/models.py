from backend.main import app, Bank, User, Account, db


def generate_data():
    bank1 = Bank(name="Зеленый банк", application_uri="http://localhost:5466/")
    bank2 = Bank(name="Желтый банк", application_uri="http://localhost:5467/")
    db.session.add(bank1)
    db.session.add(bank2)
    db.session.commit()

    user1 = User(username='user1')
    user2 = User(username='user2')
    user3 = User(username='user3')
    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.commit()

    account1 = Account(user_id=user1.id, account_id='1002001', bank_id=bank1.id, name='Счёт №1')
    account2 = Account(user_id=user1.id, account_id='1002002', bank_id=bank1.id, name='Счёт №2')
    account3 = Account(user_id=user1.id, account_id='3589438', bank_id=bank1.id, name='Счёт №3')

    account4 = Account(user_id=user2.id, account_id='534434', bank_id=bank2.id, name='Счёт №4')
    account5 = Account(user_id=user2.id, account_id='76578', bank_id=bank2.id, name='Счёт №5')

    account6 = Account(user_id=user3.id, account_id='12321', bank_id=bank1.id, name='Счёт №6')
    account7 = Account(user_id=user3.id, account_id='86787', bank_id=bank1.id, name='Счёт №7')
    account8 = Account(user_id=user3.id, account_id='45645', bank_id=bank2.id, name='Счёт №8')
    account9 = Account(user_id=user3.id, account_id='123121', bank_id=bank2.id, name='Счёт №9')
    account10 = Account(user_id=user3.id, account_id='123233', bank_id=bank2.id, name='Счёт №10')

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
    with app.app_context():
        db.drop_all()
        db.create_all()
        generate_data()
