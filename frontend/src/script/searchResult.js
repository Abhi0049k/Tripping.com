const containerEl = document.querySelector('#searchResult > #container');
const loc = localStorage.getItem('queryloc') || '';
const noofpeople = localStorage.getItem('querycount') || '';
const tk = localStorage.getItem('token') || '';
const infoScreen = document.querySelector('#bookingConfirming');
let count = 0;

window.addEventListener('load', () => {
    fetchRender();
})


async function fetchRender() {
    try{
        let data = await fetch('http://localhost:8998/places/');
        data = await data.json();
        display(data);
    }catch(err){
        console.log(err);
    }
}

function display(data) {
    let arr = data.map(eachCard);
    containerEl.innerHTML = arr.join('\n');
    document.querySelector('#searchResult h3').innerText = `Total ${count} Results`;
    count = 0;
    let bookingbtn = document.querySelectorAll('.book');
    bookingbtn.forEach((el) => {
        el.addEventListener('click', () => {
            bookingResort(el.dataset.id);
        })
    })
}

async function bookingResort(id) {
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
        <p class='facilities'>${facilities.join('')}</p> 
        <p class='isbooked'>${el.isBooked == true ? 'Booked' : 'Not Booked'}</p>
        <h3 class='price'>Rs. ${el.actualprice}</h3>
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