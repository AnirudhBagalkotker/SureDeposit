const ham = document.querySelector('.hamburger-menu');
const screen = document.querySelector('.screen');
const menu = document.querySelector('#menu__toggle');

menu.addEventListener("click", () => {
    setTimeout(() => {
        screen.classList.toggle("blur");
    }, 300);
});

screen.addEventListener('click', () => {
    menu.checked = false;
    screen.classList.remove("blur");
});

// detect changes in viewport height and adjust navbar position
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// set CSS custom property for virtual keyboard height
document.documentElement.style.setProperty('--keyboard-height', '0');

// listen for virtual keyboard events
window.addEventListener('resize', () => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) {
        const vh = window.innerHeight * 0.01;
        const keyboardHeight = window.innerHeight - (vh * 100);
        document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
    }
});
