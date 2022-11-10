currency_types = {
    'RUB': 'руб.',
    'USD': 'дол.',
    'EUR': 'евр.'
}

function get_accounts(user_id) {
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/get_accounts",
        data: JSON.stringify({user_id: user_id}),
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
                $(`#${currency}_balance`).text(total_balance_sum[currency].toFixed(2).toString())
                $(`#${currency}_balance`).append(`<span class="currency mx-1">${currency}</span>`)
            }

            for (let i of Object.values(data)) {
                console.log(i)
                let total_bank_sum_string = ``
                for (let cur in currency_types) {
                    total_bank_sum_string += `<span>${total_balance[i.bank.id][cur].toFixed(2)} <span class="currency" >${cur}</span></span>`
                }
                let bank_color = '';
                if (i.bank.id === 1)
                    bank_color = 'logo__green'
                if (i.bank.id === 2)
                    bank_color = 'logo__yellow'
                let account_logos = ['logo-card-img1', 'logo-card-img2']
                html = `<div class="menu__item">
                        <div class="bank-account__info">
                            <div class="bank-account__logo ${bank_color}"></div>
                            <span class="bank-account-bankName">${i.bank.name}</span>
                            <div class="bank-account-btn open-button" rel="nofollow"></div>
                        </div>
                        <div class="">
                            <span class="bank-allcounts-header">Всего счетов:</span>
                            <span class="bank-allcounts-text">${i.accounts.length}</span>
                        </div>
                        <div class="">
                            <div class="d-flex justify-content-between pt-1">${total_bank_sum_string}</div>
                        </div>
                        <div id="opencontent" class="open-content p-0">`
                for (let account of i.accounts) {
                    let random_logo = Math.floor(Math.random() * account_logos.length);

                    let account_balance = 0
                    for (let balance of account.balance.Data.Balance) {
                        account_balance += balance.Amount.amount
                    }
                    html += `
                    <div class="menu__item">
                        <div class="account__info">
                            <div class="account__info_inside">
                                <span class="account-name">${account.account.account_name}</span>
                                <span class="account-balance">${account_balance} <span class="currency">${account.balance.Data.Balance[0].Amount.currency}</span></span>
                            </div>
                        </div>
                        <div class="my-1">
                        <span class="account-bankName">Номер счёта</span>
                        <span class="account-numbers">${account.account.open_api_account.Data.Account[0].AccountDetails[0].identification}</span>
                        </div>
                    </div>`
                }
                html += `</div></div>`
                $('.menu__myAccounts').after(html)
                const openMenu = document.querySelector('.open-button');
                const openContent = document.querySelector('.open-content');

                openMenu.addEventListener('click', (e) => {
                    e.preventDefault();
                    openContent.classList.toggle('open-content--show')

                    if (openMenu.style.backgroundImage == 'url("/static/img/arrow_up.png")') {
                        openMenu.style.backgroundImage = 'url("/static/img/arrow_down.png")'
                    } else {
                        openMenu.style.backgroundImage = 'url("/static/img/arrow_up.png")'
                    }

                });
            }


        },
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    });
}

get_accounts(1)
