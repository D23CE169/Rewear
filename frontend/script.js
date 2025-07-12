function openModal() {
  document.getElementById("authModal").style.display = "block";
}

function closeModal() {
  document.getElementById("authModal").style.display = "none";
}

function showLogin() {
  document.getElementById("loginForm").style.display = "flex";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginTab").classList.add("active");
  document.getElementById("registerTab").classList.remove("active");
}

function showRegister() {
  document.getElementById("registerForm").style.display = "flex";
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerTab").classList.add("active");
  document.getElementById("loginTab").classList.remove("active");
}

async function login() {
  const email = document.querySelector('#loginForm input[type="email"]').value;
  const password = document.querySelector('#loginForm input[type="password"]').value;

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token); // ✅ Store token in browser
      alert("Logged in successfully!");
      closeModal();
    } else {
      alert(data.error || "Login failed.");
    }
  } catch (error) {
    console.error('Login error:', error);
    alert("An error occurred during login.");
  }
}

async function register() {
  const name = document.querySelector('#registerForm input[placeholder="Name"]').value.trim();
  const email = document.querySelector('#registerForm input[placeholder="Email"]').value.trim();
  const password = document.querySelector('#registerForm input[placeholder="Password"]').value;
  const contact = document.querySelector('#registerForm input[placeholder="Contact"]').value.trim();
  const address = document.querySelector('#registerForm input[placeholder="Address"]').value.trim();

  if (!name || !email || !password || !contact || !address) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        contact,
        address
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Registered successfully!");
      closeModal();
    } else {
      alert("❌ Error: " + (data.message || data.error));
    }
  } catch (err) {
    alert("❌ Registration failed. Try again.");
    console.error(err);
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  alert('Logged out!');
  window.location.reload();
}