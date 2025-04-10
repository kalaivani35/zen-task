// Simulated data
document.getElementById('employeeCount').innerText = 5;
// Fetch real-time stats from backend
fetch("/api/stats")
  .then(res => res.json())
  .then(data => {
    document.getElementById("employeeCount").innerText = data.totalEmployees;
    document.getElementById("ongoingTasks").innerText = data.pendingTasks;
    document.getElementById("completedTasks").innerText = data.completedTasks;
  });
