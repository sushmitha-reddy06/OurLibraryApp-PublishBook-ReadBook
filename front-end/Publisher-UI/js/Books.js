$(document).ready(() => {
    fetchPublishedBooks();
});

async function fetchPublishedBooks() {
    try {
        const response = await fetch('http://localhost:3000/home/published-books');
        const data = await response.json();
        displayPublishedBooks(data.books);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch published books.');
    }
}

function displayPublishedBooks(books) {
    const bookList = document.getElementById('bookList');

    books.forEach(book => {
        const bookCard = `
            <div class="col-md-3 mb-4" style="max-width: 30%">
                <div class="card" style="height: 102%">
                    <img src="../../backend/publisher/routes/${book.imageDetails.path}" class="card-img-top" alt="Book Cover" style="height: 300px;">
                    <div class="card-body">
                        <h5 class="card-title">${book.book_title}</h5>
                        <p class="card-text"><b>Author: </b>${book.book_author}</p>
                        <p class="card-text"><b>Genre: </b>${book.genre}</p>
                        <p class="card-text";><b>Description: </b>${book.description}</p>
                        <p class="card-text"><b>ISBN: </b>${book.ISBN_code}</p>
                    </div>
                </div>
            </div>
        `;
        bookList.innerHTML += bookCard;
    });
}
