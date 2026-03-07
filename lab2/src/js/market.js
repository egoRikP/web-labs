import { getData } from "./storage.js";

function showMarketData(data) {
  let marketHtmlList = document.getElementById("market-list");

  for (let i = 0; i < data.length; i++) {
    let marketItem = document.createElement("li");
    marketItem.classList.add("card-item");
    marketItem.innerHTML = `
              <div class="card-row grid-2">
                <div class="icon-text">
                  <img src="../src/images/region-icon.png" alt="Region" />
                  <div>
                    <span class="label">Ринок</span>
                    <p class="value">${data[i].region[0]}</p>
                  </div>
                </div>
                <div class="icon-text">
                  <img src="../src/images/field-icon.png" alt="Field" />
                  <div>
                    <span class="label">Сфера</span>
                    <p class="value">${data[i].area[0]}</p>
                  </div>
                </div>
              </div>

              <div class="card-row grid-2">
                <div class="stat-block">
                  <h4 class="label">Місткість</h4>
                  <p class="green">$${data[i].budget}</p>
                </div>
                <div class="stat-block">
                  <h4 class="label">Вхідний поріг</h4>
                  <p class="green">$${data[i].startSum}</p>
                </div>
                <div class="stat-block">
                  <h4 class="label">Оплата/міс.</h4>
                  <p class="green">$${data[i].monthPayment}</p>
                </div>
                <div class="stat-block">
                  <h4 class="label">Конкуренція</h4>
                  <p class="green">висока</p>
                </div>
              </div>

              <button type="button" class="button green-btn full-width">
                увійти
              </button>`;

    marketHtmlList.appendChild(marketItem);
  }
}

function showCompetitorsData(data) {
  let competitorHtmlList = document.getElementById("competitor-list");

  for (let i = 0; i < data.length; i++) {
    // конкурент ще не зробив компанію
    if (Object.keys(data[i].company).length == 0) {
      continue;
    }

    let competitorItem = document.createElement("li");
    competitorItem.classList.add("card-item");
    competitorItem.innerHTML = `
                  <div class="competitor-header">
                  <div class="logo-box">
                    <img
                      src="../src/images/technova-logo.png"
                      alt="TechNova Logo"
                    />
                  </div>
                  <h3 class="competitor-name">${data[i].company.title}</h3>
                </div>

                <div class="card-row grid-2">
                  <div class="stat-block">
                    <h4 class="label">Частка ринку</h4>
                    <p class="green">10%</p>
                  </div>
                  <div class="stat-block">
                    <h4 class="label">прибуток</h4>
                    <p class="green">$${data[i].company.monthProfit - data[i].company.monthCosts}</p>
                  </div>
                  <div class="stat-block">
                    <h4 class="label">працівників</h4>
                    <p class="value">${data[i].company.empoyees}</p>
                  </div>
                  <div class="stat-block">
                    <h4 class="label">дохід</h4>
                    <p class="green">$3M</p>
                  </div>
                </div>

                <div class="card-row grid-2">
                  <div class="icon-text">
                    <img src="../src/images/region-icon.png" alt="Region" />
                    <div>
                      <span class="label">Ринки</span>
                      <p class="value">${data[i].company.region[0]}</p>
                    </div>
                  </div>
                  <div class="icon-text">
                    <img src="../src/images/field-icon.png" alt="Field" />
                    <div>
                      <span class="label">Сфера</span>
                      <p class="value">${data[i].company.area[0]}</p>
                    </div>
                  </div>
                </div>`;
    competitorHtmlList.appendChild(competitorItem);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  let data = await getData();
  showMarketData(data.markets);
  showCompetitorsData(data.users);
});
