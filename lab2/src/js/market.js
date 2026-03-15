import { data, getCurrentUserData, saveData } from "./storage.js";
import { makeCompanyChange } from "./userControl.js";

let result = data.markets;

// якщо є перетин ринку
function getCompetitorShare(competitorCompany) {
  let compStrength = competitorCompany.empoyees + competitorCompany.offices;

  let totalMarketStrength = data.users
    .filter((c) => c.company && Object.keys(c.company).length !== 0)
    .filter((c) => {
      let isSameArea = c.company.area?.some((a) =>
        competitorCompany.area?.includes(a),
      );
      let isSameRegion = c.company.region?.some((r) =>
        competitorCompany.region?.includes(r),
      );
      return isSameArea && isSameRegion;
    })
    .reduce((sum, c) => sum + (c.company.empoyees + c.company.offices), 0);

  return totalMarketStrength > 0
    ? +((compStrength / totalMarketStrength) * 100).toFixed(1)
    : 0;
}

function showMarketData() {
  let marketHtmlList = document.getElementById("market-list");

  if (
    getCurrentUserData() &&
    Object.keys(getCurrentUserData().company).length != 0
  ) {
    result = result.filter(
      (investor) =>
        getCurrentUserData().company.area.some((e) =>
          investor.area.includes(e),
        ) &&
        getCurrentUserData().company.region.some((e) =>
          investor.region.includes(e),
        ),
    );
  }

  marketHtmlList.innerHTML = result
    .map(
      (market) => `
  <li class="card-item">
    <div class="card-row grid-2">
                <div class="icon-text">
                  <img src="../src/images/region-icon.png" alt="Region" />
                  <div>
                    <span class="label">Ринок</span>
                    <p class="value">
                    ${market.region
                      .map(
                        (region) => `<ul>
                        <li>${region}</li>
                    </ul>`,
                      )
                      .join("")}
                    </p>
                  </div>
                </div>
                <div class="icon-text">
                  <img src="../src/images/field-icon.png" alt="Field" />
                  <div>
                    <span class="label">Сфера</span>
                    <p class="value">${market.area
                      .map(
                        (area) => `<ul>
                        <li>${area}</li>
                    </ul>`,
                      )
                      .join("")}</p>
                  </div>
                </div>
              </div>

              <div class="card-row grid-2">
                <div class="stat-block">
                  <h4 class="label">Місткість</h4>
                  <p class="green">$${market.budget}</p>
                </div>
                <div class="stat-block">
                  <h4 class="label">Вхідний поріг</h4>
                  <p class="green">$${market.startSum}</p>
                </div>
                <div class="stat-block">
                  <h4 class="label">Оплата/міс.</h4>
                  <p class="green">$${market.monthPayment}</p>
                </div>
                <div class="stat-block">
                  <h4 class="label">Конкуренція</h4>
                  <p class="green">висока</p>
                </div>
              </div>

${
  getCurrentUserData() &&
  getCurrentUserData().company.myMarkets?.includes(market.id)
    ? `<button type="button" data-id="${market.id}" class="button no-active full-width market-button">
              вже на ринку
            </button>`
    : `<button type="button" data-id="${market.id}" class="button green-btn full-width market-button">
              увійти
            </button>`
}
    
  </li>`,
    )
    .join("");
}

function showCompetitorsData(data) {
  let competitorHtmlList = document.getElementById("competitor-list");

  competitorHtmlList.innerHTML = data
    .filter((competitor) => Object.keys(competitor.company).length !== 0)
    .map((competitor) => {
      let share = getCompetitorShare(competitor.company);

      return `<li class="card-item">
    <div class="competitor-header">
                    <div class="logo-box">
                      <img
                        src="../src/images/technova-logo.png"
                        alt="TechNova Logo"
                      />
                    </div>
                    <h3 class="competitor-name">${competitor.company.title}</h3>
                  </div>
    
                  <div class="card-row grid-2">
                    <div class="stat-block">
                      <h4 class="label">Частка ринку</h4>
                      <p class="green">${share}%</p>
                    </div>
                    <div class="stat-block">
                      <h4 class="label">прибуток</h4>
                      <p class="green">$${competitor.company.monthProfit - competitor.company.monthCosts}</p>
                    </div>
                    <div class="stat-block">
                      <h4 class="label">працівників</h4>
                      <p class="value">${competitor.company.empoyees}</p>
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
                        <p class="value">
                            <ul>
                                ${competitor.company.region
                                  .map((region) => `<li>${region}</li>`)
                                  .join("")}
                            </ul>
                        </p>
                      </div>
                    </div>
                    <div class="icon-text">
                      <img src="../src/images/field-icon.png" alt="Field" />
                      <div>
                        <span class="label">Сфера</span>
                        <p class="value">
                        <ul>
                            ${competitor.company.area
                              .map((area) => `<li>${area}</li>`)
                              .join("")}
                          </ul>
                          </p>
                      </div>
                    </div>
                  </div>
      </li>`;
    })
    .join("");
}

function takeMarket(id) {
  let numId = parseInt(id);
  if (isNaN(numId)) {
    return;
  }

  let targetMarket = data.markets.find((market) => market.id == numId);

  if (getCurrentUserData().company.myMarkets.includes(numId)) {
    return;
  }

  if (
    targetMarket.averageCheckPercent >
      getCurrentUserData().company.myCompanyPart ||
    getCurrentUserData().company.balance - targetMarket.startSum < 0
  ) {
    // мейбі модалку що нехватає процетів
    return;
  }

  getCurrentUserData().company.balance -= targetMarket.startSum;
  getCurrentUserData().company.monthCosts += targetMarket.monthPayment;
  getCurrentUserData().company.myMarkets.push(numId);
  saveData();

  window.location.reload();
  //   нормально зробити а не просто релоадити... треба пройтись по айдішниках і шукати його і міняти в html без релоаду...
}

document.addEventListener("DOMContentLoaded", async () => {
  showMarketData();
  showCompetitorsData(data.users);

  let user = getCurrentUserData();
  if (!user || !user.company || Object.keys(user.company).length === 0) {
    return;
  }

  document.querySelectorAll(".market-button").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      makeCompanyChange(takeMarket(e.target.dataset.id)),
    );
  });
});
