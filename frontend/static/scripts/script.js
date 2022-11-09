function openMainPage() {
    location.href = "http://127.0.0.1:5500/finnopolis-case/frontend/html/Main.html";
}

function openAccountPage() {
    location.href = "http://127.0.0.1:5500/finnopolis-case/frontend/html/adminAccount.html";
}

function openTransactionPage() {
    location.href = "http://127.0.0.1:5500/finnopolis-case/frontend/html/transactions.html";
}



const openMenu = document.querySelector('.open-button');
const openContent = document.querySelector('.open-content');

openMenu.addEventListener('click', (e) => {
    e.preventDefault();
    openContent.classList.toggle('open-content--show')
    
    if(openMenu.style.backgroundImage == 'url("/finnopolis-case/frontend/static/img/arrow_up.png")') {
        openMenu.style.backgroundImage = 'url("/finnopolis-case/frontend/static/img/arrow_down.png")'
    }
    else {
        openMenu.style.backgroundImage = 'url("/finnopolis-case/frontend/static/img/arrow_up.png")'
    }
   
});