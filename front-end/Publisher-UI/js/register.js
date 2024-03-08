document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, email: email, password: password })
    })
    .then(response => {
        if (response.status === 400) {
            throw new Error('Failed to register! Please try again.');
        } else if (response.status === 401) {
            throw new Error('The user with this email address already exists!');
        }
        return response.json();
        // const responseData = localStorage.setItem(response.json());
        // return console.log('responseData', responseData);
    })
    .then(data => {
        console.log('Response', data);
        localStorage.setItem('token', data.token);
        const messageElement = document.getElementById('message');
        messageElement.innerHTML = '<p>Registration successful!</p>';
        setTimeout(function() {
            window.location.href = 'login.html';
        }, 2000);
    })
    .catch(error => {
        document.getElementById('message').innerHTML = '<p>Error: ' + error.message + '</p>';
    });
});
