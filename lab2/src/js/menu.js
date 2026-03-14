const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

const authDivs = document.querySelectorAll(".auth, .auth-only, .guest-only");

burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  nav.classList.toggle("open");
  authDivs.forEach((el) => el.classList.toggle("open"));
});
