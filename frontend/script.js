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
// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("userList")) {
        fetchUsers();
    }
    if (document.getElementById("bookList")) {
        fetchBooks();
    }
});
function getUserIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("user_id");
}
// Fetch and display user details
async function fetchUserDetails() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user_id");

    const userResponse = await fetch(`${API_URL}/user/${userId}`);
    const user = await userResponse.json();

    document.getElementById("userName").textContent = user.name;

    // Populate borrowed books
    const borrowedBooks = document.getElementById("borrowedBooks");
    borrowedBooks.innerHTML = user.borrowed_books.map(book => `
        <li class="list-group-item">
            <span>${book.title} by ${book.author}</span>
            <button class="btn btn-danger btn-sm" onclick="returnBook(${user.id}, ${book.id})">Return</button>
        </li>
    `).join("");

    // Fetch and populate overdue books
    const overdueResponse = await fetch(`${API_URL}/overdue_books/${user.id}`);
    const overdueBooks = await overdueResponse.json();
    const overdueBooksList = document.getElementById("overdueBooks");
    overdueBooksList.innerHTML = overdueBooks.length > 0
        ? overdueBooks.map(book => `<li class="list-group-item">${book.title} (Due Date: ${book.due_date})</li>`).join("")
        : `<li class="list-group-item">No overdue books</li>`;
}
