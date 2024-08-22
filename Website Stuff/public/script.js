// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    // Select the form element
    const message = document.getElementById('message');
    // Select the id element 'message'

    form.addEventListener('submit', event => {
        event.preventDefault();
        // To prevent automatic redirection

        const formData = new FormData(form);
        // Collects form data

        fetch('/login', {
            method: 'POST',
            body: new URLSearchParams(formData)
        })
        .then(response => response.text())
        // Conver response into text
        .then(text => {
            if (text.includes('Welcome')) {
                window.location.href = '/welcome.html'; // Redirect to the welcome page
            } else {
                message.textContent = text;
                message.style.color = 'red'; 
                // A invalid response message on the element id 'message'
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
