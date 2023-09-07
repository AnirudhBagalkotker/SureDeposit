const nav = document.querySelector('#nav');

const createNav = () => {
    nav.innerHTML = `<div Class="Navbar">
            <li Class="List-Item home" onclick="location.href='/home'">
                <img src="img_suredeposit/home2.svg" alt="Home" class="icons">
                <span Class="List-Item-Name">Home</span>
            </li>
            <li Class="List-Item dash" onclick="location.href='/summary'">
                <img src="img_suredeposit/dash2.svg" alt="Summary" class="icons">
                <span Class="List-Item-Name">Summary</span>
            </li>
            <li Class="List-Item account" onclick="location.href='/profile'">
                <img src="img_suredeposit/user2.svg" alt="Account" class="icons">
                <span Class="List-Item-Name">Account</span>
            </li>
        </div>`
}

createNav();