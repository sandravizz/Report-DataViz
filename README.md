# Interactive Report Template

A template for interactive, visualization-first reports on the web. The reader scrolls through the story while animated charts step through the data — the visualizations carry the report, the text guides the way. Every figure also comes with a PNG download, so the same charts can be reused in static formats (print, PDF, slides) from a single source.

As a showcase, this template presents a small selection of figures from [*The Global Justice Report*](https://globaljusticeproject.wid.world/global-justice-report/) — a quantified plan for reconciling global socioeconomic equality with planetary habitability through 2100. It is not the complete report, just a few of its charts used to demonstrate the format: animated figures stepping through data on income and wealth inequality, decarbonization, and human development.

## The Branch Model

`main` is the living template: it keeps evolving, and every improvement lands here first. A delivered report is frozen on its own branch (`iw`, `kiel-institute`, `findevlab`, …), each with its own Vercel project and link; `template` is the SandraViz portfolio version. Branches are copies, not imports — components are duplicated per branch, so a shared improvement is applied branch by branch. Anything reusable is therefore written up as a portable doc in `docs/` that travels with the change. The settled cross-branch rules live in [`docs/house-style.md`](docs/house-style.md).

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) (Svelte 5, runes mode)
- [Tailwind CSS](https://tailwindcss.com/) + [daisyUI](https://daisyui.com/)
- [LayerChart Next](https://next.layerchart.com/) + [D3](https://d3js.org/) for charts
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
      Landing.svelte          # cover
      Header.svelte           # cover-level header + Table of Contents dropdown
      ChapterRail.svelte      # left dot rail, desktop only
      CursorDot.svelte        # accent dot cursor, cover only
      ScrollySection.svelte   # the pinned figure surface + its scroll budget
      ChartDisplay.svelte     # figure chrome: eyebrow, progress rail, title
      DescriptionColumn.svelte # interpretation text (lg+), modal below
      FigureFooter.svelte     # source, PNG download, wordmark
      Footer.svelte
      charts/                 # ChartPanel dispatch + bar/line panels
    data/
      figures/                # one file per figure (data + configuration)
      figures/csv/            # CSV sources, read via parse-csv.js
      annotation-presets.js   # circled callouts, hatched projection bands
      index.js                # figure registry
    colors.js                 # single source for chart colors
    chart-theme.js            # shared chart theming (axes, ticks, tooltips)
    format.js                 # number formatting (thousands separators)
    utils/                    # figure PNG export
  routes/                     # +page.svelte assembles the story sections
  styles/                     # Tailwind, fonts, daisyUI theme
static/                       # cover photo, logos, share image
docs/                         # portable explainers, see below
```

## Reading Experience

**Text is as tall as its text; figures are exactly one screen.** A chapter block is never padded to fill the viewport — it is as tall as its own paragraphs. Only the figure surface pins (`ScrollySection.svelte`), and a multi-step figure spends its pinned scroll advancing one step at a time. The whole scrolly system keys to a single breakpoint, `lg` (1024px).

Navigation is two views of the same chapter list: the dot rail in the left gutter (desktop only, chapters as dots, figures nested in the hover panel) and the Table of Contents dropdown in the header. They must stay identical — see [`docs/chapter-nav-states.md`](docs/chapter-nav-states.md).

Each figure carries a reading-progress rail above its title, showing how far through a multi-step figure the reader is. Below `lg` the interpretation text moves out of the description column into a modal behind a button in the figure eyebrow. Over the cover only, the system pointer is replaced by the accent dot cursor.

## Working with Figures

Each figure lives in its own file in `src/lib/data/figures/` — a plain object with title, subtitle, description, source, figure number, chart `kind` (`"bar-horizontal"` or `"line"`), and the data itself (inline, or parsed from a CSV in `figures/csv/` via `parse-csv.js`). All figures are registered by name in `src/lib/data/index.js`; the story itself is assembled in `src/routes/+page.svelte`, where each section (title + intro text) lists the figures it shows in its `charts` array.

**To add a figure:** copy an existing file in `src/lib/data/figures/`, adjust it, register it in `index.js`, and add it to a section's `charts` in `+page.svelte`.

**Multi-step figures** export an array instead of a single object — one entry per step, spread from a shared `base` and numbered `Figure 13a` / `13b` / `13c` (see `13-income-shares.js`). Each step varies only what changes: which series are drawn, the title, the description, any annotations. The figure eyebrow shows the shared prefix (`Figure 13`) rather than cycling the letter, since the progress rail already carries the position.

**To temporarily hide a figure:** comment out its entry in the section's `charts` array in `+page.svelte` — no need to touch the figure file or the registry. Figure numbers are hardcoded per figure file, so hiding one does not renumber the others.

Chart colors come from `src/lib/colors.js`, and series are named by the **job they do**, never by hue: `colors.negative` (the outcome the report argues against), `colors.middle` (the aggregate or middle case), `colors.positive` (the outcome it argues for), plus `quiet` / `quietLine` for unemphasized bars and lines. Reference tones — `ink` for axis and callout text, `nameInk` for category labels, `mutedTextGray`, `gridLine` — live in the same file. The accent green is deliberately absent from it, so no data series can pick it up. Shared axis/tooltip/label behavior lives in `src/lib/chart-theme.js`, reusable annotation styling in `src/lib/data/annotation-presets.js`, and thousands grouping in `src/lib/format.js`, so axis labels, value labels, tooltips and hand-written copy all group numbers the same way.

## PNG Download

Every visualization has a PNG button that renders the figure live, so the export always matches what is on screen — there is nothing to regenerate when a chart changes. `src/lib/utils/downloadFigure.js` finds the LayerChart roots inside the figure, serializes each one's SVG, rasterizes it at retina scale, and composites the result onto a canvas together with the figure number, progress rail, title, subtitle, source, legend (redrawn, since it is DOM rather than part of the chart SVG), and the `sandraviz.com` wordmark. The file is named from a slug of the figure number and title (e.g. `figure-2-using-productivity-gains-to-reduce-work-hours.png`).

Generic DOM-to-image libraries were tried first and abandoned, which is why the export goes through LayerChart's own SVG serialization instead: `html2canvas` cannot parse the `oklch()` colors Tailwind v4/daisyUI 5 use, and `modern-screenshot` mis-renders LayerChart's nested-`<svg>` text labels (they rely on `overflow: visible` with negative offsets, which the foreignObject clone clips/displaces — cutting off axis labels).

## Docs

`docs/` holds the portable explainers — each written so it can travel with its mechanism to another report branch.

| Doc | What it covers |
| --- | --- |
| [`house-style.md`](docs/house-style.md) | The rules every branch shares: branch model, layout rhythm, surfaces, chrome |
| [`sticky-scroll-explainer.md`](docs/sticky-scroll-explainer.md) | Why figures pin, how long they stay pinned, how steps are paced |
| [`scrolly-line-draw-in.md`](docs/scrolly-line-draw-in.md) | Lines drawing themselves in when a figure first comes into view |
| [`line-chart-casing.md`](docs/line-chart-casing.md) | FT-style casing at line overlaps, and why draw order matters |
| [`chapter-nav-states.md`](docs/chapter-nav-states.md) | Dot states and row tone, shared by the rail and the TOC dropdown |
| [`figure-footer-controls.md`](docs/figure-footer-controls.md) | Making the report's buttons and links read as clickable |
| [`cursor-dot.md`](docs/cursor-dot.md) | The accent cursor, and why it is scoped to the cover |
| [`tooltip-mobile-freeze-bug.md`](docs/tooltip-mobile-freeze-bug.md) | Upstream LayerChart bug: tooltip freezing on touch scroll |
