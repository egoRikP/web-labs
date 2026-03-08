import { saveData, setCurrentUser, data } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const myData = Object.fromEntries(formData.entries());

    if (myData.password !== myData["repeat-password"]) {
      console.log("паролі є різні!");
      return;
    }
    delete myData["repeat-password"];

    if (data.users.some((user) => user.email === myData.email)) {
      console.log("вже такий юзер є!");
      return;
    }

    data.users.push({ ...myData, company: {} });
    saveData();
    setCurrentUser(myData.email);

    document.location.href = "my-startup.html";
  });
});
