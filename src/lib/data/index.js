// One figure per file. To add a figure: copy an existing file in ./figures,
// adjust it, and add it here — the order of this array is the story order.
import incomeGap from "./figures/01-income-gap.js";
import workHours from "./figures/02-work-hours.js";
import genderEquality from "./figures/03-gender-equality.js";
import sectorShift from "./figures/04-sector-shift.js";
import emissionsScenarios from "./figures/05-emissions-scenarios.js";
import emissionDrivers from "./figures/06-emission-drivers.js";
import targetedSufficiency from "./figures/07-targeted-sufficiency.js";
import platformDiagram from "./figures/08-platform-diagram.js";
import worldSovereignFund from "./figures/09-world-sovereign-fund.js";
import fundVsAid from "./figures/10-fund-vs-aid.js";
import countryDividends from "./figures/11-country-dividends.js";
import educationSpending from "./figures/12-education-spending.js";
import incomeShares from "./figures/13-income-shares.js";
import bottom50Wealth from "./figures/14-bottom50-wealth.js";
import billionaireClass from "./figures/15-billionaire-class.js";
import incomeGrowth from "./figures/16-income-growth.js";
import votingRights from "./figures/17-voting-rights.js";
import northSouthTransfers from "./figures/18-north-south-transfers.js";

// Figures are picked by name in +page.svelte. Comment one out here to hide it
// everywhere — the page skips names that are missing from this map.
export const figures = {
  incomeGap,
  workHours,
  //genderEquality,
  // sectorShift,
  // emissionsScenarios,
  // emissionDrivers,
  // targetedSufficiency,
  // platformDiagram,
  // worldSovereignFund,
  // fundVsAid,
  // countryDividends,
  // educationSpending,
  incomeShares,
  //bottom50Wealth,
  //billionaireClass,
  //incomeGrowth,
  //votingRights,
  //northSouthTransfers
};

export const data = Object.values(figures);
