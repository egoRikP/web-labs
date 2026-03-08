let user = localStorage.getItem("user");

if (user) {
  document.body.classList.add("logged-in");

  let userData = JSON.parse(user);

  if (userData.company && Object.keys(userData.company).length !== 0) {
    document.body.classList.add("has-company");
  }

  if (
    window.location.pathname.includes("register.html") ||
    window.location.pathname.includes("login.html")
  ) {
    window.location.href = "my-startup.html";
  }
}

if (!user) {
  if (window.location.pathname.includes("create-startup.html")) {
    window.location.href = "register.html";
  }
}

function logout() {
  localStorage.removeItem(`user`);
  window.location.reload();
}
