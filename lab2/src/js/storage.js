import { loadJson } from "./api.js";

export let data = null;

export async function getData() {
  if (data) {
    return data;
  }

  let stored = localStorage.getItem("data");

  if (!stored) {
    data = await loadJson();
    localStorage.setItem("data", JSON.stringify(data));
  } else {
    data = JSON.parse(stored);
  }

  return data;
}

export function saveData() {
  localStorage.setItem("data", JSON.stringify(data));
  let currentUser = getCurrentUserData();
  if (currentUser) {
    setCurrentUser(currentUser);
  }
}

export function getCurrentUser() {
  let user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    return user.email;
  }
}

export function getCurrentUserData() {
  if (!data || !data.users) return null;

  return data.users.find((u) => u.email === getCurrentUser());
}

export function setCurrentUser(data) {
  localStorage.setItem("user", JSON.stringify(data));
}

await getData();
