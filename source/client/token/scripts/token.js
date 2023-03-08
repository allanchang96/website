"use strict"

function submit(event) {
    event.preventDefault();
    fetch('/create?' + new URLSearchParams({
        username: document.getElementById('username').value,
    }), { method: 'GET' })
        .then((res) => {
            if (res.ok) {
                return res.text();
            }
            else {
                return Promise.reject('response failure');
            }
        })
        .then((data) => {
            document.getElementById('result').innerHTML = data;
        })
        .catch(() => {
            console.log('no response from server');
        };
}

const button = document.getElementById('submit');
button.addEventListener('click', submit);