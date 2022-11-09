function get_accounts(user_id) {
    $.ajax({
        type: "POST",
        url: "https://localhost:5000",
        data: {user_id: 1},
        success: (data) => {
            console.log(data)
        }, // функция обратного вызова, которая вызывается если AJAX запрос выполнится успешно
        dataType: "application/json" // тип данных, который вы ожидаете получить от сервера
    });
}

