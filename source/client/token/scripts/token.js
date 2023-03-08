"use strict"

console.log("token");
console.log(document.cookie);

function submit(event) {
    event.preventDefault();
    console.log(document.getElementById('username'));
    fetch('/create?' + new URLSearchParams({
        username: document.getElementById('username').value,
    }), { method: 'GET' })
        .then((res) => {
            document.getElementById('result').innerHTML = res.body
        }
    );
}

const button = document.getElementById('submit');
button.addEventListener('click', submit);