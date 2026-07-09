# Interactive Report Template

A template for turning written reports into interactive, visualization-first web experiences. Not a replacement for the PDF, but a different path alongside it — both formats have their reasons to exist. Here, the reader moves through the content while animated charts bring the data to life, with a special focus on the visualizations themselves. Every figure also has a PDF download button, bridging the two formats from a single source.

As a showcase, this template presents [*The Global Justice Report*](https://globaljusticeproject.wid.world/global-justice-report/) — a quantified plan for reconciling global socioeconomic equality with planetary habitability through 2100. Animated charts step through data on income and wealth inequality, decarbonization, human development, humanitarian aid, and political representation.

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) (Svelte 5, runes mode)
- [Tailwind CSS](https://tailwindcss.com/) + [daisyUI](https://daisyui.com/)
- [LayerChart](https://next.layerchart.com/) + [D3](https://d3js.org/) for charts (bar, stacked bar, grouped bar, stacked column, stacked area, line, plus a diagram panel)
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
      ChartDisplay.svelte   # sticky chart column + PDF download button
      ScrollySection.svelte # ties scroll position to chart transitions
      ScrollColumn.svelte   # scrolling text column
      DescriptionColumn.svelte
      PrintFigure.svelte    # print-only figure layout for the PDF export
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
  styles/                   # Tailwind, fonts, base styles, print styles
docs/                       # explainer notes (e.g. sticky-scroll mechanics)
static/                     # cover and og images
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

## PDF Download

Every visualization has a PDF button. Because the scrollytelling layout (sticky/fixed positioning) prints badly, the figure is mounted into a standalone print-only layout (`PrintFigure.svelte`) reusing the same chart panel components, and exported via the browser's print dialog (save as PDF).
