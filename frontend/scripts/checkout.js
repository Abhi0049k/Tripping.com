const baseServerUrl = 'http://localhost:8998/booking'
const tn = localStorage.getItem('token') || '';
const un = localStorage.getItem('username') || '';
const imgEl = document.querySelector('#imgField');
const propertyIdEl = document.querySelector('#propertyId');
const propertyNameEl = document.querySelector('#propertyName');
const propertyLocationEl = document.querySelector('#propertyLocation');
const maxCountEl = document.querySelector('#maxCount');
const checkInEl = document.querySelector('#checkIn');
const checkOutEl = document.querySelector('#checkOut');
const priceEl = document.querySelector('#price');
const taxEl = document.querySelector('#tax');
const totalEl = document.querySelector('#total');
const btnEl = document.querySelector('#btn');
const phoneNumber = document.querySelector('#phoneNumber');
const email = document.querySelector('#email');
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const requests = document.querySelector('#requests');
let currURL = window.location.href;

try{
    currURL = currURL.split('?')[1].split('=')[1] || '';
}catch(err){
    currURL = '';
}

if(tn==='' || un==='' || currURL===''){
    window.location.href = 'index.html';
}

let data;

const fetchRender = async()=>{
    try{
        data = await fetch(`${baseServerUrl}/confirmBooking/${currURL}`,{
            headers:{
                'Content-type': 'application/type',
                Authorization: `Bearer ${tn}`
            }
        })
        data = await data.json();
        if(data.msg=='Booking is Already Confirmed') window.location.href = 'index.html';
        display(data);
    }catch(err){
        console.log(err);
    }
}

const display = (data)=>{
    imgEl.src = data.img;
    propertyIdEl.innerText = `Property Ref Id ${data.propertyId}`;
    propertyNameEl.innerText = data.title;
    propertyLocationEl.innerText = data.location;
    maxCountEl.innerText = data.maxPeople;
    checkInEl.innerText = data.checkIn;
    checkOutEl.innerText = data.checkOut;
    priceEl.innerText = `Rs. ${data.cost}`;
    let tax = (18 * data.cost)/100;
    taxEl.innerText = `Rs. ${tax}`;
    totalEl.innerText = `${tax+data.cost}`
}

fetchRender();

btnEl.addEventListener('click', (evnt)=>{
    let obj = {};
    obj.bookingId = currURL;
    obj.phoneNumber = phoneNumber.value;
    obj.firstName = firstName.value;
    obj.lastName = lastName.value;
    obj.email = email.value;
    obj.requests = requests.value;
    obj.totalCost = totalEl.innerText;
    if(obj.phoneNumber && obj.firstName && obj.lastName && obj.email)
    confirmBooking(obj);
    else
    alert('Fill the form to proceed');
})


const confirmBooking = async(obj)=>{
    try{
        let res = await fetch(`${baseServerUrl}/completeBooking`, {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${tn}`
            },
            method: 'POST',
            body: JSON.stringify(obj)
        });
        res = await res.json();
        alert('Booking confirmed');
        if(res.msg=='Booking confirmed') window.location.href = 'index.html';
    }catch(err){
        console.log(err);
    }
}