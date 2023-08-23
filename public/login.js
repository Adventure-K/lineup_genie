function logIn(username, password) {
    console.log('trying login user', username)
    const credentials = {
        email: username,
        password: password,
    }
    console.log(credentials)
    const loginUrl = '/auth/signin';
    fetch(loginUrl, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(credentials),
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('user', JSON.stringify(username));
        window.location.href = "manage.html"
    })
    .catch(error => {
        console.error('Login error: ', error);
    });
}

document.getElementById('loginSubmit').addEventListener('click', function() {
    const username = document.getElementById('user').value;
    const password = document.getElementById('pass').value;
    logIn(username, password);
})

