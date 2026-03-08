import { data, setCurrentUser } from "./storage.js";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const myData = Object.fromEntries(formData.entries());

    const user = data.users.find((u) => u.email === myData.email);

    if (!user) {
      console.log("немає такого юзера!");
      return;
    }

    if (user.password !== myData.password) {
      console.log("неправильний пароль!");
      return;
    }

    setCurrentUser(user);
    document.location.href = "my-startup.html";
  });
});
