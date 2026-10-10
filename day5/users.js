const loadUsersBtn = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusP = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

let allUsers = [];

async function loadUsers() {
  loadUsersBtn.disabled = true;
  statusP.textContent = "Loading users...";
  usersList.innerHTML = "";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    allUsers = await response.json();
    statusP.textContent = `Successfully loaded ${allUsers.length} users.`;
    renderUsers(allUsers);
  } catch (error) {
    console.error("Failed to load users:", error);
    statusP.textContent = "Failed to load users. Please try again later.";
  } finally {
    loadUsersBtn.disabled = false;
  }
}

function renderUsers(usersToRender) {
  usersList.innerHTML = "";

  if (allUsers.length > 0 && usersToRender.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.textContent = "No users match your filter.";
    emptyLi.style.color = "#6b7280";
    emptyLi.style.fontStyle = "italic";
    usersList.appendChild(emptyLi);
    return;
  }

  usersToRender.forEach((user) => {
    const li = document.createElement("li");
    li.style.border = "1px solid #eee";
    li.style.padding = "12px";
    li.style.borderRadius = "8px";
    li.style.marginBottom = "8px";
    li.style.background = "#fffdf5";

    const nameEl = document.createElement("h3");
    nameEl.textContent = user.name;
    nameEl.style.margin = "0 0 4px 0";

    const detailsEl = document.createElement("p");
    detailsEl.style.margin = "0";
    detailsEl.style.fontSize = "0.9rem";
    detailsEl.style.color = "#4b5563";
    detailsEl.textContent = `Email: ${user.email} | City: ${user.address.city} | Company: ${user.company.name}`;

    li.append(nameEl, detailsEl);
    usersList.appendChild(li);
  });
}

filterInput.addEventListener("input", () => {
  const query = filterInput.value.trim().toLowerCase();
  const filtered = allUsers.filter((user) =>
    user.name.toLowerCase().includes(query)
  );
  renderUsers(filtered);
});

loadUsersBtn.addEventListener("click", loadUsers);
