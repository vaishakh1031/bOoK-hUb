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

}
