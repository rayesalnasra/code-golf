document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const message = document.getElementById('message');

    form.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData(form);

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                window.location.href = '/welcome.html'; // Redirect to the welcome page
            } else {
                message.textContent = data.error;
                message.style.color = 'red';
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
