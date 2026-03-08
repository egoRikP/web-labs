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
}

export function getCurrentUser() {
  return localStorage.getItem("user");
}

export function getCurrentUserData() {
  return data.users.find((u) => u.email === getCurrentUser());
}

export function setCurrentUser(email) {
  localStorage.setItem("user", email);
}

await getData();
