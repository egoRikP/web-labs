import {
  getCurrentUserData,
  setCurrentUser,
  saveData,
  data,
} from "./storage.js";

function fromDataToSelectOptions(elementId, data) {
  let selectList = document.getElementById(elementId);
  for (let i = 0; i < data.length; i++) {
    let element = document.createElement("option");
    element.innerText = data[i];
    element.value = data[i];
    selectList.appendChild(element);
  }
}

function getSelectedAsArray(elementId) {
  let arrayResult = [];
  let selector = document.getElementById(elementId);
  for (let i = 0; i < selector.options.length; i++) {
    if (selector.options[i].selected) {
      arrayResult.push(selector.options[i].value);
    }
  }
  return arrayResult;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("startup-form");

  fromDataToSelectOptions("field-form", data.area);
  fromDataToSelectOptions("region-form", data.region);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const myData = Object.fromEntries(formData.entries());

    let field = getSelectedAsArray("field-form");
    let region = getSelectedAsArray("region-form");

    Object.keys(myData).forEach((key) => (myData[key] = myData[key].trim()));

    if (Object.values(myData).some((e) => e == "")) {
      console.log("потрібно заповнити всі поля!");
      return;
    }

    console.log(field);
    console.log(region);

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
      investors: [],
    };

    setCurrentUser(getCurrentUserData());
    saveData();
    document.location.href = "my-startup.html";
  });
});
