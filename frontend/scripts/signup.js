const baseUrl = 'http://localhost:8998/user';

const username = document.querySelector('form #name');
const email = document.querySelector('form #email');
const password = document.querySelector('form #password');
const formEl = document.querySelector('form');

formEl.addEventListener("submit", (evnt) => {
    evnt.preventDefault();
    const obj = {};
    obj.name = username.value;
    obj.email = email.value;
    obj.password = password.value;
    registeringUser(obj);
})


const registeringUser = async (obj) => {
    try {
        let res = await fetch(`${baseUrl}/register`, {
            body: JSON.stringify(obj),
            headers: {
                'Content-type': 'application/json'
            },
            method: "POST"
        })
        let result = res.ok;
        res = await res.json();
        if(result){
            alert(res.msg);
            window.location.href = 'signin.html';
        }
        else
        alert(res.msg);
    }catch (err) {
        console.log(err);
    }
}
