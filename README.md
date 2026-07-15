# IDA 2030: Cliff or No Cliff? — Interactive Report

An interactive, visualization-first web version of a written report. Not a replacement for the PDF, but a different path alongside it — both formats have their reasons to exist. Here, the reader moves through the content while animated charts bring the data to life, with a special focus on the visualizations themselves. Every figure also has a PNG download button, bridging the two formats from a single source.

This edition presents *IDA 2030: Cliff or no cliff?* by Mathilde Barras, Martin Kessler, and Stephen Paduano at the [Finance for Development Lab (FDL)](https://findevlab.org). The figures step through IDA's balance-sheet growth, the declining equity share financing that growth, the disbursement outlook through 2030 (cliff or no cliff), and IDA's role as the largest source of concessional finance for the world's poorest countries. Client-facing notes — open questions from the kickoff meeting and the FDL brand guidelines — live in `docs/`.

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) (Svelte 5, runes mode)
- [Tailwind CSS](https://tailwindcss.com/) + [daisyUI](https://daisyui.com/)
- [LayerChart Next](https://next.layerchart.com/) + [D3](https://d3js.org/) for charts (bar, stacked bar, multi-series line, area variants, and a synced double panel, with annotation presets for callouts and projection bands)
- [Vite](https://vitejs.dev/)
- [Vercel Web Analytics](https://vercel.com/analytics)

## Getting Started

Requires Node `24.18.0` (see `.nvmrc`).

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build     # production build
npm run preview   # preview the production build
```

## Project Structure

```
src/
  lib/
    components/
      charts/               # one panel component per chart type
      ChartDisplay.svelte   # sticky chart column + PNG download button
      ScrollySection.svelte # ties scroll position to chart transitions
      ScrollColumn.svelte   # scrolling text column
      DescriptionColumn.svelte
      Landing.svelte        # landing / cover section
      Header.svelte
      Footer.svelte
    data/
      figures/              # one file per figure (data + configuration)
      index.js              # figure registry — figures are picked by name in +page.svelte
      annotation-presets.js # shared callout / projection-band styling
    colors.js               # single source for chart colors (ink + named series colors)
    chart-theme.js          # shared LayerChart theming (axes, ticks, tooltips, label helpers)
    scroll-animation.js     # opacity/scale curves for the scrolling figure list
  routes/                   # SvelteKit pages — +page.svelte defines the story sections
  styles/                   # Tailwind, fonts, daisyUI theme
docs/                       # client notes (kickoff meeting, FDL brand guidelines) + explainer notes
static/                     # cover and og images, FDL logo
  figures/                  # pre-made figure screenshots served by the PNG button
```

## How to Edit the Report

The story is assembled in `src/routes/+page.svelte`: a `sections` array where each entry is one chapter. Everything else — chapter IDs, anchor links, the table-of-contents dropdown in the header — is derived from that array automatically. There are two levels of change: adding a chapter (just the page) and adding a visualization (a figure file, and possibly a chart component).

### Adding a New Chapter

Add one object to the `sections` array in `src/routes/+page.svelte`:

```js
{
  title: "My New Chapter Title",
  intro: "One or two sentences introducing the chapter.",
  charts: [figures.myNewFigure],
},
```

- **`title`** becomes the chapter heading on the page *and* the label in the table-of-contents dropdown.
- **`intro`** is the paragraph under the heading (optional — leave it out for a title-only chapter).
- **`charts`** lists the figures the chapter shows, by their registry name (`figures.…`). One, several, or an empty array `[]` are all fine.

Chapter IDs (`chapter-1`, `chapter-2`, …) are assigned from the array order, so there is nothing to name or keep in sync — inserting a chapter in the middle renumbers and reorders everything automatically.

**To temporarily hide a figure:** comment out its entry in the section's `charts` array — no need to touch the figure file or the registry. Figure numbers are hardcoded per figure file, so hiding one does not renumber the others.

### Adding a New Visualization

Each figure lives in its own file in `src/lib/data/figures/` — a plain object with title, subtitle, description, source, figure number, chart `kind`, series definitions, and the data itself. Three steps:

1. **Create the figure file.** Copy an existing file in `src/lib/data/figures/` (e.g. `00-balance-sheet-total.js`) and adjust it.
2. **Register it** in `src/lib/data/index.js` — one import plus one entry in the `figures` object. The name you register is the name you use in `+page.svelte`.
3. **Add it to a chapter** via the section's `charts` array (see above).

**Data from a CSV:** put the file in `src/lib/data/figures/csv/` and load it in the figure file:

```js
import { parseFigureCsv } from "./parse-csv.js";
import csv from "./csv/my-data.csv?raw";

export default {
  // ...title, subtitle, kind, series...
  data: parseFigureCsv(csv),
};
```

The CSV needs a header row. `parse-csv.js` turns a `year` column into Dates, numeric columns into numbers, and empty cells into `null` (so lines break where a series has no observation). Small datasets can also be written inline as an array of objects instead — both are just `data` in the end.

**Chart components:** the figure's `kind` selects which chart component renders it. Available kinds, all in `src/lib/components/charts/`:

| `kind`           | Component                        |
| ---------------- | -------------------------------- |
| `"bar"`          | `BarChartPanelHorizontal.svelte` |
| `"bar-stacked"`  | `BarChartPanelStacked.svelte`    |
| `"line"`         | `LineChartPanel.svelte`          |
| `"area"`         | `AreaChartPanel.svelte`          |
| `"area-overlap"` | `AreaChartPanelOverlap.svelte`   |
| `"area-stacked"` | `AreaChartPanelStacked.svelte`   |
| `"double"`       | `DoubleChartPanel.svelte`        |

The kinds are dispatched in `ChartPanel.svelte`; the composite `"double"` kind is the exception — it is handled in `ChartDisplay.svelte` and renders two synced sub-panels (each with its own `kind`) via `DoubleChartPanel.svelte`, which reuses `ChartPanel` for the sub-panels.

If the new figure fits one of these, setting `kind` is all it takes. If it needs a genuinely new chart form (scatter, …), that chart component has to be set up first: create a new panel component in `src/lib/components/charts/` (start from the closest existing one) and add a branch for its `kind` in `ChartPanel.svelte`.

**Styling:** chart colors come from `src/lib/colors.js` — named series colors (`colors.sky`, `colors.coral`, …) plus the shared `ink` used for axis and annotation text. Shared axis/tooltip/label behavior lives in `src/lib/chart-theme.js`, and reusable annotation styling (circled callouts, hatched projection bands) in `src/lib/data/annotation-presets.js`.

### Line Chart Style: Casing at Overlaps

Line charts use the overlap treatment known from Financial Times / Economist charts: every line is drawn twice — a wider stroke in the page background color underneath ("casing"), then the colored 2.5px line on top. Where lines cross, the casing of the upper line cuts a clean gap through the one below, so intersections read as *in front of / behind* instead of a spaghetti tangle. The same casing also gives lines a clean margin where they pass over the hatched projection bands.

On top of that, lines use `curveMonotoneX` smoothing (rounds corners without ever overshooting a data value) and round joins/caps.

![Line casing at overlaps](docs/line-chart-overlap.png)

All of this lives in one place, `src/lib/components/charts/LineChartPanel.svelte`: the `lineStyle` / `casingStyle` constants and the `marks` snippet that renders the two strokes per series. Tuning knobs: casing width is `casingStyle.strokeWidth` (6.5 = 2px halo per side), and removing the `curve` property brings back straight segments while keeping the casing.

## PNG Download

Every visualization has a PNG button that downloads a pre-made screenshot from `static/figures/`. The files are named after the figure number — `figure-1.png`, `figure-2.png`, … — so when a chart changes, replace the matching screenshot in that folder. The downloaded file is automatically renamed to a descriptive slug (e.g. `figure-2-using-productivity-gains-to-reduce-work-hours.png`).

Live DOM-to-image capture was tried and abandoned: `html2canvas` cannot parse the `oklch()` colors Tailwind v4/daisyUI 5 use, and `modern-screenshot` mis-renders LayerChart's nested-`<svg>` text labels (they rely on `overflow: visible` with negative offsets, which the foreignObject clone clips/displaces — cutting off axis labels).
