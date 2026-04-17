// Elements
const loadBtn = document.getElementById("loadBtn");
const refreshBtn = document.getElementById("refreshBtn");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const usersContainer = document.getElementById("usersContainer");
const searchInput = document.getElementById("searchInput");

// State
let users = [];

// Fetch users
async function fetchUsers() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
}

// Create user card
function createUserCard(user) {
    const card = document.createElement("div");
    card.className = "user-card";

    card.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Company:</strong> ${user.company.name}</p>
        <p><strong>City:</strong> ${user.address.city}</p>
    `;

    return card;
}

// Render users
function renderUsers(userList) {
    usersContainer.innerHTML = "";

    userList.forEach(user => {
        const card = createUserCard(user);
        usersContainer.appendChild(card);
    });
}

// Load users (main button)
loadBtn.addEventListener("click", async () => {

    errorDiv.classList.add("hidden");
    usersContainer.innerHTML = "";

    loadingDiv.classList.remove("hidden");
    loadBtn.disabled = true;
    loadBtn.textContent = "Loading...";

    try {
        users = await fetchUsers();
        renderUsers(users);
        refreshBtn.disabled = false; // enable refresh

    } catch (error) {
        errorDiv.textContent = "Error: Could not load users. Please try again.";
        errorDiv.classList.remove("hidden");
        console.log(error);

    } finally {
        loadingDiv.classList.add("hidden");
        loadBtn.disabled = false;
        loadBtn.textContent = "Load Users";
    }
});

// Refresh users (NEW FEATURE)
async function refreshUsers() {

    loadingDiv.classList.remove("hidden");
    errorDiv.classList.add("hidden");

    try {
        users = await fetchUsers();
        renderUsers(users);

    } catch (error) {
        errorDiv.textContent = "Error: Could not refresh users.";
        errorDiv.classList.remove("hidden");
        console.log(error);

    } finally {
        loadingDiv.classList.add("hidden");
    }
}

// Refresh button event
refreshBtn.addEventListener("click", refreshUsers);

// Search feature
searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm)
    );

    renderUsers(filtered);
});