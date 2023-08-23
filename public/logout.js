document.getElementById('logoutBtn').addEventListener('click', function() {
    console.log('click logout')
    logOut();
})

function logOut() {
    const url = '/auth/logout';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (response.ok) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/index.html'
        } else {
            console.error('Logout failed:', response.status, response.statusText)
        }
    })
    .catch(err => {
        console.error('Logout failed:', err)
    });
}