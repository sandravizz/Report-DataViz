# Interactive Report Template

A template for turning written reports into interactive, visualization-first web experiences. Not a replacement for the PDF, but a different path alongside it — both formats have their reasons to exist. Here, the reader moves through the content while animated charts bring the data to life, with a special focus on the visualizations themselves. Every figure also has a PNG download button, bridging the two formats from a single source.

As a showcase, this template presents a small selection of figures from [*The Global Justice Report*](https://globaljusticeproject.wid.world/global-justice-report/) — a quantified plan for reconciling global socioeconomic equality with planetary habitability through 2100. It is not the complete report, just a few of its charts used to demonstrate the format: animated figures stepping through data on income and wealth inequality, decarbonization, and human development.

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) (Svelte 5, runes mode)
- [Tailwind CSS](https://tailwindcss.com/) + [daisyUI](https://daisyui.com/)
- [LayerChart Next](https://next.layerchart.com/) + [D3](https://d3js.org/) for charts (bar, stacked bar, grouped bar, stacked column, stacked area, line, plus a diagram panel)
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
      index.js              # figure registry — array order is the story order
      annotation-presets.js
    colors.js               # shared chart color palette
    chart-theme.js          # shared LayerChart theming
    scroll-animation.js
  routes/                   # SvelteKit pages
  styles/                   # Tailwind, fonts, base styles
docs/                       # explainer notes (e.g. sticky-scroll mechanics)
static/                     # cover and og images
  figures/                  # pre-made figure screenshots served by the PNG button
```

## Working with Figures

Each figure lives in its own file in `src/lib/data/figures/` — a plain object with title, subtitle, description, source, figure number, chart `kind`, and the data itself. All figures are registered in `src/lib/data/index.js`, and the order of that array is the order they appear in the story.

**To add a figure:** copy an existing file in `src/lib/data/figures/`, adjust it, and add it to the array in `index.js`.

**To temporarily hide a figure:** comment out its line in the `data` array in `index.js` — no need to touch the figure file or its import:

```js
export const data = [
  incomeGap,
  // workHours,   ← hidden, remove the // to reactivate
  genderEquality,
  ...
];
```

Figure numbers are hardcoded per figure file, so hiding one does not renumber the others.

## PNG Download

Every visualization has a PNG button that downloads a pre-made screenshot from `static/figures/`. The files are named after the figure number — `figure-1.png`, `figure-2.png`, `figure-13.png` — so when a chart changes, replace the matching screenshot in that folder. The downloaded file is automatically renamed to a descriptive slug (e.g. `figure-2-using-productivity-gains-to-reduce-work-hours.png`).

Live DOM-to-image capture was tried and abandoned: `html2canvas` cannot parse the `oklch()` colors Tailwind v4/daisyUI 5 use, and `modern-screenshot` mis-renders LayerChart's nested-`<svg>` text labels (they rely on `overflow: visible` with negative offsets, which the foreignObject clone clips/displaces — cutting off axis labels).
