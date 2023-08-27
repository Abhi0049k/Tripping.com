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
const locationEl = document.querySelector('#container form label #location');
const qty = document.querySelector('#qty');
const startDateInput = document.querySelector("#checkin");
const endDateInput = document.querySelector('#checkout');
let daysDifference = 0;

const datePicker = flatpickr('#checkin', {
    mode: "range",
    dateFormat: "d-m-Y",
    minDate: 'today',
    onClose: function (selectedDates, dateStr, instance) {
        if (selectedDates.length > 0) {
            daysDifference = Math.floor((selectedDates[selectedDates.length-1] - selectedDates[0]) / (1000 * 60 * 60 * 24)) + 1;
            const formattedStartDate = selectedDates[0].toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric" });
            const formattedEndDate = selectedDates[selectedDates.length - 1].toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric" });

            startDateInput.value = formattedStartDate;
            endDateInput.value = formattedEndDate;
        }
    }
});

asia.addEventListener('click', () => {
    removing();
    asia.setAttribute('class', 'active')
    asiaPart.style.display = 'grid';
})
europe.addEventListener('click', () => {
    removing();
    europe.setAttribute('class', 'active')
    europePart.style.display = 'grid';
})
northAmerica.addEventListener('click', () => {
    removing();
    northAmerica.setAttribute('class', 'active')
    namericaPart.style.display = 'grid';
})
southAmerica.addEventListener('click', () => {
    removing();
    southAmerica.setAttribute('class', 'active');
    samericaPart.style.display = 'grid';
})
africa.addEventListener('click', () => {
    removing();
    africa.setAttribute('class', 'active');
    africaPart.style.display = 'grid';
})
oceania.addEventListener('click', () => {
    removing();
    oceania.setAttribute('class', 'active');
    oceniaPart.style.display = 'grid';
})


function removing() {
    asia.setAttribute('class', '');
    europe.setAttribute('class', '');
    northAmerica.setAttribute('class', '');
    southAmerica.setAttribute('class', '');
    africa.setAttribute('class', '');
    oceania.setAttribute('class', '');
    asiaPart.style.display = 'none';
    europePart.style.display = 'none';
    namericaPart.style.display = 'none';
    samericaPart.style.display = 'none';
    africaPart.style.display = 'none';
    oceniaPart.style.display = 'none';
}


const formEl = document.querySelector('form');

formEl.addEventListener('submit', (evnt)=>{
    evnt.preventDefault();
    let obj = {};
    obj.location = locationEl.value;
    obj.checkIn = startDateInput.value;
    obj.checkOut = endDateInput.value;
    obj.qty = qty.value;
    obj.noOfDiff = daysDifference;
    window.location.href = `/searchResult.html?loc=${obj.location}&checkIn=${obj.checkIn}&checkOut=${obj.checkOut}&qty=${obj.qty}&days=${obj.noOfDiff}`
})
