const API_URL = 'http://127.0.0.1:5000';

document.getElementById('addBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;

    try {
        const response = await fetch(`${API_URL}/add_book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author })
        });

        console.log("Response status:", response.status); // Log response status

        if (response.ok) {
            const result = await response.json();
            console.log("Book added:", result); // Log result
            alert('Book added successfully!');
            document.getElementById('addBookForm').reset();
        } else {
            throw new Error('Failed to add book.');
        }
    } catch (error) {
        console.error('Error adding book:', error);
        alert('An error occurred while adding the book.');
    }
});

document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchQuery').value;

    const response = await fetch(`${API_URL}/search_books?query=${query}`);
    const results = await response.json();

    const resultsList = document.getElementById('searchResults');
    resultsList.innerHTML = '';
    results.forEach((book) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${book.title} by ${book.author}`;
        resultsList.appendChild(li);
    });
});
// Return a book
async function returnBook(userId, bookId) {
    if (!userId || !bookId) {
        console.error("Invalid userId or bookId:", userId, bookId);
        alert("Failed to return book due to invalid parameters.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/return_book`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: parseInt(userId), book_id: parseInt(bookId) })
        });

        if (response.ok) {
            alert("Book returned successfully!");
            fetchUserDetails(); // Refresh user details page
        } else {
            const error = await response.json();
            console.error("Error returning book:", error);
            alert(`Failed to return book: ${error.message}`);
        }
    } catch (err) {
        console.error("Error during returnBook API call:", err);
        alert("An unexpected error occurred.");
    }
}
