function openMainPage() {
    location.href = "/main";
}

function openAccountPage() {
    location.href = "/transactions";
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