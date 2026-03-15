import { getCurrentUserData, data } from "./storage.js";

export function hasControl() {
  const user = getCurrentUserData();
  const { myCompanyPart, investors } = user.company;

  const maxInvestorShare = Math.max(
    ...investors.map(
      (id) => data.investors.find((inv) => inv.id === id).averageCheckPercent,
    ),
  );
  return myCompanyPart >= maxInvestorShare;
}

export function makeCompanyChange(callback) {
  if (hasControl()) {
    callback?.();
  }
}
