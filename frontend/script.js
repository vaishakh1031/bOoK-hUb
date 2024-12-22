const API_URL = 'http://127.0.0.1:5000'; // Adjust as needed for backend URL

// Add a Book
document.getElementById('addBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    const response = await fetch(`${API_URL}/add_book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, isbn })
    });

    if (response.ok) {
        alert('Book added successfully!');
        document.getElementById('addBookForm').reset();
    } else {
        alert('Failed to add book.');
    }
});

// Search Books
document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchQuery').value;

    const response = await fetch(`${API_URL}/search_book?query=${query}`);
    const results = await response.json();

    const resultsList = document.getElementById('searchResults');
    resultsList.innerHTML = '';
    results.forEach((book) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <span><strong>${book.b_title}</strong> by ${book.b_author} (ISBN: ${book.b_isbn})</span>
            <button class="btn btn-success btn-sm" onclick="borrowBook(${book.b_no})">Borrow</button>
        `;
        resultsList.appendChild(li);
    });
});

// Borrow Book
async function borrowBook(bookId) {
    const borrower = prompt("Enter your name to borrow this book:");
    if (!borrower) return;

    const response = await fetch(`${API_URL}/borrow_book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ b_no: bookId, borrower })
    });

    if (response.ok) {
        alert('Book borrowed successfully!');
    } else {
        alert('Failed to borrow book.');
    }
}
