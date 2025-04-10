function fetchTasks() {
  fetch("/api/tasks")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("taskList");
      list.innerHTML = "";
      data.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
          <b>${task.taskName}</b> → ${task.assignedTo}
          [${task.status}]
          <button onclick="toggleStatus('${task.id}', '${task.status}')">
            Mark ${task.status === "Pending" ? "Completed" : "Pending"}
          </button>
          <button onclick="deleteTask('${task.id}')">Delete</button>`;
        list.appendChild(li);
      });
    });
}

function assignTask(e) {
  e.preventDefault();
  const taskName = document.getElementById("taskName").value;
  const assignedTo = document.getElementById("assignedTo").value;

  fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskName, assignedTo })
  })
    .then(res => res.json())
    .then(() => {
      fetchTasks();
      e.target.reset();
    });
}

function toggleStatus(id, currentStatus) {
  const status = currentStatus === "Pending" ? "Completed" : "Pending";
  fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
    .then(() => fetchTasks());
}

function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  fetch(`/api/tasks/${id}`, { method: "DELETE" })
    .then(() => fetchTasks());
}

window.onload = fetchTasks;
