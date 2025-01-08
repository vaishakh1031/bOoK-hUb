const API_URL = "http://127.0.0.1:5000";

/** USER FUNCTIONALITIES **/

// Fetch users
async function fetchUsers() {
    const response = await fetch(`${API_URL}/users`);
    const users = await response.json(); // Fetch and define `users`

    const userList = document.getElementById("userList");
    userList.innerHTML = users.length > 0
        ? users.map(user => `
            <li class="list-group-item">
                <span>${user.name}</span>
                <a href="user_details.html?user_id=${user.id}" class="btn btn-link">View</a>
            </li>
          `).join("")
        : "<li class='list-group-item'>No users found</li>";
}

// Initialize on page load
fetchUsers();


// Add a user
document.getElementById("addUserForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("userName").value;

    const response = await fetch(`${API_URL}/add_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    });

    if (response.ok) {
        alert("User added successfully!");
        fetchUsers();
    } else {
        alert("Failed to add user.");
    }
});

// View user details
async function viewUser(userId) {
    const response = await fetch(`${API_URL}/users`);
    const users = await response.json();
    const user = users.find(user => user.id === userId);

    
}

/** LIBRARIAN FUNCTIONALITIES **/

// Fetch books
async function fetchBooks() {
    const response = await fetch(`${API_URL}/books`);
    const books = await response.json();
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";
    books.forEach(book => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerHTML = `
            <span>${book.title} by ${book.author}</span>
            <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Delete</button>
        `;
        bookList.appendChild(li);
    });
}

// Add a book
document.getElementById("addBookForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("bookTitle").value;
    const author = document.getElementById("bookAuthor").value;

    const response = await fetch(`${API_URL}/add_book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author })
    });

    if (response.ok) {
        alert("Book added successfully!");
        fetchBooks();
    } else {
        alert("Failed to add book.");
    }
});

// Delete a book
async function deleteBook(bookId) {
    const response = await fetch(`${API_URL}/delete_book`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookId })
    });

    if (response.ok) {
        alert("Book deleted successfully!");
        fetchBooks();
    } else {
        alert("Failed to delete book.");
    }
}

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
