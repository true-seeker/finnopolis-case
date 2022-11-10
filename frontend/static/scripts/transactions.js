let pop = document.querySelector('.pop')


let select1 = () => {
    const e1 = document.querySelector('.default1')
    const choice1 = new Choices(e1, {
        searchEnabled: false,
        itemSelectText: '',
    })
    return choice1
}
const select = () => {
    const element = document.querySelector('.default')
    const choice = new Choices(element, {
        searchEnabled: false,
        itemSelectText: '',
    })
    return choice
}
let from_select;
let to_select;

function make_transaction(creditor_id, debtor_id, amount) {
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/payment",
        data: JSON.stringify({ debtor_id: debtor_id, creditor_id: creditor_id, amount: amount }),
        statusCode: {
            200: function (response) {
                pop.style.display = "block"
                pop.style.color = "#28a745"
                pop.textContent = 'Успешно! Перевод совершен'
            },
            400: function (response) {
                console.log(400)

                pop.style.display = "block"
                pop.style.color = "#dc3545"
                pop.textContent = 'Произошла непредвиденная ошибка'
            },
            403: function (response) {!
                console.log(403)

                pop.style.display = "block"
                pop.style.color = "#dc3545"
                pop.textContent = 'Недостаточно средств'
            }
        },
        success: (data) => {
            console.log(data)
        },
        dataType: "text",
        contentType: "application/json; charset=utf-8"
    });
}

function get_accounts(user_id) {
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/get_accounts",
        data: JSON.stringify({ user_id: user_id }),
        success: (data) => {
            for (let i of Object.values(data)) {
                console.log(i)
                for (let account of i.accounts) {
                    let acc = account.account.open_api_account.Data.Account[0].AccountDetails[0];
                    html = `<option value="${account.account.account_id}">
                        <span class="select__name">${account.account.account_name}</span>
                        <span class="select__balance">${acc.identification}</span>
                    </option>`
                    $('#from_select').append(html);
                    $('#to_select').append(html);
                }
            }
            from_select = select1();
            to_select = select();
            console.log(from_select.getValue())
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
}

$('#make-transaction').click(() => {
    let from_id = from_select.getValue().value
    let to_id = to_select.getValue().value

    let amount = $('#amount_input').val()
    console.log(amount)
    make_transaction(from_id, to_id, amount)
    if (from_id == to_id) {
        pop.style.display = "block"
        pop.style.color = "#dc3545"
        pop.textContent = 'Выбраны одинаковые счета'
    }
})

// make_transaction(1, 2, 100)
get_accounts(1)