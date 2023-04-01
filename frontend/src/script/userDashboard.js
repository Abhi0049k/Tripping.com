const userInfo = document.querySelector('nav > .right .userInfo');
const loginPart = document.querySelector('nav > .login')
const logoutPart = document.querySelector('nav > .logout');
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId')
const username = localStorage.getItem('username');
const usernamePos = document.querySelector('nav > .right .userInfo > a')
const hamIcon = document.querySelector('nav .hamburger span');
const asideSection = document.querySelector('nav > .hamburgerPart');
const clearHam = document.querySelector('nav > .hamburgerPart > .clearingHam > svg')
const AccountAside = document.querySelector('#operations aside ul li:nth-child(1)');
const BookingAside = document.querySelector('#operations aside ul li:nth-child(2)');
const SignoutAside = document.querySelector('#operations aside ul li:nth-child(3)');
const appPlaces = document.querySelector('#operations #appPlaces');
const bookingSection = document.querySelector('#operations #totalBooking');
const appPlacesContainer = document.querySelector('#operations #appPlaces .container');
const bookingSectionContainer = document.querySelector('#operations #totalBooking .container')
const deleteMsg = document.querySelector('#deletion');
const logo = document.querySelector('nav > .brandLogo');


logo.addEventListener('click', ()=>{
    window.location.href = "index.html";
})

AccountAside.addEventListener('click', () => {
    removingActive();
    AccountAside.setAttribute('class', 'active');
    appPlaces.style.display = 'block';
})

BookingAside.addEventListener('click', () => {
    removingActive();
    BookingAside.setAttribute('class', 'active');
    bookingSection.style.display = 'block'
    fetchBooking();
})
SignoutAside.addEventListener('click', () => {
    removingActive();
    SignoutAside.setAttribute('class', 'active');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'signin.html'
})

async function fetchDetails(){
    let data = await fetch(`http://localhost:8998/user/${userId}`);
    data = await data.json();
    displayDetails(data);
}

fetchDetails();

function displayDetails(data){
    let str = `
    <div class='name'>
    <h2>Name</h2>
    <p>${data.name}</p>
    </div>
    <div class='email'>
    <h2>Email</h2>
    <p>${data.email}</p>
    </div>
    `;
    appPlacesContainer.innerHTML = str;
}

function removingActive() {
    AccountAside.setAttribute('class', '');
    BookingAside.setAttribute('class', '');
    SignoutAside.setAttribute('class', '');
    appPlaces.style.display = 'none';
    bookingSection.style.display = 'none';
}

async function fetchBooking(){
    let data = await fetch(`http://localhost:8998/booking/${userId}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  data = await data.json();
  displayingBooking(data);
}

function displayingBooking(data){
    let arr = data.map(eachBooking);
    if(arr.length==0)
    bookingSectionContainer.innerHTML = `<h1>You haven't booked any trip using Tripping.com yet.</h1>`
    else
    bookingSectionContainer.innerHTML = arr.join('\n');
    let cancelBookingBtns = document.querySelectorAll('#totalBooking .cancelBooking');
    cancelBookingBtns.forEach((el)=>{
        el.addEventListener('click', ()=>{
            cancellation(el.dataset.id);
        })
    })
}

async function cancellation(id){
    let res = await fetch(`http://localhost:8998/booking/${id}`,{
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let state = res.ok;
    res = await res.json();
    if(state){
        popup(res.msg);
    }else{
        popup(res.err);
    }
}


function eachBooking(el){
    let str = `
    <div class='eachbooking'> 
    <p>RefId #${el._id}</p>
    <p>Name: ${el.name}</p>
    <p>Age: ${el.age}</p>
    <p>Email: ${el.email}</p>
    <p>Check In: ${el.checkin}</p>
    <p>Check Out: ${el.checkout}</h4>
    <p>Adhaar No.: ${el.adhaarNo}</p>
    <p>Place RefId: ${el.placeId}</p>
    <p>User RefId: ${el.userId}</p>
    <button class='cancelBooking' data-id=${el._id}>Cancel Booking</button>
    </div>
    `
    return str;
  }

window.addEventListener('load', () => {
    displayName();
})

logoutPart.addEventListener('click', (evnt) => {
    evnt.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    window.location.href = 'index.html'
})

userInfo.addEventListener('mouseenter', () => {
    if (token) {
        logoutPart.style.display = 'block'
    } else {
        loginPart.style.display = 'block'
    }
})

userInfo.addEventListener('mouseleave', () => {
    loginPart.style.display = 'none';
    logoutPart.style.display = 'none';
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


const displayName = () => {
    const defaultString = `
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="user">
        <circle fill="none" stroke="white" stroke-width="1.1" cx="9.9" cy="6.4" r="4.4"></circle>
        <path fill="none" stroke="white" stroke-width="1.1"
        d="M1.5,19 C2.3,14.5 5.8,11.2 10,11.2 C14.2,11.2 17.7,14.6 18.5,19.2"></path>
    </svg>
    `
    if (token){
        usernamePos.innerHTML = `<p>${username}</p>`;
        usernamePos.addEventListener('click', ()=>{
            window.location.href = 'userDashboard.html'
        })
    }else {
        usernamePos.innerHTML = defaultString;
    }
}

hamIcon.addEventListener('click', () => {
    asideSection.style.display = 'block'
})

clearHam.addEventListener('click', () => {
    asideSection.style.display = 'none'
})

async function popup(str){
    deleteMsg.innerHTML = str;
    deleteMsg.style.display = 'flex';
    setTimeout(()=>{
      deleteMsg.style.display='none';
    }, 1500);
}