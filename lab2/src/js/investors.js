import { data, getCurrentUserData, saveData } from "./storage.js";

let investorList = data.investors;

function showInvestorsData(data) {
  let investorHtmlList = document.getElementById("investor-list");

  //   якщо є компанія показувати фільтровані для неї
  if (
    getCurrentUserData() &&
    Object.keys(getCurrentUserData().company).length != 0
  ) {
    investorList = data.filter(
      (investor) =>
        getCurrentUserData().company.area.some((e) =>
          investor.area.includes(e),
        ) &&
        getCurrentUserData().company.region.some((e) =>
          investor.region.includes(e),
        ),
    );
  }

  investorHtmlList.innerHTML = investorList
    .map(
      (investor, index) => `
        <li class="investor-item">
            <div class="investor-header">
              <img class="investor-icon" src="../src/images/investor-icon.png" alt="Investor icon">
              <p class="investor-name">${investor.title}</p>
            </div>

            <div class="investor-body">
              <div class="investor-check">
                <div class="investor-block-item">
                  <h4>Чек</h4>
                  <p>$${investor.check}</p>
                </div>

                <div class="investor-block-item">
                  <h4>Бюджет</h4>
                  <p>$${investor.budget}</p>
                </div>

                <div class="investor-block-item">
                  <h4>Середній %</h4>
                  <p>${investor.averageCheckPercent}%</p>
                </div>
              </div>

              <div class="investor-info">
                <div class="investor-block-item">
                  <h4>Регіон</h4>
                  <p>${investor.region[0]}</p>
                </div>

                <div class="investor-block-item">
                  <h4>Сфера</h4>
                  <p>${investor.area[0]}</p>
                </div>
              </div>
            </div>

            <button type="button" data-id="${index}" class="button green investor-button">
              запросити
            </button>
        </li>`,
    )
    .join("");
}

function takeInvestor(id) {
  let numId = parseInt(id);
  if (isNaN(numId)) {
    return;
  }

  let targetInvestor = investorList[numId];

  if (
    targetInvestor.averageCheckPercent >
    getCurrentUserData().company.myCompanyPart
  ) {
    // мейбі модалку що нехватає процетів компанії
    return;
  }

  getCurrentUserData().company.balance += targetInvestor.check;
  getCurrentUserData().company.myCompanyPart -=
    targetInvestor.averageCheckPercent;
  targetInvestor.budget -= targetInvestor.check;

  saveData();

  //   нормально зробити а не просто релоадити... треба пройтись по айдішниках і шукати його і міняти в html без релоаду...
  window.location.reload();
}

document.addEventListener("DOMContentLoaded", async () => {
  showInvestorsData(data.investors);

  if (
    !getCurrentUserData() ||
    Object.keys(getCurrentUserData().company).length == 0
  ) {
    return;
  }

  document.querySelectorAll(".investor-button").forEach((button) => {
    button.addEventListener("click", (e) => takeInvestor(e.target.dataset.id));
  });
});
