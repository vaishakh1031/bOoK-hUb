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



    }
}
