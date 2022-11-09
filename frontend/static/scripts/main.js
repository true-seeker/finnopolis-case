function get_accounts(user_id) {
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/get_accounts",
        data: JSON.stringify({user_id: 1}),
        success: (data) => {
            console.log(data)
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    });
}

get_accounts(1)
