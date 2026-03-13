import { saveData, setCurrentUser, data } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const myData = Object.fromEntries(formData.entries());

    Object.keys(myData).forEach((key) => (myData[key] = myData[key].trim()));

    if (Object.values(myData).some((e) => e == "")) {
      console.log("потрібно заповнити всі поля!");
      return;
    }

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
    setCurrentUser({ ...myData, company: {} });

    document.location.href = "my-startup.html";
  });
});
