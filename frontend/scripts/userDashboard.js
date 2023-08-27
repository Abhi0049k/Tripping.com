const baseServerUrl = 'https://tripping-com.onrender.com'

const tk = localStorage.getItem('token') || '';
const un = localStorage.getItem('username') || '';
const sectionEl = document.querySelector('#main .section');
const accEl = document.querySelector('#acc');
const totalBooksEl = document.querySelector('#totalBooks');
const forgetPassEl = document.querySelector('#forgetPass');
const loutEl = document.querySelector('#lout');

if (tk == '' || un == '') window.location.href = 'index.html';

totalBooksEl.addEventListener('click', () => {
    removingActive();
    totalBooksEl.setAttribute('class', 'active');
    fetchAllBookings();
})

accEl.addEventListener('click', () => {
    removingActive();
    accEl.setAttribute('class', 'active');
    fetchDetails();
})

forgetPassEl.addEventListener('click', () => {
    removingActive();
    forgetPassEl.setAttribute('class', 'active');
    forgetPassword();
})

loutEl.addEventListener('click', () => {
    removingActive();
    loutEl.setAttribute('class', 'active');
})

const removingActive = () => {
    accEl.classList.remove('active');
    totalBooksEl.classList.remove('active');
    forgetPassEl.classList.remove('active');
    loutEl.classList.remove('active');
}

const fetchAllBookings = async() => {
    try {
        let data = await fetch(`${baseServerUrl}/booking/totalbookings`, {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${tk}`
            }
        })
        let st = data.ok;
        data = await data.json();
        if(data.msg==='Token has expired' || data.msg==='Login Again' || !st){
            refreshAll();
            return;
        }

        if(data.length===0) return showMessage();

        for (let i = 0; i < data.length; i++) {
            let placeId = String(data[i].placeId);
            let img;
            try {
                img = await fetch(`${baseServerUrl}/img?placeId=${placeId}`)
            } catch (err) {
                throw err;
            }
            st = img.ok
            img = await img.json();
            if(!st) return refreshAll();
            data[i].place.img = img.url;
        }
        displayAllBookings(data);
    } catch (err) {
        console.log(err);
    }
}

const showMessage = ()=>{
    let str = `
    <div class='nobooks'>
    <i class="fas fa-circle-exclamation"></i>
    <h1>You haven't booked any place for rental yet.</h1>
    <p>Explore our amazing places and start booking now.</p>
    <a href="searchResult.html">Browse Places</a>
    </div>
    `;
    sectionEl.classList.add('specialBg')
    sectionEl.innerHTML = str;
}

const displayAllBookings = (data) => {
    let arr = data.map((el) => Card(el));
    let container = `
    <div class='cardContainer'>
    ${arr.join('\n')}
    </div>
    `;
    sectionEl.innerHTML = container;
    const allCancelBtns = document.querySelectorAll('.cancel-button');
    allCancelBtns.forEach((el) => {
        el.addEventListener('click', (evnt) => {
            cancelBooking(evnt.target.getAttribute('data-id'));
        })
    })
}

const cancelBooking = async (id) => {
    try {
        let res = await fetch(`${baseServerUrl}/booking/deleteBooking/${id}`, {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${tk}`
            },
            method: 'DELETE'
        })
        const st = res.ok;
        res = await res.json();
        if (st) {
            alert(res.msg);
            return fetchAllBookings();
        }
        if (res.msg === 'Token has expired' || res.msg === 'Login Again' || !st) {
            refreshAll();
            return;
        }
    } catch (err) {
        console.log(err);
    }
}

const Card = (el) => {
    let disable = new Date() > new Date(el.checkInDate);
    let str = `
    <div class="card">
    <img class="place-image" src="${el.place.img}" alt="Place Image">
    <div class="details">
    <div class="place-name">${el.place.name}</div>
    <div class="place-location">${el.place.location}</div>
    <div class="info-label">Booking Details:</div>
    <div class="info-value">Check-in: ${formatDate(el.checkInDate)}</div>
    <div class="info-value">Check-out: ${formatDate(el.checkOutDate)}</div>
    <div class="info-value">Total Cost: Rs.${el.totalCost}</div>
    <div class="client-name">${el.client.firstName} ${el.client.lastName}</div>
    <div class="client-contact">Phone: ${el.client.phoneNumber}</div>
    <div class="client-contact">Email: ${el.client.email}</div>
    ${disable ? (`<button class='cancel-button' disabled data-id=${el._id}>Cancel Booking</button>`) : (`<button class='cancel-button' data-id=${el._id}>Cancel Booking</button>`)
        }
    </div>
    </div>
    `
    return str;
}

const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}-${month}-${year}`;
}

const fetchDetails = async () => {
    try {
        let data = await fetch(`${baseServerUrl}/user/userDetails`, {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${tk}`
            }
        })
        const st = data.ok
        data = await data.json();
        if (data.msg === 'Token has expired' || data.msg === 'Login Again' || !st) {
            refreshAll();
            return;
        }
        displayAcc(data);
    } catch (err) {
        console.log(err);
    }
}

fetchDetails();

const forgetPassword = () => {
    let str = `
    <form>
    <input type='password' placeholder='Enter New Password' id='newPassone'>
    <input type='password' placeholder='Confirm Password' id='newPasstwo'>
    <input type='submit' value='Update Password' id='updatepassbtn'>
    </form>
    `
    sectionEl.innerHTML = str;
    const updatePassEl = document.querySelector('#updatepassbtn');
    const newPassoneEl = document.querySelector('#newPassone');
    const newPasstwoEl = document.querySelector('#newPasstwo');
    updatePassEl.addEventListener('click', (evnt) => {
        evnt.preventDefault();
        let passOne = newPassoneEl.value;
        let passTwo = newPasstwoEl.value;
        if (passOne != passTwo || passOne === '' || passTwo === '') return alert('Please Enter the correct Confirm Password');
        updatingPassword(passOne);
    })
}

const displayAcc = (data) => {
    let str = `
    <form>
    <input type='text' value='${data.name}' placeholder='Enter Name' id='nameEl'>
    <input type='email' value='${data.email}' placeholder='Enter Email' id='emailEl'>
    <input type='submit' value='Update Details' id='updateDetails'>
    </form>
    `;
    sectionEl.innerHTML = str;
    const updateDetailEl = document.querySelector('#updateDetails');
    const nameEl = document.querySelector('#nameEl');
    const emailEl = document.querySelector('#emailEl');
    updateDetailEl.addEventListener('click', (evnt) => {
        evnt.preventDefault();
        let obj = {};
        obj.name = nameEl.value;
        obj.email = emailEl.value;
        updatingDetails(obj);
    })
}


const updatingDetails = async (obj) => {
    try {
        let res = await fetch(`${baseServerUrl}/user/updateUserDetails`, {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${tk}`
            },
            method: 'PATCH',
            body: JSON.stringify(obj)
        })
        let st = res.ok;
        res = await res.json();
        if (res.msg === 'Token has expired' || res.msg === 'Login Again' || !st) {
            refreshAll();
            return;
        }
        alert(res.msg);
        alert('Login Again to see changes');
    } catch (err) {
        console.log(err);
    }
}

const updatingPassword = async (password) => {
    try {
        let res = await fetch(`${baseServerUrl}/user/updatePassword`, {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${tk}`
            },
            method: 'PATCH',
            body: JSON.stringify({ password })
        })
        let st = res.ok
        res = await res.json();
        if (res.msg === 'Token has expired' || res.msg === 'Login Again' || !st) {
            refreshAll();
            return;
        }
        alert(res.msg);
        alert('Login Again to see changes');
    } catch (err) {
        console.log(err);
    }
}

const refreshAll = ()=>{
    alert('Something went wrong. Redirecting to the home page');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'index.html'
}


loutEl.addEventListener('click', ()=>{
    logUserOut();
})

const logUserOut = async () => {
    try {
        let res = await fetch(`${baseServerUrl}/user/logout`, {
            headers: {
                Authorization: `Bearer ${tk}`,
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