document.addEventListener("DOMContentLoaded", function () {
    const publisherBtn = document.querySelector(".signup button");
    const readerBtn = document.querySelector(".login button");
    const searchForm = document.getElementById('searchForm');
    const searchBar = document.getElementById('searchBar');

    publisherBtn.addEventListener("click", function () {
        window.location.href = "/front-end/Publisher-UI/login.html";
    });

    readerBtn.addEventListener("click", function () {
        window.location.href = "/front-end/Reader-UI/loginReader.html";
    });

    const handleSearchInput = (e) => {
        const searchQuery = searchBar.value.trim().toLowerCase();
        console.log('Search Query:', searchQuery);

        // Filter books based on searchQuery
        filteredBooks = allBooks.filter(book => {
            return book.book_author.toLowerCase().includes(searchQuery) ||
                book.book_title.toLowerCase().includes(searchQuery) ||
                book.genre.toLowerCase().includes(searchQuery) ||
                book.ISBN_code.toLowerCase().includes(searchQuery)
        });

        // Display filtered books
        displayPublishedBooks(filteredBooks);
    };

    searchBar.addEventListener('input', handleSearchInput);

    fetchPublishedBooks();
});

let allBooks = [];
let filteredBooks = [];

async function fetchPublishedBooks() {
    try {
        const response = await fetch('http://localhost:3000/home/published-books');
        const data = await response.json();
        allBooks = data.books;
        filteredBooks = data.books; // Ensure filteredBooks is updated as well
        displayPublishedBooks(allBooks); // Initially display all books
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch published books.');
    }
}

function displayPublishedBooks(books) {
    const bookList = document.getElementById('bookList');
    // Clear previous content
    bookList.innerHTML = "";

    if (books.length === 0) {
        bookList.innerHTML = "<p>No books to show</p>";
    } else {
        books.forEach(book => {
            const bookCard = `
                    <div class="col-md-3 mb-4" style="max-width: 100%">
                        <div class="card" style="height: 102%">
                            <img src="../../backend/publisher/routes/${book.imageDetails.path}" class="card-img-top" alt="Book Cover" style="height: 300px; border: 1px solid #ccc">
                            <div class="card-body">
                                <h5 class="card-title" style="padding-left: 15%; padding-bottom: 10%;">${book.book_title}</h5>
                                <p class="card-text"><b>Author: </b>${book.book_author}</p>
                                <p class="card-text" style="height: 10%;"><b>Genre: </b>${book.genre}</p>
                                <p class="card-text" style="max-sheight: 30%;"><b>Description: </b>${book.description}</p>
                                <p class="card-text"><b>ISBN: </b>${book.ISBN_code}</p>
                            </div>
                        </div>
                    </div>`;
            bookList.innerHTML += bookCard;
        });
    }
}
