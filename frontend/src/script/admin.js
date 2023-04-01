const userInfo = document.querySelector('nav > .right .userInfo');
const loginPart = document.querySelector('nav > .login')
const logoutPart = document.querySelector('nav > .logout');
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');
const usernamePos = document.querySelector('nav > .right .userInfo > a')
const hamIcon = document.querySelector('nav .hamburger span');
const asideSection = document.querySelector('nav > .hamburgerPart');
const clearHam = document.querySelector('nav > .hamburgerPart > .clearingHam > svg')
const idEl = document.getElementById("idEl");
const updationName = document.getElementById("updationName");
const updationImages = document.getElementById("updationImages");
const updationLocation = document.getElementById("updationLocation");
const updationFacilities = document.getElementById("updationFacilities");
const updationDay = document.getElementById("updationDay");
const updationBooking = document.getElementById("updationBooking");
const updationPeopleCount = document.getElementById('updationMaximumCount')
const updationPricing = document.getElementById("updationpricing");
const updationDiscount = document.getElementById("updationDiscount");
const updationFormDiv = document.getElementById('updationForm');
const updationForm = document.querySelector('#updationForm form');
const listContainer = document.querySelector('#operations > #appPlaces > .container');
const deleteMsg = document.querySelector('#deletion');
const ListAside = document.querySelector('#operations aside ul li:nth-child(1)');
const AddAside = document.querySelector('#operations aside ul li:nth-child(2)');
const BookingAside = document.querySelector('#operations aside ul li:nth-child(3)');
const StatsAside = document.querySelector('#operations aside ul li:nth-child(4)');
const SignoutAside = document.querySelector('#operations aside ul li:nth-child(5)');
const appPlaces = document.querySelector('#operations #appPlaces');
const addingPlace = document.querySelector('#operations #addingPlace');
const creatingName = document.getElementById('creationName');
const creatingImages = document.getElementById('creationImages');
const creatingLocation = document.getElementById('creationLocation');
const creatingFacilities = document.getElementById('creationFacilities');
const creatingBooking = document.getElementById('creationBooking');
const creatingPeopleCount = document.getElementById('creationMaximumCount');
const creatingDay = document.getElementById('creationDay');
const creatingPricing = document.getElementById('creationpricing');
const creatingDiscount = document.getElementById('creationDiscount');
const creationForm = document.getElementById('creatingPlace');
const bookingSection = document.querySelector('#operations #totalBooking')
const bookingSectionContainer = document.querySelector('#operations #totalBooking .container')
const statisticsSection = document.querySelector('#operations #statistics');
const statisticsSectionHeading = document.querySelector('#operations #statistics h1')
const logo = document.querySelector('nav > .brandLogo');

logo.addEventListener('click', ()=>{
    window.location.href = "index.html";
})
let totalRevenue = 0;
let ageGroup = [];

ListAside.addEventListener('click', ()=>{
  removingActive();
  ListAside.setAttribute('class', 'active');
  appPlaces.style.display = 'block';
})

AddAside.addEventListener('click', ()=>{
  removingActive();
  AddAside.setAttribute('class', 'active');
  addingPlace.style.display = 'flex';
})
BookingAside.addEventListener('click', ()=>{
  removingActive();
  BookingAside.setAttribute('class', 'active');
  bookingSection.style.display = 'block'
  fetchBooking();
})
StatsAside.addEventListener('click', ()=>{
  removingActive();
  StatsAside.setAttribute('class', 'active');
  statisticsSectionHeading.innerText = `Total revenue generated is Rs.${totalRevenue}`
  statisticsSection.style.display = 'block'
})
SignoutAside.addEventListener('click', ()=>{
  removingActive();
  SignoutAside.setAttribute('class', 'active');
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = 'adminLogin.html'
})

function removingActive(){
  ListAside.setAttribute('class', '');
  AddAside.setAttribute('class', '');
  BookingAside.setAttribute('class', '');
  StatsAside.setAttribute('class', '');
  SignoutAside.setAttribute('class', '');
  appPlaces.style.display = 'none';
  addingPlace.style.display = 'none';
  bookingSection.style.display = 'none';
  statisticsSection.style.display = 'none';
}

window.addEventListener('load', ()=>{
    displayName();
})

creationForm.addEventListener('submit', (evnt)=>{
  evnt.preventDefault();
  let obj = {};
  obj.name = creatingName.value;
  obj.images = creatingImages.value.split(', ');
  obj.location = creatingLocation.value;
  obj.facilities = creatingFacilities.value.split(', ');
  obj.isBooked = creatingBooking.value=='true'? true : false;
  obj.day = Number(creatingDay.value);
  obj.noofpeople = Number(creatingPeopleCount.value);
  obj.pricing = Number(creatingPricing.value);
  obj.discount = Number(creatingDiscount.value);
  let actPrice = obj.pricing - Math.floor((obj.pricing * obj.discount)/100);
  obj.actualprice = actPrice;
  addingDb(obj);
})

function removingvalues(){
  creatingName.value = '';
  creatingBooking.value = '';
  creatingDay.value = '';
  creatingDiscount.value = '';
  creatingFacilities.value = '';
  creatingImages.value = '';
  creatingLocation.value = '';
  creatingPeopleCount.value = '';
  creatingPricing.value = '';
}

async function addingDb(obj){
  let res = await fetch('http://localhost:8998/places/add',{
    body: JSON.stringify(obj),
    headers:{
      'Content-Type': 'application/json',
      Authorization: token
    },
    method: 'POST'
  });
  if(res.ok){
    res = await res.json();
    popup(`<p> ${res.msg}</p>`);
    removingvalues();
    fetchRender();
  }else{
    res = await res.json();
    popup(`<p>${res.msg || res.err}</p>`)
  }
}

updationForm.addEventListener('submit', (evnt)=>{
  evnt.preventDefault();
  let obj = {};
  const id = idEl.value;
  obj.name = updationName.value;
  obj.images = updationImages.value.split(', ');
  obj.location = updationLocation.value;
  obj.facilities = updationFacilities.value.split(', ');
  obj.day = Number(updationDay.value);
  obj.isBooked = updationBooking.value=='true'? true : false;
  obj.pricing = Number(updationPricing.value);
  obj.noofpeople = Number(updationPeopleCount.value);
  obj.discount = Number(updationDiscount.value);
  let actPrice = obj.pricing - Math.floor((obj.pricing * obj.discount)/100);
  obj.actualprice= actPrice;
  updatingInfo(obj, id);
})

async function updatingInfo(obj, id){
  updationFormDiv.style.display = 'none'
  let res = await fetch(`http://localhost:8998/places/update/${id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify(obj)
  });
  if(res.ok){
    res = await res.json();
    popup(`<p> ${res.msg}</p>`);
    fetchRender();
  }else{
    res = await res.json();
    popup(`<p>${res.msg || res.err}</p>`)
  }
}

logoutPart.addEventListener('click', (evnt)=>{
    evnt.preventDefault();
    console.log('working fine a tag in html');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'index.html'
})

userInfo.addEventListener('mouseenter', ()=>{
    if(token){
        logoutPart.style.display = 'block'
    }else{
        loginPart.style.display = 'block'
    }
})

userInfo.addEventListener('mouseleave', ()=>{
    loginPart.style.display = 'none';
    logoutPart.style.display = 'none';
})

logoutPart.addEventListener('mouseenter', ()=>{
    logoutPart.style.display = 'block';
})

logoutPart.addEventListener('mouseleave', ()=>{
    logoutPart.style.display = 'none'
})

loginPart.addEventListener('mouseenter', ()=>{
    loginPart.style.display = 'block';
})

loginPart.addEventListener('mouseleave', ()=>{
    loginPart.style.display = 'none'
})


const displayName=()=>{
    const defaultString = `
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="user">
                        <circle fill="none" stroke="white" stroke-width="1.1" cx="9.9" cy="6.4" r="4.4"></circle>
                        <path fill="none" stroke="white" stroke-width="1.1"
                            d="M1.5,19 C2.3,14.5 5.8,11.2 10,11.2 C14.2,11.2 17.7,14.6 18.5,19.2"></path>
                    </svg>
    `
    if(token)
     usernamePos.innerHTML = `<p>${username}</p>`;
     else{
        usernamePos.innerHTML = defaultString;
     }
}

hamIcon.addEventListener('click', ()=>{
    asideSection.style.display = 'block'
})

clearHam.addEventListener('click', ()=>{
    asideSection.style.display = 'none'
})



async function fetchRender(){
  let data = await fetch('http://localhost:8998/places/');
  data = await data.json();
  display(data);
}

async function fetchBooking(){
  let data = await fetch('http://localhost:8998/booking',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  });
  data = await data.json();
  displayingBooking(data);
}

fetchRender();

function display(data){
  let arr = data.map(eachCard);
  listContainer.innerHTML = arr.join('\n');
  localStorage.setItem('totalRevenue', totalRevenue);
  let deletebtn = document.querySelectorAll('#operations #appPlaces .container .card .body .del')
  deletebtn.forEach((el)=>{
    el.addEventListener('click', ()=>{
      deletionOfPlaces(el.dataset.id);
    })
  })
  let editBtn = document.querySelectorAll('#operations #appPlaces .container .card .body .edit');
  editBtn.forEach((el)=>{
    el.addEventListener('click', ()=>{
      updatingElment(el.dataset.id);
    })
  })
}

function displayingBooking(data){
  let arr = data.map(eachBooking);
  if(arr.length===0)
  bookingSectionContainer.innerHTML = `<h1>No one has used Tripping.com yet.</h1>`;
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
  ageGroup.push(el.age);
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

async function updatingElment(id){
  let user = await fetch(`http://localhost:8998/places/${id}`);
  user = await user.json();
  updationFormDiv.style.display= 'block'
  fillingUpdationForm(user);
}

function fillingUpdationForm(obj){
  idEl.value = obj._id;
  updationName.value = obj.name;
  updationImages.value = obj.images.join(', ');
  updationLocation.value = obj.location;
  updationFacilities.value = obj.facilities;
  updationDay.value = obj.day;
  updationBooking.value = obj.isBooked;
  updationPeopleCount.value = obj.noofpeople;
  updationPricing.value = obj.pricing;
  updationDiscount.value = obj.discount;
}

async function deletionOfPlaces(id){
  let res = await fetch(`http://localhost:8998/places/delete/${id}`,{
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  })
  if(res.ok){
    res = await res.json();
    popup(`<p>${res.msg}</p>`);
    fetchRender();
  }else{
    res = await res.json();
    popup(`<p>${res.msg || res.err}</p>`)
  }
}

async function popup(str){
  deleteMsg.innerHTML = str;
  deleteMsg.style.display = 'flex';
  setTimeout(()=>{
    deleteMsg.style.display='none';
  }, 1500);
}

function eachCard(el){
  let str = `
  <div class='card'>
  <div class='image'>
  <img src=${el.images[0]}>
  </div>
  <div class='body'>
  <h2 class='title'>${el.name}</h2>
  <p class='place'>${el.location}</p>
  <p class='isbooked'>${el.isBooked==true?'Booked':'Not Booked'}</p>
  <h3 class='price'>Rs. ${el.actualprice}</h3>
  <button class='edit' data-id=${el._id}> EDIT</button>
  <button class='del' data-id=${el._id}>DELETE</button>
  </div>
  </div>
  `;
  if(el.isBooked===true){
    totalRevenue+=el.actualprice;
  }
  return str;
}