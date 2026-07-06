import { palette } from "$lib/colors";
import { circleCallout } from "../annotation-presets.js";

export default {
  title: "Sufficiency & Energy Transition Are Complementary",
  subtitle:
    "Projected Cumulative Emissions & Temperature of Core Scenarios, 2026–2100",
  description:
    "In order to reduce GHG emissions and keep warming below 2°, both socioeconomic sufficiency and energy system transformation play an indispensable and complementary role. The figure shows projected cumulative emissions and temperature rise of the core scenarios, where Persistent Inequality and Productivist Convergence come with Slow Decarbonization and Sustainable Convergence with Fast Decarbonization.",
  source: "Sources & series: gjp.wid.world (F5)",
  number: "Figure 5",
  kind: "stacked-column",
  xKey: "scenario",
  series: [
    { key: "CO2", value: "co2", color: "#2E86B5" },
    { key: "Other GHG", value: "otherGhg", color: palette[5] },
  ],
  annotations: [
    circleCallout({
      x: "Sustainable Convergence (1.8°C)",
      y: 1076,
      r: 6,
      label: "Only pathway below 2°C",
      labelPlacement: "top",
      labelYOffset: 14,
      mobile: {
        props: { label: { truncate: false, width: 100 } },
      },
    }),
  ],
  data: [
    { scenario: "Persistent Inequality (4.8°C)", co2: 5285, otherGhg: 2006 },
    { scenario: "Productivist Convergence (4.9°C)", co2: 5374, otherGhg: 2087 },
    { scenario: "Sufficiency Only (3.3°C)", co2: 2471, otherGhg: 1154 },
    { scenario: "Sustainable Convergence (1.8°C)", co2: 371, otherGhg: 705 },
  ],
};
