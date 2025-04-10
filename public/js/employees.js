function fetchEmployees() {
  fetch("/api/employees")
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("employeeList");
      table.innerHTML = "";
      data.forEach(emp => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${emp.name}</td>
          <td>${emp.email}</td>
          <td>${emp.role}</td>
          <td>
            <button onclick="editEmployee('${emp.id}', '${emp.name}', '${emp.email}', '${emp.role}')">Edit</button>
            <button onclick="deleteEmployee('${emp.id}')">Delete</button>
          </td>`;
        table.appendChild(row);
      });
    });
}

function addEmployee(e) {
  e.preventDefault();
  const name = document.getElementById("empName").value;
  const email = document.getElementById("empEmail").value;
  const role = document.getElementById("empRole").value;

  fetch("/api/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, role })
  })
    .then(res => res.json())
    .then(() => {
      fetchEmployees();
      e.target.reset();
    });
}

function deleteEmployee(id) {
  if (!confirm("Are you sure?")) return;
  fetch(`/api/employees/${id}`, { method: "DELETE" })
    .then(() => fetchEmployees());
}

function editEmployee(id, oldName, oldEmail, oldRole) {
  const name = prompt("Edit Name:", oldName);
  const email = prompt("Edit Email:", oldEmail);
  const role = prompt("Edit Role:", oldRole);
  if (!name || !email || !role) return;

  fetch(`/api/employees/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, role })
  })
    .then(() => fetchEmployees());
}

window.onload = fetchEmployees;
