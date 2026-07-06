import { palette } from "$lib/colors";
import { circleCallout, projectionRange } from "../annotation-presets.js";

export default {
  title: "The Rise of the Bottom 50%",
  subtitle: "World Bottom 50% Wealth Share by Region, 1800–2100",
  description:
    "According to the Global Justice Platform, the share of the bottom 50% wealth holders in total personal wealth is projected to increase from 2% in 2025 to 30% in 2100. The country composition in 2100 follows the regional shares in global population in 2100 because average wealth and wealth distributions equalize between countries.",
  source:
    "Sources & series: gjp.wid.world (F14)",
  number: "Figure 14",
  kind: "stacked-area",
  xKey: "year",
  valueSuffix: "%",
  series: [
    { key: "Europe", value: "europe", color: palette[3] },
    { key: "North America/Oceania", value: "northAmericaOceania", color: palette[4] },
    { key: "Latin America", value: "latinAmerica", color: palette[6] },
    { key: "Middle East/North Africa", value: "middleEastNorthAfrica", color: palette[1] },
    { key: "Sub-Saharan Africa", value: "subSaharanAfrica", color: palette[5] },
    { key: "Russia/Central Asia", value: "russiaCentralAsia", color: palette[9] },
    { key: "East Asia", value: "eastAsia", color: palette[0] },
    { key: "South/South-East Asia", value: "southSoutheastAsia", color: palette[2] },
  ],
  rangeAnnotations: [
    projectionRange({ x: [new Date(2025, 0, 1), new Date(2100, 0, 1)] }),
  ],
  annotations: [
    circleCallout({
      x: new Date(2025, 0, 1),
      y: 2,
      label: "Only 2% of world wealth in 2025",
      labelPlacement: "top-left",
      labelXOffset: 10,
      labelYOffset: 16,
      labelProps: { textAnchor: "end" },
    }),
    circleCallout({
      x: new Date(2100, 0, 1),
      y: 30,
      label: "30% by 2100",
      labelPlacement: "left",
      labelXOffset: 14,
      labelProps: { textAnchor: "end", verticalAnchor: "middle" },
    }),
  ],
  data: [
    { year: new Date(1800, 0, 1), europe: 0.3, northAmericaOceania: 0.05, latinAmerica: 0.15, middleEastNorthAfrica: 0.3, subSaharanAfrica: 0.6, russiaCentralAsia: 0.3, eastAsia: 1.6, southSoutheastAsia: 2.2 },
    { year: new Date(1850, 0, 1), europe: 0.25, northAmericaOceania: 0.05, latinAmerica: 0.15, middleEastNorthAfrica: 0.25, subSaharanAfrica: 0.5, russiaCentralAsia: 0.25, eastAsia: 1.3, southSoutheastAsia: 1.75 },
    { year: new Date(1900, 0, 1), europe: 0.2, northAmericaOceania: 0.1, latinAmerica: 0.1, middleEastNorthAfrica: 0.2, subSaharanAfrica: 0.4, russiaCentralAsia: 0.2, eastAsia: 1, southSoutheastAsia: 1.3 },
    { year: new Date(1920, 0, 1), europe: 0.2, northAmericaOceania: 0.1, latinAmerica: 0.1, middleEastNorthAfrica: 0.2, subSaharanAfrica: 0.35, russiaCentralAsia: 0.15, eastAsia: 0.9, southSoutheastAsia: 1.2 },
    { year: new Date(1940, 0, 1), europe: 0.15, northAmericaOceania: 0.1, latinAmerica: 0.1, middleEastNorthAfrica: 0.15, subSaharanAfrica: 0.3, russiaCentralAsia: 0.1, eastAsia: 0.7, southSoutheastAsia: 0.9 },
    { year: new Date(1960, 0, 1), europe: 0.1, northAmericaOceania: 0.05, latinAmerica: 0.05, middleEastNorthAfrica: 0.1, subSaharanAfrica: 0.15, russiaCentralAsia: 0.05, eastAsia: 0.3, southSoutheastAsia: 0.4 },
    { year: new Date(1980, 0, 1), europe: 0.1, northAmericaOceania: 0.05, latinAmerica: 0.05, middleEastNorthAfrica: 0.1, subSaharanAfrica: 0.15, russiaCentralAsia: 0.05, eastAsia: 0.25, southSoutheastAsia: 0.35 },
    { year: new Date(2000, 0, 1), europe: 0.1, northAmericaOceania: 0.05, latinAmerica: 0.1, middleEastNorthAfrica: 0.1, subSaharanAfrica: 0.15, russiaCentralAsia: 0.05, eastAsia: 0.3, southSoutheastAsia: 0.45 },
    { year: new Date(2010, 0, 1), europe: 0.05, northAmericaOceania: 0.05, latinAmerica: 0.05, middleEastNorthAfrica: 0.1, subSaharanAfrica: 0.1, russiaCentralAsia: 0.05, eastAsia: 0.2, southSoutheastAsia: 0.3 },
    { year: new Date(2025, 0, 1), europe: 0.15, northAmericaOceania: 0.1, latinAmerica: 0.1, middleEastNorthAfrica: 0.15, subSaharanAfrica: 0.3, russiaCentralAsia: 0.05, eastAsia: 0.45, southSoutheastAsia: 0.7 },
    { year: new Date(2030, 0, 1), europe: 0.2, northAmericaOceania: 0.15, latinAmerica: 0.2, middleEastNorthAfrica: 0.3, subSaharanAfrica: 0.7, russiaCentralAsia: 0.1, eastAsia: 0.8, southSoutheastAsia: 1.4 },
    { year: new Date(2040, 0, 1), europe: 0.5, northAmericaOceania: 0.4, latinAmerica: 0.6, middleEastNorthAfrica: 0.9, subSaharanAfrica: 2.6, russiaCentralAsia: 0.2, eastAsia: 1.5, southSoutheastAsia: 3.3 },
    { year: new Date(2050, 0, 1), europe: 0.8, northAmericaOceania: 0.7, latinAmerica: 1, middleEastNorthAfrica: 1.5, subSaharanAfrica: 4.8, russiaCentralAsia: 0.3, eastAsia: 2.2, southSoutheastAsia: 5.7 },
    { year: new Date(2060, 0, 1), europe: 1, northAmericaOceania: 0.85, latinAmerica: 1.3, middleEastNorthAfrica: 1.9, subSaharanAfrica: 6.5, russiaCentralAsia: 0.35, eastAsia: 2.6, southSoutheastAsia: 7 },
    { year: new Date(2080, 0, 1), europe: 1.1, northAmericaOceania: 1, latinAmerica: 1.6, middleEastNorthAfrica: 2.4, subSaharanAfrica: 8.9, russiaCentralAsia: 0.45, eastAsia: 2.9, southSoutheastAsia: 8.4 },
    { year: new Date(2100, 0, 1), europe: 1.2, northAmericaOceania: 1.1, latinAmerica: 1.8, middleEastNorthAfrica: 2.8, subSaharanAfrica: 10.5, russiaCentralAsia: 0.5, eastAsia: 3, southSoutheastAsia: 9.1 },
  ],
};
