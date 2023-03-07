"use strict"

console.log("login");

function submit(event) {
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    fetch('/auth', { method: 'GET' });
}

const button = document.getElementById('submit');
button.addEventListener('click', submit);