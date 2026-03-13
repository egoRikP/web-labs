import { getCurrentUserData, saveData, data } from "./storage.js";

let myCompanyData;

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

function showMyMarkets() {
  ui.companyMarketsTable.innerHTML = getCurrentUserData()
    .company.myMarkets.map(
      (id) => `
          <tr>
            <td>5%</td>
            <td>$${data.markets[id].budget}</td>
            <td>$${data.markets[id].monthPayment}</td>
            <td>$${data.markets[id].startSum}</td>
            <td>$${data.markets[id].startSum}</td>
            <td>
            <ul>
            ${market.region.map((region) => `<li>${region}</li>`).join("")}
            </ul>
              </td>
            <td>
            <ul>
            ${market.area.map((area) => `<li>${area}</li>`).join("")}
              </ul>
              </td>
            <td>
              <button data-id="${id}" type="button" class="button red leave-market-button">
                вийти з ринку
              </button>
            </td>
          </tr>
        `,
    )
    .join("");
}

function updateMyEmployee() {
  ui.companyEmployeesCount.innerText = `${getCurrentUserData().company.empoyees}/${getCurrentUserData().company.offices * getCurrentUserData().company.maxEmpoyeesPerOffice}`;
  ui.companyAvailablePlacesForEmployees.innerText = `${getCurrentUserData().company.offices * getCurrentUserData().company.maxEmpoyeesPerOffice - getCurrentUserData().company.empoyees}`;
}

function updateMyOffice() {
  ui.companyOfficesCount.innerText = `${getCurrentUserData().company.offices}`;
}

function updateMyBalance() {
  ui.companyBalance.innerText = `${getCurrentUserData().company.balance}`;
}

function updateMyStrength() {
  ui.companyStrength.innerText = myCompanyData.empoyees + myCompanyData.offices;
}

function addEmployee() {
  if (
    myCompanyData.empoyees <
      myCompanyData.maxEmpoyeesPerOffice * myCompanyData.offices &&
    myCompanyData.balance - 500 >= 0
  ) {
    myCompanyData.empoyees++;
    myCompanyData.balance -= 500;
    saveData();
    updateMyBalance();
    updateMyEmployee();
    updateMyStrength();
  }
}

function removeEmployee() {
  if (myCompanyData.empoyees > 0) {
    myCompanyData.empoyees--;
    saveData();
    updateMyBalance();
    updateMyEmployee();
    updateMyStrength();
  }
}

function addOffice() {
  if (myCompanyData.balance - 1000 >= 0) {
    myCompanyData.offices++;
    myCompanyData.balance -= 1000;
    saveData();
    updateMyOffice();
    updateMyBalance();
    updateMyEmployee();
    updateMyStrength();
  }
}

function removeOffice() {
  if (
    myCompanyData.offices > 0 &&
    myCompanyData.maxEmpoyeesPerOffice * myCompanyData.offices -
      myCompanyData.empoyees >=
      myCompanyData.maxEmpoyeesPerOffice
  ) {
    myCompanyData.offices--;
    saveData();
    updateMyOffice();
    updateMyBalance();
    updateMyEmployee();
    updateMyStrength();
  }
}

function leaveMarket(id) {
  myCompanyData.myMarkets.splice(id, 1);
  saveData();
  window.location.reload();
}

function loadValues() {
  ui.companyEmployeesCount.innerText = myCompanyData.empoyees;
  ui.companyAvailablePlacesForEmployees.innerText =
    myCompanyData.offices * myCompanyData.maxEmpoyeesPerOffice -
    myCompanyData.empoyees;
  ui.companyOfficesCount.innerText = myCompanyData.offices;

  ui.companyTitle.innerText = myCompanyData.title;
  ui.companyPercentage.innerText = myCompanyData.myCompanyPart;
  ui.companyMarkets.innerText = myCompanyData.region[0];
  ui.companyAreas.innerText = myCompanyData.area[0];

  ui.companyStrength.innerText = myCompanyData.empoyees + myCompanyData.offices;
  ui.companyBalance.innerText = myCompanyData.balance;
  ui.companyMonthProfit.innerText = myCompanyData.monthProfit;
  ui.companyMonthPayment.innerText = myCompanyData.monthCosts;
}

function nextMonth() {
  const salaryPerEmployee = 500;
  const costPerOffice = 1000;

  let totalIncome = 0;

  let totalCosts =
    myCompanyData.empoyees * salaryPerEmployee +
    myCompanyData.offices * costPerOffice;

  let myStrength = myCompanyData.empoyees + myCompanyData.offices;

  myCompanyData.myMarkets.forEach((marketIndex) => {
    let market = data.markets[marketIndex];
    if (!market) return;

    totalCosts += market.monthPayment;

    let competitorsStrength = 0;
    if (data.competitors) {
      let activeCompetitors = data.competitors.filter(
        (c) =>
          c.region.some((r) => market.region.includes(r)) &&
          c.area.some((a) => market.area.includes(a)),
      );
      competitorsStrength = activeCompetitors.reduce(
        (sum, c) => sum + (c.empoyees + c.offices),
        0,
      );
    }

    let totalMarketStrength = myStrength + competitorsStrength;
    let myMarketShare =
      totalMarketStrength > 0 ? myStrength / totalMarketStrength : 1;

    let marketMonthlyPool = market.budget * 0.05;
    totalIncome += marketMonthlyPool * myMarketShare;
  });

  myCompanyData.monthCosts = totalCosts;
  myCompanyData.monthProfit = totalIncome - totalCosts;
  myCompanyData.balance += myCompanyData.monthProfit;

  saveData();
  loadValues();
  window.location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  let user = getCurrentUserData();
  if (!user || !user.company || Object.keys(user.company).length === 0) {
    defaultUIValues();
    return;
  }

  if (
    getCurrentUserData() &&
    Object.keys(getCurrentUserData().company).length != 0
  ) {
    myCompanyData = getCurrentUserData().company;
  }

  loadValues();
  showMyMarkets();

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

  document
    .getElementById("nextMonthSimulationButton")
    .addEventListener("click", nextMonth);

  document.querySelectorAll(".leave-market-button").forEach((button) => {
    button.addEventListener("click", (e) => leaveMarket(e.target.dataset.id));
  });
});
