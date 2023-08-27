const baseServerURL = 'https://tripping-com.onrender.com'
let data = [];
const currURL = window.location.href;


const locInfo = { location: '', checkIn: '', checkOut: '', qty: '', days: 0 }
try {
    let info = currURL.split('?')[1].split('&');
    info = info.forEach((el) => {
        el = el.split('=');
        if (el[0] == 'loc')
            locInfo['location'] = el[1].replace('%20', ' ');
        else {
            if (el[0] == 'qty' || el[0] == 'days') locInfo[el[0]] = Number(el[1]);
            else if (el[0] == 'checkIn') locInfo[el[0]] = el[1];
            else if (el[0] == 'checkOut') locInfo[el[0]] = el[1];
            else
                locInfo[el[0]] = el[1];
        }
    })
} catch (err) {
    console.log(err);
}

const iframeEl = document.querySelector('#locationMap');
const errMsgEl = document.querySelector('#errMsg')
const searchResult = document.querySelector('#searchResult');
const containerEl = document.querySelector('#searchResult #left .lowers .cardContainer');
const lowerExtras = document.querySelector('#searchResult #left .lowers .extras');
const totalCount = document.querySelector('#searchResult #left .lowers .extras h3');
let tkn = localStorage.getItem('token') || ''
let uname = localStorage.getItem('username') || '';


const fetchRender = async () => {
    if (locInfo.location) {
        locInfo.checkIn = locInfo.checkIn.split('/');
        let day = parseInt(locInfo.checkIn[0], 10)+1;
        let month = parseInt(locInfo.checkIn[1], 10) - 1;
        let year = parseInt(locInfo.checkIn[2], 10);
        locInfo.checkIn = new Date(year, month, day);
        locInfo.checkOut = locInfo.checkOut.split('/');
        day = parseInt(locInfo.checkOut[0], 10)+1,
        month = parseInt(locInfo.checkOut[1], 10) - 1;
        year = parseInt(locInfo.checkOut[2], 10);
        locInfo.checkOut = new Date(year, month, day);
        try {
            data = await fetch(`${baseServerURL}/place`, {
                body: JSON.stringify(locInfo),
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                }
            })
            data = await data.json();
            totalCount.innerText = `Total ${data.length} results.`;
            if (data.length !== 0) display(data);
            else {
                iframeEl.src = '';
                lowerExtras.style.display = 'none';
                errMsgEl.style.display = 'flex'
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            data = await fetch(`${baseServerURL}/place`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            data = await data.json();
            totalCount.innerText = `Total ${data.length} results.`;
            if (data.length !== 0) display(data);
            else {
                iframeEl.src = '';
                lowerExtras.style.display = 'none';
                errMsgEl.style.display = 'flex';
            }
        } catch (err) {
            console.log(err);
        }
    }
}

fetchRender();

const display = async (data) => {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
        let bag = await eachCard(data[i]);
        arr.push(bag);
    }
    containerEl.innerHTML = arr.join('\n');
    let allCards = document.querySelectorAll('#searchResult #left .lowers .cardContainer .card');
    allCards.forEach((el) => {
        el.addEventListener('mouseenter', (evnt) => {
            let vl = evnt.target.getAttribute('data-tag');
            iframeEl.src = vl
        })
    })
    let allbookBtns = document.querySelectorAll('#searchResult #left .lowers .cardContainer .card');
    allbookBtns.forEach((el) => {
        el.addEventListener('click', (evnt) => {
            if (!(tkn && uname)) return alert('To book a rental place, please log in first.');
            let placeId = evnt.target.getAttribute('data-placeId');
            addBooking(placeId)
        })
    })
}

const addBooking = async (placeId) => {
    let obj = {
        checkIn: locInfo.checkIn,
        checkOut: locInfo.checkOut,
        days: daysDifference,
        placeId
    }
    try {
        let res = await fetch(`${baseServerURL}/booking/bookPlace`, {
            body: JSON.stringify(obj),
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${tkn}`
            }
        })
        if(res.ok){
            res = await res.json();
            alert(res.msg)
            window.location.href = `/checkOut.html?id=${res.bookingId}`
        }else{
            res = await res.json();
            alert(res.msg);
        }
    } catch (err) {
        console.log(err);
    }
}

const eachCard = async (el) => {
    let img = await fetchImg(el._id);
    let faci = el.facilities.map(e => `<div class='facis'>${e}</div>`).join('\n')
    let str = `
    <div class='card' data-tag=${el.mapHTML}>
    <div class='image'>
    <img src=${img}>
    </div>
    <div class='body'>
    <h5>Ref id #${el._id}</h5>
    <h2 class='title'>${el.name}</h2>
    <p class='place'>${el.location}</p>
    <div class='facilities'>${faci}</div>
    ${el.discount !== 0 ?
            '<h3 class="price"><small><del>Rs. ' + (el.price * locInfo.days || el.price) + '</del></small> Rs. ' + (el.actualprice * locInfo.days || el.actualprice) + ' <small> for ' + (locInfo.days || 1) + ' nights </small></h3>'
            : '<h3 class="price">Rs. ' + (el.actualprice * locInfo.days || el.actualprice) + '<small> for ' + (locInfo.days || 1) + ' nights </small></h3>'}
    <button class='book' data-placeId=${el._id}>Book</button>
    </div>
    </div>
    `;
    return str;
}

const fetchImg = async (id) => {
    try {
        let img = await fetch(`${baseServerURL}/img?placeId=${id}`);
        img = await img.json();
        return img.url;
    } catch (err) {
        console.log(err);
    }
}


const modifyFormBtn = document.querySelector('#modifyFormBtn');
const modifyForm = document.querySelector('#modifyForm');
const modifyFormClosebtn = document.querySelector('#closeForm');
const checkInInput = document.querySelector('#checkin');
const checkOutInput = document.querySelector('#checkout');
const locationInput = document.querySelector('#location');
const qty = document.querySelector('#qty');
let daysDifference = locInfo.days;

locationInput.value = locInfo.location;
checkInInput.value = locInfo.checkIn;
checkOutInput.value = locInfo.checkOut;
qty.value = locInfo.qty;

flatpickr('#checkin', {
    mode: "range",
    dateFormat: "d-m-Y",
    minDate: 'today',
    onClose: function (selectedDates, dateStr, instance) {
        if (selectedDates.length > 0) {
            daysDifference = Math.floor((selectedDates[selectedDates.length - 1] - selectedDates[0]) / (1000 * 60 * 60 * 24)) + 1;
            const formattedStartDate = selectedDates[0].toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric" });
            const formattedEndDate = selectedDates[selectedDates.length - 1].toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric" });

            checkInInput.value = formattedStartDate;
            checkOutInput.value = formattedEndDate;
        }
    }
});

modifyForm.addEventListener('submit', (evnt) => {
    evnt.preventDefault();
    let obj = {}
    obj.location = locationInput.value;
    obj.checkIn = checkInInput.value;
    obj.checkOut = checkOutInput.value;
    obj.qty = qty.value;
    obj.noOfDiff = daysDifference;
    window.location.href = `/searchResult.html?location=${obj.location}&checkIn=${obj.checkIn}&checkOut=${obj.checkOut}&qty=${obj.qty}&days=${obj.noOfDiff}`
})

modifyFormBtn.addEventListener('click', (evnt) => {
    modifyForm.style.display = 'flex'
})

modifyFormClosebtn.addEventListener('click', (evnt) => {
    modifyForm.style.display = 'none'
})


const cardOrder = document.querySelector('#orderBy');

cardOrder.addEventListener('change', (evnt) => {
    let order = evnt.target.value;
    if (order == 1) ascendingOrder()
    else descendingOrder()
})


const ascendingOrder = () => {
    data = data.sort((a, b) => a.actualprice - b.actualprice);
    display(data);
}

const descendingOrder = () => {
    data = data.sort((a, b) => b.actualprice - a.actualprice);
    display(data);
}
