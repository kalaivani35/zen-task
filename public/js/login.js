function login(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Login failed");
      })
      .then(() => {
        window.location.href = "/index.html";
      })
      .catch(err => {
        alert("Invalid login!");
      });
  }
  