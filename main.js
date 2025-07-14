// configuration for backend
import { API_BASE } from "./config.js";

//configure for the user;
let user_id = getCookies("user_id") || 0;

// state data
const msg = document.querySelector('#messages');
const uname = document.querySelector("#UserName");

// Function to fetch data from the server
async function fetchData() {   
    try {
        const response = await fetch(`${API_BASE}/api/data`, {
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();        
        if(!data.get){
            msg.textContent = data.noData;
        }else {
            msg.innerHTML = ''; // Clear previous messages 
            console.log('Fetched Data:', data.msg);            
            data.msg.forEach((item, index) => {
            msg.innerHTML += `<div class='msg2k25'><p>Message ${index + 1}: ${item.msg} by ${item.gname}</p> <button class="btn" data-id=${item._id}>Delete</button></div>`;
            })
        }
        uname.textContent = `Hey, ${data.username}`
    } catch (error) {
        console.error('Error fetching data:', error);
        msg.innerHTML = 'There was error in fetching data';
    }
}

// Check if user_id is set in cookies
function getCookies(name){    
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
            return value;
        }
    }
    return null;
}

if(user_id == null || user_id == 0) {
    window.location.href = './login.html';    
}else {

// continue with the rest of the code
const Form = document.querySelector('form');
Form.addEventListener('submit', async(event) => {
    event.preventDefault();
    const formData = new FormData(Form);
    console.log('Form Data:', Object.fromEntries( formData.entries() ));
    Form.reset();
    // Here you can add code to send the form data to the server
    const sendData = await fetch(`${API_BASE}/`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        credentials: 'include', // 👈 This sends cookies
        body: JSON.stringify(Object.fromEntries(formData.entries()))
    })
    console.log(user_id);
    const resp = await sendData.json();
    console.log('Response:', resp);
    
    fetchData(); // Refresh the data after sending
})

fetchData();

// Event listener for delete buttons
    msg.addEventListener('click', (event) => {
        if(event.target.tagName === 'BUTTON' && event.target.dataset.id) {
            const id = event.target.dataset.id;
            DeleteAll(id);
            console.log(id)
        }
    })
}

// delete custom messages
async function DeleteAll(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try{
    const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    })
    if(res.ok) {
        console.log('Message deleted successfully');
        fetchData(); // Refresh the data after deletion
    }
    }catch (error) {
    console.log('Error deleting message:', error);
    }    
}