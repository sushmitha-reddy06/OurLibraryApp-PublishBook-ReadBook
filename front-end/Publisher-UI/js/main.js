document.getElementById('publishForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const bookTitle = document.getElementById('book_title').value;
    const bookAuthor = document.getElementById('book_author').value;
    const genre = document.getElementById('genre').value;
    const description = document.getElementById('description').value;
    const bookCoverImage = document.getElementById('book_coverImg').files[0]

    const authToken = localStorage.getItem('token');
    console.log('authToken', authToken);
    const bId = localStorage.getItem('bookId')
    console.log('bId', bId);
    const adminId = localStorage.getItem('adminId');
    console.log('adminId', adminId);

    const formData = new FormData();
    formData.append('book_title', bookTitle)
    formData.append('book_author', bookAuthor)
    formData.append('genre', genre)
    formData.append('description', description);
    formData.append('file', bookCoverImage)

    fetch('http://localhost:3000/home/publish', {
        method: 'POST',
        headers: {
            // 'Content-Type': 'application/json',
            'Authorization': `${authToken}`,
            'publisherId': adminId
        }, 
        // body: JSON.stringify({ book_title: bookTitle, book_author: bookAuthor })
        body: formData
    })
    .then(response => {
        if (response.status == 400) {
            throw new Error('Failed to publish the book');
        } else if (response.status == 401) {
            throw new Error('The book is already published!')
        }
        return response.json();
    })
    .then(data => {
        console.log('Response: ', data);
        // console.log('data.token', data.token);
        // localStorage.setItem('token', data.token);
        localStorage.setItem('bookId', data.bookId)
        localStorage.setItem('adminId',  data.adminId)
        const messageElement = document.getElementById('message').innerHTML = '<p>Book published successfully!</p>';
        messageElement.textContent = `ISBN code: ${data.ISBN_code}`;
    })
    .catch(error => {
        document.getElementById('message').innerHTML = '<p>Error: ' + error.message + '</p>';
    });
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    logout();
})

function logout() {
    localStorage.removeItem('adminId');
    localStorage.removeItem('token');

    setTimeout(function() {
        window.location.href = 'login.html'
    }, 2000);
}


