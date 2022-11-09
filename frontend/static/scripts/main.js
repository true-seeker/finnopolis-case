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
            for (let i of Object.values(data)) {
                total_balance[i.bank.id] = {}
                for (let currency in currency_types) {
                    total_balance[i.bank.id][currency] = 0;
                }
            }


            for (let i of Object.values(data)) {
                for (let account of i.accounts) {
                    for (let balance of account.balance.Data.Balance) {
                        total_balance[i.bank.id][balance.Amount.currency] += balance.Amount.amount
                    }
                }
            }
            let total_balance_sum = {}
            for (let cur in currency_types) {
                total_balance_sum[cur] = 0
            }
            for (let bank in total_balance) {
                for (let cur in currency_types) {
                    total_balance_sum[cur] += total_balance[bank][cur]
                }
            }
            for (let currency in currency_types) {
                $(`#${currency}_balance`).text(total_balance_sum[currency].toFixed(2).toString() + ' ' + currency)
            }

            for (let i of Object.values(data)) {
                console.log(i)
                let total_bank_sum_string = ``
                for (let cur in currency_types) {
                    total_bank_sum_string += `${total_balance[i.bank.id][cur]} ${cur} `
                }
                html = `                    <div class="menu__item">
                        <div class="bank-account__info">
                            <div class="bank-account__logo"></div>
                            <span class="bank-account-bankName">${i.bank.name}</span>
                            <div class="bank-account-btn open-button" rel="nofollow"></div>
                        </div>
                        <div class="">
                            <span class="bank-allcounts-header">Всего счетов:</span>
                            <span class="bank-allcounts-text">${i.accounts.length}</span>
                        </div>
                        <div class="">
                            <span class="bank-money-header">Общая сумма:</span>
                            <span class="bank-money-text">${total_bank_sum_string}</span>
                        </div>
                        <div id="opencontent" class="open-content">`
                for (let account of i.accounts) {
                    let account_balance = 0
                    for (let balance of account.balance.Data.Balance) {
                        account_balance += balance.Amount.amount
                    }
                    html += `
                    <div class="menu__item">
                        <div class="account__info">
                            <div class="account__logo"></div>
                            <div class="account__info_inside">
                                <span class="account-name">${account.account.account_name}</span>
                                <span class="account-balance">${account_balance}</span>
                            </div>
                        </div>
                        <span class="account-bankName">Номер счёта</span>
                        <span class="account-numbers">${account.account.open_api_account.Data.Account[0].AccountDetails[0].identification}</span>
                    </div>`
                }
                html += `</div></div>`
                $('.menu__myAccounts').after(html)
            }

        },
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    });
}

get_accounts(1)
