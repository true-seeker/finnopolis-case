currency_types = {
    'RUB': 'руб.',
    'USD': 'дол.',
    'EUR': 'евр.'
}

function get_accounts(user_id) {
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/get_accounts",
        data: JSON.stringify({user_id: 1}),
        success: (data) => {
            let total_balance = {}

            for (let currency in currency_types) {
                total_balance[currency] = 0;
            }

            for (let i of Object.values(data)) {
                for (let account of i.accounts) {
                    for (let balance of account.balance.Data.Balance) {
                        total_balance[balance.Amount.currency] += balance.Amount.amount
                    }
                }
            }
            for (let currency in total_balance) {
                $(`#${currency}_balance`).text(total_balance[currency].toString() + ' ' + currency_types[currency])
            }
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    });
}

get_accounts(1)
