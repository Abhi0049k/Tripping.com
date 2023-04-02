const containerEl = document.querySelector('#searchResult > #container');
const loc = localStorage.getItem('queryloc') || '';
const noofpeople = localStorage.getItem('querycount') || '';
const tk = localStorage.getItem('token') || '';
const infoScreen = document.querySelector('#bookingConfirming');
const clearinfoScreen = document.querySelector('#bookingConfirming .clearConfirmation');
const formEl = document.querySelector('#bookingConfirming form');
const nameEl = document.querySelector('#name');
const ageEl = document.querySelector('#age');
const emailEl = document.querySelector('#email');
const checkinEl = document.querySelector('#checkin');
const checkoutEl = document.querySelector('#checkout');
const idproof = document.querySelector('#idProof');
const notification = document.querySelector('#notification');
const userId = localStorage.getItem('userId')

let count = 0;

window.addEventListener('load', () => {
    fetchRender();
})

clearinfoScreen.addEventListener('click', ()=>{
    infoScreen.style.display = 'none';
})

formEl.addEventListener('submit', (evnt)=>{
    evnt.preventDefault();
    let placeId = localStorage.getItem('placeId');
    localStorage.removeItem('placeId');
    let obj = {};
    obj.name = nameEl.value;
    obj.age = Number(ageEl.value);
    obj.email = emailEl.value;
    obj.checkin = checkinEl.value;
    obj.checkout = checkoutEl.value;
    obj.adhaarNo = idproof.value;
    obj.placeId = placeId;
    addbookingRoute(obj, placeId);
    changingBookingStatus(placeId);
})

async function changingBookingStatus(id){
    let obj = {isBooked: true}
    let res = await fetch(`http://localhost:8998/places/update/${id}`,{
        body: JSON.stringify(obj),
        headers:{
            'Content-type': 'application/json',
        },
        method: 'PATCH'
    });
    if(res.ok){
        fetchRender();
    }else{
        console.log('not change');
    }
}

async function changinguserStatus(bookingId){
    let user = await fetch(`http://localhost:8998/user/${userId}`);
    user = await user.json();
    user.booking.push(bookingId);
    let res = await fetch(`http://localhost:8998/user/update/${userId}`,{
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        method: 'PATCH'
    })
    if(res.ok){
        console.log('Job Done');
    }else{
        console.log('got fired');
    }
}

async function addbookingRoute(obj, id){
    let res = await fetch(`http://localhost:8998/booking/book`,{
        body: JSON.stringify(obj),
        headers: {
            'Content-type': 'application/json',
            Authorization: tk
        },
        method: "POST"
    })
    if(res.ok){
        res = await res.json();
        popup('Booking Confirm')
        changinguserStatus(id)
        infoScreen.style.display = 'none';
        removingValue();
    }else{
        popup('Something went wrong');
        infoScreen.style.display = 'none'
        console.log('something went wrong');
    }
}

function removingValue(){
    nameEl.value = '';
    ageEl.value = '';
    emailEl.value = '';
    checkinEl.value = '';
    checkoutEl.value = '';
    idproof.value = '';
}

async function fetchRender() {
    try{
        let data = await fetch(`http://localhost:8998/places?query=${loc}`);
        data = await data.json();
        display(data);
    }catch(err){
        console.log(err);
    }
}

function display(data) {
    let arr = data.map(eachCard);
    if(arr.length===0)
    containerEl.innerHTML = `<h1>No Home Found Matching this requirement.</h1>`;
    else
    containerEl.innerHTML = arr.join('\n');
    document.querySelector('#searchResult h3').innerText = `Total ${count} Results`;
    count = 0;
    let bookingbtn = document.querySelectorAll('.book');
    bookingbtn.forEach((el) => {
        el.addEventListener('click', () => {
            if(tk==''){
                popup('Login First');
            }else{
                bookingResort(el.dataset.id);
            }
        })
    })
}

async function bookingResort(id) {
    localStorage.setItem('placeId', id);
    infoScreen.style.display = 'block';
}

function eachCard(el) {
        if(!el.isBooked){
        count++;
        let facilities = el.facilities.map(individualfacility);
        let str = `
        <div class='card'>
        <div class='image'>
        <img src=${el.images[0]}>
        </div>
        <div class='body'>
        <h5>Ref id #${el._id}</h5>
        <h2 class='title'>${el.name}</h2>
        <p class='place'>${el.location}</p>
        <p class='facilities'>${facilities.join(' ')}</p> 
        <p class='isbooked'>${el.isBooked == true ? 'Booked' : 'Not Booked'}</p>
        <h3 class='price'><small><del>Rs.${el.pricing}</del></small>  Rs. ${el.actualprice}</h3>
        <button class='book' data-id=${el._id}>Book</button>
        </div>
        </div>
        `;
        return str;
    }
    return '';
}

function individualfacility(el) {
    let str = `
    <span>${el}</span>
    `
    return str;
}

async function popup(str){
    notification.innerHTML = str;
    notification.style.display = 'flex';
    setTimeout(()=>{
      notification.style.display='none';
    }, 1500);
  }