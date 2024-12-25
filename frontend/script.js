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
// Search and borrow books
document.getElementById("searchBooksForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = document.getElementById("searchQuery").value;

    const response = await fetch(`${API_URL}/books`);
    const books = await response.json();
    const searchResults = books.filter(book => book.title.includes(query) || book.author.includes(query));

    const searchResultsList = document.getElementById("searchResults");
    searchResultsList.innerHTML = searchResults.map(book => `
        <li class="list-group-item">
            <span>${book.title} by ${book.author}</span>
            <button class="btn btn-success btn-sm" onclick="borrowBook(${book.id})">Borrow</button>
        </li>
    `).join("");
});

// Borrow a book
async function borrowBook(bookId) {
    const userId = getUserIdFromURL(); // Extract user_id from the URL

    if (!userId || !bookId) {
        console.error("Invalid userId or bookId:", userId, bookId);
        alert("Failed to borrow book due to invalid parameters.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/borrow_book`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: parseInt(userId), book_id: parseInt(bookId) })
        });

        if (response.ok) {
            alert("Book borrowed successfully!");
            fetchUserDetails(); // Refresh user details page
        } else {
            const error = await response.json();
            console.error("Error borrowing book:", error);
            alert(`Failed to borrow book: ${error.message}`);
        }
    } catch (err) {
        console.error("Error during borrowBook API call:", err);
        alert("An unexpected error occurred.");
    }
}
