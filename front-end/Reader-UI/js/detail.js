const bookId = localStorage.getItem('bookId')
console.log('bookId', bookId);
// const book = localStorage.getItem('book')
// console.log('book', book);
document.addEventListener('DOMContentLoaded', () => {
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');


fetchBookDetail(bookId);
});

async function fetchBookDetail(bookId) {
try {
    const response = await fetch(`http://localhost:3000/ratings/getBooks/${bookId}`);
    const data = await response.json();
    console.log('data', data);
    displayBookDetail(data);
} catch (error) {
    console.error('Error:', error);
    alert('Failed to fetch book detail.');
}
}

async function fetchRecentComments(bookId) {
try {
    const response = await fetch(`http://localhost:3000/ratings/recent-comments/${bookId}`)
        const data = await response.json();
        console.log('data', data);
        displayRecentComments(data);
} catch (error) {
    console.error('Error:', error);
    alert('Failed to fetch recent comments.')
}
}

function displayBookDetail(book) {
const bookDetail = document.getElementById('bookDetail');
const detailHTML = `
<div class="book-details-container" style="display: flex; padding: 5%; background-color: #f9f9f9; border: 1px solid #ccc;">
<div class="image-container">
<img src="../../backend/publisher/routes/${book.imageDetails.path}" class="card-img-top" alt="Book Cover" style="height: 500px; margin-left: 20%">
</div>
<div class="details-container" style="margin-left: 20%; padding-top: ;">
<h1 class="card-title">${book.book_title}</h1><br>
<p class="card-text"><b>Author: </b>${book.book_author}</p><br>
<p class="card-text"><b>Genre: </b>${book.genre}</p><br>
<p class="card-text"><b>Description: </b>${book.description}</p><br>
<p class="card-text"><b>ISBN: </b>${book.ISBN_code}</p><br>
<button id="commentButton" class="btn btn-primary">Leave a Comment</button>
<div id="commentSection"></div><br>
<button id="showComments" class="btn btn-primary">See Comments</button>
<div id="seeCommentSection"></div>
</div>
</div>
</div>
`;
bookDetail.innerHTML = detailHTML;

document.getElementById('commentButton').addEventListener('click', () => {
    localStorage.setItem('bookIdForComment', book.bookId)
    window.location.href = `testComment.html?id=${book.bookId}`;
});

document.getElementById('showComments').addEventListener('click', () => {
    fetchRecentComments(book.bookId);
})
}

function displayRecentComments(comments) {
const recentCommentsDiv = document.getElementById('recentComments');
let html = '<h2>Reviews & Comments</h2>';
comments.forEach(comment => {
    html += `
        <div class="details-comments-container">
            <p><b>Email: </b>${comment.email}</p>
            <p><b>Comment: </b>${comment.comment}</p>
            <p><b>Rating: </b>${displayRatingStars(comment.rating)}</p>
        </div>
    `;
});
recentCommentsDiv.innerHTML = html;
}

function displayRatingStars(rating) {
    let starsHTML = '';
    const goldStar = '&#9733;'; // Unicode for gold star
    const emptyStar = '&#x2606;'; // Unicode for empty star

    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += `<span style="color: gold;">${goldStar}</span>`; // Set color to gold for filled stars
        } else {
            starsHTML += `<span style="color: #ccc;">${emptyStar}</span>`; // Reset color for empty stars
        }
    }
    return starsHTML;
}