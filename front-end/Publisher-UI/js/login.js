document.getElementById('loginForm').addEventListener('submit',function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password   = document.getElementById('password').value;

    fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if  (response.status == 400 ) {
            throw new  Error('Failed to Login! try again.');
        } else if ( response.status == 401 ) {
            throw new Error('Invalid Email or Password!')
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('adminId', data.adminId)

        console.log('Response: ', data);
        const messageElement = document.getElementById('message').innerHTML = '<p>Login successfull!</p>';

        setTimeout(function() {
            window.location.href = 'publish.html'
        }, 2000); //3000 millisec = 3s
        
    })
    .catch(error => {
        document.getElementById('message').innerHTML  = '<p>Error: ' + error.message + '</p>'
    })
})  