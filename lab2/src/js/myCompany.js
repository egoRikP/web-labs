import { getCurrentUserData, saveData, data } from "./storage.js";

function showMyMarkets(userData, markets) {
  if (
    Object.keys(userData.company).length == 0 ||
    userData.company.myMarkets.length == 0
  ) {
    return;
  }

  let myMarkeyHtmlList = document.getElementById("myMarkets");

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
    myMarkeyHtmlList.appendChild(marketElement);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (getCurrentUser() != null) {
    let data = await getData();
    showMyMarkets(getCurrentUserData(), data);
  }
});
