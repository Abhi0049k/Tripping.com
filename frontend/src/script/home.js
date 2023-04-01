const asia = document.querySelector('.fifthContainer .mainContainer .list h5:nth-child(1)');
const europe = document.querySelector('.fifthContainer .mainContainer .list h5:nth-child(2)');
const northAmerica = document.querySelector('.fifthContainer .mainContainer .list h5:nth-child(3)');
const southAmerica = document.querySelector('.fifthContainer .mainContainer .list h5:nth-child(4)');
const africa = document.querySelector('.fifthContainer .mainContainer .list h5:nth-child(5)');
const oceania = document.querySelector('.fifthContainer .mainContainer .list h5:nth-child(6)');
const asiaPart = document.querySelector('.fifthContainer .mainContainer >.asia');
const europePart = document.querySelector('.fifthContainer .mainContainer > .europe');
const namericaPart = document.querySelector('.fifthContainer .mainContainer > .namerica');
const samericaPart = document.querySelector('.fifthContainer .mainContainer > .samerica');
const africaPart = document.querySelector('.fifthContainer .mainContainer > .africa');
const oceniaPart = document.querySelector('.fifthContainer .mainContainer > .oceania');


asia.addEventListener('click', ()=>{
    removing();
    asia.setAttribute('class', 'active')
    asiaPart.style.display = 'grid';
})
europe.addEventListener('click', ()=>{
    removing();
    europe.setAttribute('class', 'active')
    europePart.style.display = 'grid';
})
northAmerica.addEventListener('click', ()=>{
    removing();
    northAmerica.setAttribute('class', 'active')
    namericaPart.style.display = 'grid';
})
southAmerica.addEventListener('click', ()=>{
    removing();
    southAmerica.setAttribute('class', 'active');
    samericaPart.style.display = 'grid';
})
africa.addEventListener('click', ()=>{
    removing();
    africa.setAttribute('class', 'active');
    africaPart.style.display = 'grid';
})
oceania.addEventListener('click', ()=>{
    removing();
    oceania.setAttribute('class', 'active');
    oceniaPart.style.display = 'grid';
})


function removing(){
    asia.setAttribute('class', '');
    europe.setAttribute('class', '');
    northAmerica.setAttribute('class', '');
    southAmerica.setAttribute('class', '');
    africa.setAttribute('class', '');
    oceania.setAttribute('class', '');
    asiaPart.style.display= 'none';
    europePart.style.display= 'none';
    namericaPart.style.display= 'none';
    samericaPart.style.display= 'none';
    africaPart.style.display= 'none';
    oceniaPart.style.display= 'none';
}

// Search Bar 

const formEl = document.querySelector('header > #container > .search-bar > form');
const locationEl = document.querySelector('header > #container > .search-bar > form #location')
const noofpeople = document.querySelector('header > #container > .search-bar > form #numberOfPeople')

formEl.addEventListener('submit', (evnt)=>{
    evnt.preventDefault();
    let location = locationEl.value;
    let peopleCount = noofpeople.value;
    localStorage.setItem('queryloc', location);
    localStorage.setItem('querycount', peopleCount);
    window.location.href = 'searchResult.html';
})