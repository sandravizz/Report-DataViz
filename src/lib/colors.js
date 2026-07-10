// Single source for every color used inside the charts. The daisyUI theme in
// src/styles/tailwind.css repeats some of these as semantic UI tokens
// (ink = base-content/primary, lavender = secondary, coral = accent,
// sky = info, sage = success).

// Axis ticks and annotation labels.
export const ink = "#2A2659";

// Series colors, named by hue. In the figures: gray de-emphasizes background
// series, sky highlights the "World" series, coral marks extremes.
export const colors = {
  sage: "#97AF98",
  coral: "#D86858",
  lavender: "#736B82",
  sky: "#61C1EB",
  gray: "#CBC1C1",
};
