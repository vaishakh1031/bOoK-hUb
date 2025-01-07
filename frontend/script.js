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


}
