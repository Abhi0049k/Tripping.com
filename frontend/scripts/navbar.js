const token = localStorage.getItem('token') || '';
const username = localStorage.getItem('username') || '';
const user = document.querySelector('.userInfo')
const logo = document.querySelector('nav .brandLogo');
const loginPart = document.querySelector('.login')
const logoutPart = document.querySelector('.logout')
const clearHam = document.querySelector('nav > .hamburgerPart > .clearingHam')
const hamIcon = document.querySelector('nav .hamburger');
const asideSection = document.querySelector('nav > .hamburgerPart');

if (username) user.innerHTML = username;

logo.addEventListener('click', (evnt) => {
    window.location.href = 'index.html'
})

user.addEventListener('mouseenter', () => {
    if (!token) loginPart.style.display = 'block';
    else logoutPart.style.display = 'block'
})

user.addEventListener('mouseleave', () => {
    if (!token) loginPart.style.display = 'none';
    else logoutPart.style.display = 'none'
})

logoutPart.addEventListener('mouseenter', () => {
    logoutPart.style.display = 'block';
})

logoutPart.addEventListener('mouseleave', () => {
    logoutPart.style.display = 'none'
})

loginPart.addEventListener('mouseenter', () => {
    loginPart.style.display = 'block';
})

loginPart.addEventListener('mouseleave', () => {
    loginPart.style.display = 'none'
})

hamIcon.addEventListener('click', () => {
    asideSection.style.display = 'block'
})

clearHam.addEventListener('click', () => {
    asideSection.style.display = 'none'
})

const logoutBtn = document.querySelector('nav .logout p')

logoutBtn.addEventListener('click', () => {
    loggingUserOut()
})


const loggingUserOut = async () => {
    try {
        let res = await fetch('http://localhost:8998/user/logout', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json'
            }
        })
        res = await res.json();
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = 'index.html'
    } catch (err) {
        console.log(err);
    }
}


user.addEventListener('click', (evnt) => {
    evnt.preventDefault();
    if (token === '' || username === '') return;
    window.location.href = 'userDashboard.html';
})
