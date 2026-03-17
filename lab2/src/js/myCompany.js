import { getCurrentUserData, saveData, data } from "./storage.js";
import { makeCompanyChange } from "./userControl.js";

let currentUser, myCompany;

const ui = {
  title: document.getElementById("companyTitle"),
  percentage: document.getElementById("companyPercentage"),
  markets: document.getElementById("companyMarkets"),
  areas: document.getElementById("companyAreas"),
  strength: document.getElementById("companyStrength"),
  balance: document.getElementById("companyBalance"),
  monthProfit: document.getElementById("companyMonthProfit"),
  monthPayment: document.getElementById("companyMonthPayment"),
  employeesCount: document.getElementById("companyEmployeesCount"),
  availablePlaces: document.getElementById(
    "companyAvailablePlacesForEmployees",
  ),
  officesCount: document.getElementById("companyOfficesCount"),
  marketsTable: document.getElementById("companyMarketsTable"),
  investorsTable:
    document.getElementById("companyInvestors") ||
    document.createElement("tbody"),
};

function defaultUIValues() {
  ui.employeesCount.innerText = "0";
  ui.availablePlaces.innerText = "0";
  ui.officesCount.innerText = "0";
  ui.title.innerText = "Company title...";
  ui.percentage.innerText = "100%";
  ui.markets.innerText = "Ukraine";
  ui.areas.innerText = "IT";
  ui.strength.innerText = "0";
  ui.balance.innerText = "0$";
  ui.monthProfit.innerText = "0$";
  ui.monthPayment.innerText = "0$";
}

function updateUI() {
  if (!myCompany) {
    return;
  }

  const {
    empoyees,
    offices,
    maxEmpoyeesPerOffice,
    balance,
    monthProfit,
    monthCosts,
    title,
    myCompanyPart,
    region,
    area,
  } = myCompany;
  const strength = empoyees + offices;
  const maxEmployees = offices * maxEmpoyeesPerOffice;

  ui.employeesCount.innerText = `${empoyees}/${maxEmployees}`;
  ui.availablePlaces.innerText = maxEmployees - empoyees;
  ui.officesCount.innerText = offices;

  ui.title.innerText = title;
  ui.percentage.innerText = myCompanyPart;
  ui.markets.innerHTML = renderList(region);
  ui.areas.innerHTML = renderList(area);

  ui.strength.innerText = strength;
  ui.balance.innerText = `$${balance.toLocaleString()}`;
  ui.monthProfit.innerText = `$${monthProfit}`;
  ui.monthPayment.innerText = `$${monthCosts}`;

  renderChart();
  showMyMarkets();
  showMyInvestors();
}

const renderList = (arr) =>
  `<ul>${arr?.map((i) => `<li>${i}</li>`).join("") || ""}</ul>`;

function showMyMarkets() {
  ui.marketsTable.innerHTML = myCompany.myMarkets
    .map((id) => {
      let market = data.markets.find((market) => market.id === id);
      let share = getMyMarketShare(id);

      return `
      <tr>
        <td>${renderList(market.region)}</td>
        <td>${renderList(market.area)}</td>
        <td>${share}%</td> 
        <td>$${market.budget}</td>
        <td>$${market.monthPayment}</td>
        <td>$${market.startSum}</td>
        <td>$${market.startSum}</td>
        <td><button data-id="${id}" type="button" class="button red leave-market-button">вийти з ринку</button></td>
      </tr>
    `;
    })
    .join("");
}

function showMyInvestors() {
  ui.investorsTable.innerHTML = myCompany.investors
    .map((id) => {
      let inv = data.investors.find((investor) => investor.id == id);
      let shareValue = myCompany.balance * (inv.averageCheckPercent / 100);

      return `
      <tr>
        <td>${inv.title}</td>
        <td>${renderList(inv.region)}</td>
        <td>${renderList(inv.area)}</td>
        <td>${inv.averageCheckPercent}%</td>
        <td>$${inv.check}</td>
        <td>$${shareValue.toFixed(2)}</td>
      </tr>
    `;
    })
    .join("");
}

function getValidCompetitors() {
  return data.users.filter(
    (c) => c !== currentUser && c.company && Object.keys(c.company).length > 0,
  );
}

function getMyMarketShare(marketIndex) {
  let myStrength = myCompany.empoyees + myCompany.offices;
  let competitorsStrength = getValidCompetitors()
    .filter((c) => c.company.myMarkets?.includes(marketIndex))
    .reduce((sum, c) => sum + (c.company.empoyees + c.company.offices), 0);

  let totalStrength = myStrength + competitorsStrength;
  return totalStrength > 0
    ? ((myStrength / totalStrength) * 100).toFixed(1)
    : 100;
}

function nextMonth() {
  let totalIncome = 0;
  let myStrength = myCompany.empoyees + myCompany.offices;
  let validCompetitors = getValidCompetitors();

  myCompany.myMarkets.forEach((marketIndex) => {
    let market = data.markets.find((market) => market.id === marketIndex);
    if (!market) return;

    let competitorsStrength = validCompetitors
      .filter((c) => c.company.myMarkets?.includes(marketIndex))

      .reduce((sum, c) => sum + (c.company.empoyees + c.company.offices), 0);

    let totalStrength = myStrength + competitorsStrength;
    let myShare = totalStrength > 0 ? myStrength / totalStrength : 1;

    const penetrationRate = Math.min(0.001 + myStrength * 0.0005, 0.05);
    totalIncome += Math.round((market.budget / 12) * penetrationRate * myShare);
  });

  myCompany.monthProfit = totalIncome;
  myCompany.balance += totalIncome - myCompany.monthCosts;

  myCompany.myMarkets.forEach((marketIndex) => {
    let market = data.markets.find((market) => market.id === marketIndex);

    const growth = Math.random() * 0.1 - 0.03; // від -3% до +7%
    market.budget = Math.round(market.budget * (1 + growth));
  });

  myCompany.monthHistory.push({
    balance: myCompany.balance,
    costs: myCompany.monthCosts,
    profit: totalIncome,
  });

  saveAndUpdate();
}

function saveAndUpdate() {
  saveData();
  updateUI();
}

function addEmployee() {
  if (
    myCompany.empoyees < myCompany.maxEmpoyeesPerOffice * myCompany.offices &&
    myCompany.balance >= 500
  ) {
    myCompany.empoyees++;
    myCompany.balance -= 500;
    myCompany.monthCosts += 500;
    saveAndUpdate();
  }
}

function removeEmployee() {
  if (myCompany.empoyees > 0) {
    myCompany.empoyees--;
    myCompany.monthCosts = Math.max(0, myCompany.monthCosts - 500);
    saveAndUpdate();
  }
}

function addOffice() {
  if (myCompany.balance >= 1000) {
    myCompany.offices++;
    myCompany.balance -= 1000;
    myCompany.monthCosts += 500;
    saveAndUpdate();
  }
}

function removeOffice() {
  if (
    myCompany.offices > 0 &&
    myCompany.offices * myCompany.maxEmpoyeesPerOffice - myCompany.empoyees >=
      myCompany.maxEmpoyeesPerOffice
  ) {
    myCompany.offices--;
    myCompany.monthCosts = Math.max(0, myCompany.monthCosts - 500);
    saveAndUpdate();
  }
}

function leaveMarket(id) {
  const numId = parseInt(id);
  const index = myCompany.myMarkets.indexOf(numId);
  if (index !== -1) {
    myCompany.myMarkets.splice(index, 1);

    let market = data.markets.find((market) => market.id === numId);
    myCompany.monthCosts -= market.monthPayment;

    saveData();
    showMyMarkets();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  currentUser = getCurrentUserData();

  if (!currentUser?.company || Object.keys(currentUser.company).length === 0) {
    defaultUIValues();
    return;
  }

  myCompany = currentUser.company;

  updateUI();

  ui.marketsTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("leave-market-button")) {
      makeCompanyChange(() => leaveMarket(e.target.dataset.id));
    }
  });

  document
    .getElementById("addEmployeeButton")
    .addEventListener("click", () => makeCompanyChange(addEmployee));
  document
    .getElementById("removeEmployeeButton")
    .addEventListener("click", () => makeCompanyChange(removeEmployee));
  document
    .getElementById("addOfficeButton")
    .addEventListener("click", () => makeCompanyChange(addOffice));
  document
    .getElementById("removeOfficeButton")
    .addEventListener("click", () => makeCompanyChange(removeOffice));
  document
    .getElementById("nextMonthSimulationButton")
    .addEventListener("click", () => makeCompanyChange(nextMonth));
});

let balanceChart = null;

function renderChart() {
  const ctx = document.getElementById("balanceChart");
  if (!ctx) return;

  const history = myCompany.monthHistory || [];
  const labels = history.map((_, i) => `Міс. ${i + 1}`);
  const realBalance = history.map((m) => m.balance);
  const modelBalance = history.map((m) => m.balance + m.costs); // без витрат

  if (balanceChart) {
    balanceChart.data.labels = labels;
    balanceChart.data.datasets[0].data = realBalance;
    balanceChart.data.datasets[1].data = modelBalance;
    balanceChart.update();
    return;
  }

  balanceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Реальний баланс",
          data: realBalance,
          borderColor: "#1A794B",
          backgroundColor: "rgba(50, 199, 72, 0.1)",
          fill: true,
          tension: 0.3,
        },
        {
          label: "Без витрат (модель)",
          data: modelBalance,
          borderColor: "#aaa",
          borderDash: [5, 5],
          fill: false,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { ticks: { callback: (val) => `$${val.toLocaleString()}` } },
      },
    },
  });
}
