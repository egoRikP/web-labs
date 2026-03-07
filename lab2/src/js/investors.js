import { getData } from "./storage.js";

function showInvestorsData(data) {
  let investorHtmlList = document.getElementById("investor-list");

  for (let i = 0; i < data.length; i++) {
    let investorElement = document.createElement("li");
    investorElement.classList.add("investor-item");
    investorElement.innerHTML = `
            <div class="investor-header">
              <img class="investor-icon" src="../src/images/investor-icon.png" alt="Investor icon">
              <p class="investor-name">${data[i].title}</p>
            </div>

            <div class="investor-body">
              <div class="investor-check">
                <div class="investor-block-item">
                  <h4>Чек</h4>
                  <p>$${data[i].check}</p>
                </div>

                <div class="investor-block-item">
                  <h4>Бюджет</h4>
                  <p>$${data[i].budget}</p>
                </div>

                <div class="investor-block-item">
                  <h4>Середній %</h4>
                  <p>${data[i].averageCheckPercent}%</p>
                </div>
              </div>

              <div class="investor-info">
                <div class="investor-block-item">
                  <h4>Регіон</h4>
                  <p>${data[i].region[0]}</p>
                </div>

                <div class="investor-block-item">
                  <h4>Сфера</h4>
                  <p>${data[i].area[0]}</p>
                </div>
              </div>
            </div>

            <button type="button" class="button green investor-button">
              запросити
            </button>`;

    investorHtmlList.appendChild(investorElement);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  let data = await getData();
  showInvestorsData(data.investors);
});
