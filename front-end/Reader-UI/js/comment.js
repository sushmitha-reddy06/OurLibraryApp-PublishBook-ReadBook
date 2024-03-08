// document.addEventListener('DOMContentLoaded', async() => {
//     const emailInput = document.getElementById('email');

//     const userEmail = localStorage.getItem('email');
//     if (userEmail) {
//       emailInput.value = userEmail;
//     }
//   })

//   document.getElementById('commentForm').addEventListener('submit', async function(event) {
//     event.preventDefault();

//     const token = localStorage.getItem('token');
//     const storedEmail = localStorage.getItem('email')

//     const comment = document.getElementById('comment').value;
//     const rating = document.getElementById('rating').value;

//     document.addEventListener('DOMContentLoaded', () => {
//           const urlParams = new URLSearchParams(window.location.search);
//           const bookId = urlParams.get('id');
//           // localStorage.setItem('bookId', bookId);
//       });

//     async function fetchBookDetail() {
//       const bookIdForComment=localStorage.getItem('bookIdForComment');
//       console.log('bookIdForComment', bookIdForComment);
//     try {
//       const response = await fetch(`http://localhost:3000/ratings/comment/${bookIdForComment}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': token
//         },
//         body: JSON.stringify({ email: storedEmail, comment, rating })
//       });

//       const data = await response.json();
//       console.log('data', data);
//       document.getElementById('message').innerHTML = `<div class="alert alert-success" role="alert">${data.message}</div>`;
//       document.getElementById('commentForm').reset(); // Reset form after successful submission
//     } catch (error) {
//       console.error('Error:', error);
//       document.getElementById('message').innerHTML = `<div class="alert alert-danger" role="alert">Error: ${error}</div>`;
//     }
//   }
//   fetchBookDetail(bookId);
//   });

document.addEventListener('DOMContentLoaded', async () => {
  const emailInput = document.getElementById('email');
  const userEmail = localStorage.getItem('email');
  if (userEmail) {
      emailInput.value = userEmail;
  }
});

document.getElementById('commentForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const token = localStorage.getItem('token');
  const storedEmail = localStorage.getItem('email');
  
  const comment = document.getElementById('comment').value;
  const rating = document.getElementById('rating').value;

  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');
  
  try {
      const response = await fetch(`http://localhost:3000/ratings/comment/${bookId}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': token
          },
          body: JSON.stringify({ email: storedEmail, comment, rating })
      });

      const data = await response.json();
      console.log('data', data);
      document.getElementById('message').innerHTML = `<div class="alert alert-success" role="alert">${data.message}</div>`;
      document.getElementById('commentForm').reset(); // Reset form after successful submission
  } catch (error) {
      console.error('Error:', error);
      document.getElementById('message').innerHTML = `<div class="alert alert-danger" role="alert">Error: ${error}</div>`;
  }
});
