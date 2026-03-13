import { data, setCurrentUser } from "./storage.js";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const myData = Object.fromEntries(formData.entries());

    Object.keys(myData).forEach((key) => (myData[key] = myData[key].trim()));

    if (Object.values(myData).some((e) => e == "")) {
      console.log("потрібно заповнити всі поля!");
      return;
    }

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
