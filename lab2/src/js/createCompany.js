import {
  getCurrentUserData,
  setCurrentUser,
  saveData,
  data,
} from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("startup-form");

  let areaSelectList = document.getElementById("field-form");
  for (let i = 0; i < data.area.length; i++) {
    let element = document.createElement("option");
    element.innerText = data.area[i];
    element.value = data.area[i];
    areaSelectList.appendChild(element);
  }

  let regioSelectList = document.getElementById("region-form");
  for (let i = 0; i < data.region.length; i++) {
    let element = document.createElement("option");
    element.innerText = data.region[i];
    element.value = data.region[i];
    regioSelectList.appendChild(element);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const myData = Object.fromEntries(formData.entries());

    let field = [];
    let fieldSelector = document.getElementById("field-form");
    for (let i = 0; i < fieldSelector.options.length; i++) {
      if (fieldSelector.options[i].selected) {
        field.push(fieldSelector.options[i].value);
      }
    }

    let region = [];
    let regionSelector = document.getElementById("region-form");
    for (let i = 0; i < regionSelector.options.length; i++) {
      if (regionSelector.options[i].selected) {
        region.push(regionSelector.options[i].value);
      }
    }

    console.log(field);
    console.log(region);
    console.log(data.users);

    getCurrentUserData().company = {
      title: myData.company,
      area: field,
      description: myData.description,
      region: region,
      offices: 0,
      maxEmpoyeesPerOffice: 5,
      empoyees: 0,
      myCompanyPart: 100,
      monthProfit: 0,
      monthCosts: 0,
      balance: 0,
      myMarkets: [],
    };

    setCurrentUser(getCurrentUserData());
    saveData();
    document.location.href = "my-startup.html";
  });
});
