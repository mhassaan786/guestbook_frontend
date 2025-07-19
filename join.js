// configuration for backend
import { API_BASE } from "./config.js";

// checking if user is already loged in
// function getCookies(name) {
//     const cookies = document.cookie.split('; ');
//     for (const cookie of cookies) {
//         const [key, value] = cookie.trim().split('=');
//         if (key === name) {
//             return value;
//         }
//     }
//     return null;
// }
// let user_id = getCookies("user_id") || 0

// //is user_id not exist:
// if(user_id != 0 && user_id != null ) {
//     window.location.href = './';
//     console.log(user_id)
// }
const formReg = document.querySelector('#reg');

if(formReg) {
formReg.addEventListener('submit', async(event) => {
event.preventDefault();
const formData = new FormData(formReg)
const realData = Object.fromEntries(formData.entries());

const data = await fetch("/register", {
    method: "POST",
    headers:{
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(realData)
})
const resp = await data.json();
    let info = document.querySelector('#msgInfo');
if(resp.exist){
    info.classList.add("error")
    if(info.classList.contains("success")){
      info.classList.remove("success")  
    } 
    info.textContent = 'User already exists';
}else {
    info.classList.add('success');
    if(info.classList.contains("error")) {
        info.classList.remove("error")
    }
    info.textContent = 'Successfully registered';
}
    window.location.href = './login.html';
console.log('Response:', resp.message);
})
}

// Redirect to login if user_id is set
const formLogin = document.querySelector('#login');
if(formLogin) {
formLogin.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const formData = new FormData(formLogin)
    const realData = Object.fromEntries(formData.entries());

    //request to the server
    const data = await fetch("/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(realData)
    }) 
    const res = await data.json();
    console.log('Response:', res.message);
    if(res.create_id) {
    let success = document.querySelector('#msgInfo');
    success.classList.add('success');
    if(success.classList.contains('error')){
    success.classList.remove('error'); //if exist
    }
    success.textContent = res.message;    
    // console.log('Your Id: ', res.user_id, "we have name: ", res.username);
    setTimeout(() => {
        // document.cookie = `user_id= ${res.create_id}; path=/`; // Set cookie for 7 days
        window.location.href = './';
    }, 1500)
    formLogin.reset();
    }
    if(res.error){
        let error = document.querySelector('#msgInfo');
            error.classList.add('error');
        if(error.classList.contains('success')){
        error.classList.remove('success'); //if exist
        }
        error.textContent = res.message;    
        error.textContent = res.message;
        setTimeout(() => {
            window.location.href = '/register.html';
        }, 1500)
    }
})
};