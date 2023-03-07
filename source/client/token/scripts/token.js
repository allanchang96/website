"use strict"

console.log("token");
console.log(document.cookie);

function submit(event) {
    event.preventDefault();
    let username = document.getElementById('username').value;
    console.log(username);
    fetch('http://localhost:3001', { method: 'GET' });
}

const button = document.getElementById('submit');
button.addEventListener('click', submit);