document.addEventListener('DOMContentLoaded', async function() {
    const adminId = localStorage.getItem('adminId');
    const token = localStorage.getItem('token');

    if (!token || !adminId) {
        console.error('Token or adminId not found in local storage');
        return;
    }

    const searchForm = document.getElementById('searchForm');
    const searchBar = document.getElementById('searchBar');

    const handleSearchInput = (e) => {
        const searchQuery = searchBar.value.trim().toLowerCase();

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

    await fetchPublishedBooks(token, adminId);
});

let allBooks = [];

async function fetchPublishedBooks(token, adminId) {
    try {
        const response = await fetch(`http://localhost:3000/home/AdminPublished-books/${adminId}`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`
            }
        }); 
        const data = await response.json();
        allBooks = data.publishedBooks;
        displayPublishedBooks(allBooks);
    } catch (error) {
        console.error('Error fetching published books:', error);
    }
}

function displayPublishedBooks(books) {
    const publishedBooksContainer = document.getElementById('publishedBooks');
    publishedBooksContainer.innerHTML = '';

    if (books.length === 0) {
        publishedBooksContainer.innerHTML = '<p>No published books found.</p>';
    } else {
        books.forEach(book => {
            const bookCard = `
                <div class="col-md-3 mb-4" style="max-width: 100%;">
                    <div class="card" style="height: 100%">
                        <img src="../../backend/publisher/routes/${book.imageDetails.path}" class="card-img-top" alt="Book Cover" style="height: 300px;">
                        <div class="card-body">
                            <h5 class="card-title">${book.book_title}</h5>
                            <p class="card-text"><b>Author: </b>${book.book_author}</p>
                            <p class="card-text"><b>Genre: </b>${book.genre}</p>
                            <p class="card-text"><b>ISBN: </b>${book.ISBN_code}</p>
                            <p class="card-text" style="height: 25%;"><b>Description: </b>${book.description}</p>
                        </div>
                        <div class="btns" style="padding: 0 15px 15px 40px;">
                            <button class="btn btn-primary" onclick="redirectToEditPage('${book.bookId}')"><i class="fas fa-edit"></i> Edit</button>
                            <button class="btn btn-danger" onclick="deleteBook('${book.bookId}')"><i class="fas fa-trash-alt"></i> Delete</button>
                        </div>
                    </div>
                </div>
            `;
            publishedBooksContainer.innerHTML += bookCard;
        });
    }
}

function redirectToEditPage(bookId) {
    window.location.href = `edit.html?id=${bookId}`;
}

async function deleteBook(bookId) {
    const confirmation = confirm('Are you sure you want to delete this book?')
    if (!confirmation) {
        return;
    }
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:3000/home/delete-book/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const data = await response.json();

        if(response.ok) {
            const deletedBookCard = document.getElementById(bookId);
            if(deletedBookCard) {
                deletedBookCard.remove();
            }

            alert(data.message);
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete the book');
    }
}
