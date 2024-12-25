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
// Initialize user details page
if (window.location.pathname.includes("user_details.html")) {
    fetchUserDetails();
}
// Fetch user records for librarian
async function fetchUserRecords() {
    const response = await fetch(`${API_URL}/user_records`);
    const userRecords = await response.json();

    const userRecordList = document.getElementById("userRecordList");
    userRecordList.innerHTML = userRecords.map(record => `
        <tr>
            <td>${record.name}</td>
            <td>
                ${record.borrowed_books.length > 0
                    ? record.borrowed_books.map(book => `<span>${book.title}</span>`).join(", ")
                    : "No books borrowed"
                }
            </td>
        </tr>
    `).join("");
}

// Initialize librarian page
if (window.location.pathname.includes("librarian.html")) {
    fetchBooks();
    fetchUserRecords();
}
