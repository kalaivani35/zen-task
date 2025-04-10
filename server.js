const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const session = require("express-session");

app.use(session({
  secret: "zen-secret",
  resave: false,
  saveUninitialized: true
}));

const PORT = 3000;

app.use(express.json());
app.use(express.static("public")); // frontend
// Login route
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@example.com" && password === "admin123") {
    req.session.user = email;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Logout route
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Middleware to protect pages
app.use((req, res, next) => {
  const openPages = ["/login.html", "/api/login"];
  if (req.session.user || openPages.includes(req.url) || req.url.startsWith("/css") || req.url.startsWith("/js")) {
    return next();
  }
  return res.redirect("/login.html");
});



const dbPath = path.join(__dirname, "db.json");

// Helpers to read/write database
function readDB() {
  if (!fs.existsSync(dbPath)) return { employees: [], tasks: [] };
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
function generateId() {
  return Date.now().toString();
}

// Redirect to dashboard
app.get("/", (req, res) => res.redirect("/index.html"));

/* ===== EMPLOYEES ===== */

// Get all employees
app.get("/api/employees", (req, res) => {
  const db = readDB();
  res.json(db.employees);
});

// Add new employee
app.post("/api/employees", (req, res) => {
  const db = readDB();
  const { name, email, role } = req.body;
  const id = generateId();
  db.employees.push({ id, name, email, role });
  writeDB(db);
  res.json({ message: "Employee added!" });
});

// Update employee
app.put("/api/employees/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const { name, email, role } = req.body;
  const index = db.employees.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ message: "Employee not found" });
  db.employees[index] = { id, name, email, role };
  writeDB(db);
  res.json({ message: "Employee updated!" });
});

// Delete employee
app.delete("/api/employees/:id", (req, res) => {
  const db = readDB();
  db.employees = db.employees.filter(e => e.id !== req.params.id);
  writeDB(db);
  res.json({ message: "Employee deleted!" });
});

/* ===== TASKS ===== */

// Get all tasks
app.get("/api/tasks", (req, res) => {
  const db = readDB();
  res.json(db.tasks);
});

// Add new task
app.post("/api/tasks", (req, res) => {
  const db = readDB();
  const { taskName, assignedTo } = req.body;
  const id = generateId();
  db.tasks.push({ id, taskName, assignedTo, status: "Pending" });
  writeDB(db);
  res.json({ message: "Task assigned!" });
});

// Update task (status or details)
app.put("/api/tasks/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const { taskName, assignedTo, status } = req.body;
  const index = db.tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: "Task not found" });
  db.tasks[index] = { id, taskName, assignedTo, status };
  writeDB(db);
  res.json({ message: "Task updated!" });
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => {
  const db = readDB();
  db.tasks = db.tasks.filter(t => t.id !== req.params.id);
  writeDB(db);
  res.json({ message: "Task deleted!" });
});

/* ===== STATS (for dashboard) ===== */
app.get("/api/stats", (req, res) => {
  const db = readDB();
  const totalEmployees = db.employees.length;
  const completedTasks = db.tasks.filter(t => t.status === "Completed").length;
  const pendingTasks = db.tasks.length - completedTasks;
  res.json({ totalEmployees, completedTasks, pendingTasks });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
