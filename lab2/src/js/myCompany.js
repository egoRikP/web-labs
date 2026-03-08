import { getCurrentUserData, saveData, data } from "./storage.js";

const ui = {
  companyTitle: document.getElementById("companyTitle"),
  companyPercentage: document.getElementById("companyPercentage"),
  companyMarkets: document.getElementById("companyMarkets"),
  companyAreas: document.getElementById("companyAreas"),

  companyStrength: document.getElementById("companyStrength"),
  companyBalance: document.getElementById("companyBalance"),
  companyMonthProfit: document.getElementById("companyMonthProfit"),
  companyMonthPayment: document.getElementById("companyMonthPayment"),

  companyEmployeesCount: document.getElementById("companyEmployeesCount"),
  companyAvailablePlacesForEmployees: document.getElementById(
    "companyAvailablePlacesForEmployees",
  ),

  companyOfficesCount: document.getElementById("companyOfficesCount"),

  companyMarketsTable: document.getElementById("companyMarketsTable"),
};

function defaultUIValues() {
  ui.companyEmployeesCount.innerText = 0;
  ui.companyAvailablePlacesForEmployees.innerText = 0;
  ui.companyOfficesCount.innerText = 0;

  ui.companyTitle.innerText = "Company title...";
  ui.companyPercentage.innerText = "100%";
  ui.companyMarkets.innerText = "Ukraine";
  ui.companyAreas.innerText = "IT";

  ui.companyStrength.innerText = "0";
  ui.companyBalance.innerText = "0$";
  ui.companyMonthProfit.innerText = "0$";
  ui.companyMonthPayment.innerText = "0$";
}

function showMyMarkets(userData, markets) {
  for (let i = 0; i < userData.company.myMarkets.length; i++) {
    let marketElement = document.createElement("tr");
    marketElement.innerHTML = `
              <td>${markets[0].region[0]}</td>
              <td>${markets[0].area[0]}</td>
              <td>5%</td>
              <td>$${markets[0].budget}</td>
              <td>$${markets[0].monthPayment}</td>
              <td>$${markets[0].startSum}</td>
              <td>$${markets[0].startSum}</td>
              <td>
                <button type="button" class="button red">вийти з ринку</button>
              </td>`;
    ui.companyMarketsTable.appendChild(marketElement);
  }
}

function updateMyEmployee() {
  ui.companyEmployeesCount.innerText = `${getCurrentUserData().company.empoyees}/${getCurrentUserData().company.offices * getCurrentUserData().company.maxEmpoyeesPerOffice}`;
  ui.companyAvailablePlacesForEmployees.innerText = `${getCurrentUserData().company.offices * getCurrentUserData().company.maxEmpoyeesPerOffice - getCurrentUserData().company.empoyees}`;
}

function updateMyOffice() {
  ui.companyOfficesCount.innerText = `${getCurrentUserData().company.offices}`;
}

function addOffice() {
  getCurrentUserData().company.offices++;
  saveData();
  updateMyOffice();
  updateMyEmployee();
}

function removeOffice() {
  if (
    getCurrentUserData().company.offices > 0 &&
    getCurrentUserData().company.maxEmpoyeesPerOffice *
      getCurrentUserData().company.offices -
      getCurrentUserData().company.empoyees >=
      getCurrentUserData().company.maxEmpoyeesPerOffice
  ) {
    getCurrentUserData().company.offices--;
    saveData();
    updateMyOffice();
    updateMyEmployee();
  }
}

function addEmployee() {
  if (
    getCurrentUserData().company.empoyees <
    getCurrentUserData().company.maxEmpoyeesPerOffice *
      getCurrentUserData().company.offices
  ) {
    getCurrentUserData().company.empoyees++;
    saveData();
    updateMyEmployee();
  }
}

function removeEmployee() {
  if (getCurrentUserData().company.empoyees > 0) {
    getCurrentUserData().company.empoyees--;
    saveData();
    updateMyEmployee();
  }
}

function loadValues() {
  let myDataCompany = getCurrentUserData().company;

  ui.companyEmployeesCount.innerText = myDataCompany.empoyees;
  ui.companyAvailablePlacesForEmployees.innerText =
    myDataCompany.offices * myDataCompany.maxEmpoyeesPerOffice -
    myDataCompany.empoyees;
  ui.companyOfficesCount.innerText = myDataCompany.offices;

  ui.companyTitle.innerText = myDataCompany.title;
  ui.companyPercentage.innerText = myDataCompany.myCompanyPart;
  ui.companyMarkets.innerText = myDataCompany.region[0];
  ui.companyAreas.innerText = myDataCompany.area[0];

  ui.companyStrength.innerText = myDataCompany.empoyees + myDataCompany.offices;
  ui.companyBalance.innerText =
    myDataCompany.monthProfit - myDataCompany.monthCosts;
  ui.companyMonthProfit.innerText = myDataCompany.monthProfit;
  ui.companyMonthPayment.innerText = myDataCompany.monthCosts;

  showMyMarkets(getCurrentUserData(), data.markets);
}

document.addEventListener("DOMContentLoaded", () => {
  let user = getCurrentUserData();
  if (!user || !user.company || Object.keys(user.company).length === 0) {
    defaultUIValues();
    return;
  }

  loadValues();

  document
    .getElementById("addEmployeeButton")
    .addEventListener("click", addEmployee);

  document
    .getElementById("removeEmployeeButton")
    .addEventListener("click", removeEmployee);

  document
    .getElementById("addOfficeButton")
    .addEventListener("click", addOffice);

  document
    .getElementById("removeOfficeButton")
    .addEventListener("click", removeOffice);
});
