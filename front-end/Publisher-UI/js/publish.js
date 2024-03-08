document.addEventListener('DOMContentLoaded', () => {
    const publishForm = document.getElementById('publishForm');

    publishForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(publishForm);

        const authToken = localStorage.getItem('token');
    console.log('authToken', authToken);
    const bId = localStorage.getItem('bookId')
    console.log('bId', bId);
    const adminId = localStorage.getItem('adminId');
    console.log('adminId', adminId);

        try {
            const response = await fetch('http://localhost:3000/home/publish', {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'application/json',
                    'Authorization': `${authToken}`,
                    'publisherId': adminId
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                alert('Book published successfully!\nISBN: ' + data.ISBN_code);
                publishForm.reset();
            } else {
                const errorData = await response.json();
                alert('Failed to publish the book: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while publishing the book.');
        }
    });
});
