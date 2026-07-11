# Interactive Report Template

A template for turning written reports into interactive, visualization-first web experiences. Not a replacement for the PDF, but a different path alongside it — both formats have their reasons to exist. Here, the reader moves through the content while animated charts bring the data to life, with a special focus on the visualizations themselves. Every figure also has a PNG download button, bridging the two formats from a single source.

As a showcase, this template presents a small selection of figures from [*The Global Justice Report*](https://globaljusticeproject.wid.world/global-justice-report/) — a quantified plan for reconciling global socioeconomic equality with planetary habitability through 2100. It is not the complete report, just a few of its charts used to demonstrate the format: animated figures stepping through data on income and wealth inequality, decarbonization, and human development.

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) (Svelte 5, runes mode)
- [Tailwind CSS](https://tailwindcss.com/) + [daisyUI](https://daisyui.com/)
- [LayerChart Next](https://next.layerchart.com/) + [D3](https://d3js.org/) for charts (horizontal bar and multi-series line, with annotation presets for callouts and projection bands)
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
docs/                       # explainer notes (sticky-scroll mechanics, upstream bug reports)
static/                     # cover and og images
  figures/                  # pre-made figure screenshots served by the PNG button
```

## Working with Figures

Each figure lives in its own file in `src/lib/data/figures/` — a plain object with title, subtitle, description, source, figure number, chart `kind` (`"bar"` or `"line"`), and the data itself (inline, or parsed from a CSV in `figures/csv/` via `parse-csv.js`). All figures are registered by name in `src/lib/data/index.js`; the story itself is assembled in `src/routes/+page.svelte`, where each section (title + intro text) lists the figures it shows in its `charts` array.

**To add a figure:** copy an existing file in `src/lib/data/figures/`, adjust it, register it in `index.js`, and add it to a section's `charts` in `+page.svelte`.

**To temporarily hide a figure:** comment out its entry in the section's `charts` array in `+page.svelte` — no need to touch the figure file or the registry. Figure numbers are hardcoded per figure file, so hiding one does not renumber the others.

Chart colors come from `src/lib/colors.js` — named series colors (`colors.sky`, `colors.coral`, …) plus the shared `ink` used for axis and annotation text. Shared axis/tooltip/label behavior lives in `src/lib/chart-theme.js`, and reusable annotation styling (circled callouts, hatched projection bands) in `src/lib/data/annotation-presets.js`.

## PNG Download

Every visualization has a PNG button that downloads a pre-made screenshot from `static/figures/`. The files are named after the figure number — `figure-1.png`, `figure-2.png`, `figure-13.png` so when a chart changes, replace the matching screenshot in that folder. The downloaded file is automatically renamed to a descriptive slug (e.g. `figure-2-using-productivity-gains-to-reduce-work-hours.png`).

Live DOM-to-image capture was tried and abandoned: `html2canvas` cannot parse the `oklch()` colors Tailwind v4/daisyUI 5 use, and `modern-screenshot` mis-renders LayerChart's nested-`<svg>` text labels (they rely on `overflow: visible` with negative offsets, which the foreignObject clone clips/displaces — cutting off axis labels).
