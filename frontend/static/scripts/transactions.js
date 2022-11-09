function make_transaction(debtor_id, creditor_id, amount) {
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/payment",
        data: JSON.stringify({debtor_id: debtor_id, creditor_id: creditor_id, amount: amount}),
        success: (data) => {
            console.log(data)
        },
        dataType: "text",
        contentType: "application/json; charset=utf-8"
    });
}

make_transaction(1, 2, 100)
