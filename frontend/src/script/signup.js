const baseUrl = 'https://fierce-gold-overalls.cyclic.app/user';

const username= document.querySelector('form #name');
const email = document.querySelector('form #email');
const password = document.querySelector('form #password');
const formEl = document.querySelector('form');

formEl.addEventListener("submit", (evnt)=>{
    evnt.preventDefault();
    const obj = {};
    obj.name = username.value;
    obj.email = email.value;
    obj.password = password.value;
    obj.booking = [];
    obj.role = 'explorer'
    registeringUser(obj);
})


const registeringUser = async(obj) =>{
    let  res = await fetch(`${baseUrl}/add`, {
        body: JSON.stringify(obj),
        headers: {
            'Content-type': 'application/json'
        },
        method: "POST"
    })
    if(res.ok){
        res = await res.json();
        const msg = res.msg;
        if(msg==="Registration Successful"){
            alert("Registration Successful");
            window.location.href = 'signin.html';
        }else if(msg==="User already exist, please login"){
            alert("User already exist, please login");
        }
    }else{
        alert('Wrong Credentials');
    }
}