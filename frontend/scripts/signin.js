const baseUrl = 'https://tripping-com.onrender.com/user';
const email= document.querySelector('form #email');
const password = document.querySelector('form #password');
const formEl = document.querySelector('form');

formEl.addEventListener('submit', (evnt)=>{
    evnt.preventDefault();
    const obj = {};
    obj.email = email.value;
    obj.password = password.value;
    gettingLoggedIn(obj);
})

const gettingLoggedIn = async (obj) =>{
    let res = await fetch(`${baseUrl}/login`, {
        body: JSON.stringify(obj),
        headers: {
            'Content-type': 'application/json'
        },
        method: "POST"
    })
    if(res.ok){
        res = await res.json();
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        alert(res.msg);
        window.location.href = 'index.html';
    }else{
        res = await res.json();
        alert(res.msg);
    }
}