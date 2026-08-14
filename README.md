# Interactive Report Template

A template for interactive, visualization-first reports on the web. The reader scrolls through the story while animated charts step through the data — the visualizations carry the report, the text guides the way. Not a replacement for the PDF, but a different path alongside it: every figure also comes with a PNG download, so the same charts can be reused in static formats from a single source.

This branch carries the SandraViz house brand (IBM Plex Sans, warm near-black on white, burnt orange accent — see `docs/sandraviz-brand.md`). Each client report lives on its own branch, rebranded and with its own content.

The demo content is a small selection of figures from the IEA's [*Ensuring a Skilled Renewable Energy and Energy Efficiency Workforce*](https://www.iea.org/reports/ensuring-a-skilled-renewable-energy-and-energy-efficiency-workforce) (2026, CC BY 4.0) — enough to exercise every chart kind the template ships with. The figures are illustrative of the format, not a reproduction of the report.

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
    components/         # scrolly layout, header/footer, chapter rail
      charts/           # one panel per chart kind, behind ChartPanel
    data/
      figures/          # one file per figure (data + configuration)
      index.js          # figure registry
      annotation-presets.js
    colors.js           # single source for chart colors
    chart-theme.js      # shared axes, ticks, tooltips, label helpers
    utils/              # figure PNG export
  routes/               # +page.svelte assembles the story sections
  styles/               # Tailwind, fonts, daisyUI theme
docs/                   # developer notes (scroll mechanics, chart styling)
```

## How a Page Is Assembled

`src/routes/+page.svelte` is the whole story in one file: an array of sections, each with a title, intro paragraphs, and a `charts` array naming the figures it shows. Everything else follows from it.

A section renders as a full-height text block, then hands its figures to `ScrollySection`, which pins a figure panel to the viewport and steps through the figures as the reader scrolls. `ChartDisplay` cross-fades between them and draws the figure header — number, reading-progress rail, title, subtitle — while `DescriptionColumn` fades the matching interpretation into the right-hand gutter (on mobile that text moves into a modal behind an "Interpretation" button). `ChapterRail` is the dot navigation in the left gutter, desktop-only.

## Working with Figures

Each figure is a plain object in its own file under `src/lib/data/figures/`: title, subtitle, description, source, figure number, a chart `kind`, and the data inline. All figures are registered by name in `src/lib/data/index.js`.

**To add a figure:** copy an existing file in `src/lib/data/figures/`, adjust it, register it in `index.js`, and add it to a section's `charts` in `+page.svelte`.

**To temporarily hide a figure:** comment out its entry in that section's `charts` array. Figure numbers are hardcoded per file, so hiding one does not renumber the others.

**Multi-step figures:** a figure file can export an array instead of a single object (see `02-workforce-growth-index.js`). Each entry is one scroll step sharing the same scaffold, so a chart can reveal one series at a time. The header shows the shared figure number ("Figure 2", not "2a/2b/2c") and the progress rail carries how far along the reader is.

### Chart kinds

| `kind` | Panel |
| --- | --- |
| `line` | Single or multi-series lines, with optional scrolly draw-in, end labels, difference bands, callouts |
| `line-multiples` | Small multiples — one mini line chart per panel entry |
| `bar-stacked` | Stacked or 100% stacked bars, with direct labels, bar totals, growth arrow |
| `bar-grouped` | Grouped vertical bars with a legend |
| `bar-horizontal` | Grouped horizontal bars, for long category names |
| `double` | Composite — stacks two panels of any kind above one another |

`ChartPanel.svelte` is the dispatch point; adding a kind means adding a panel component and a branch there.

### Styling

Chart colors come from `src/lib/colors.js` — the report palette plus `ink` for axis and annotation text, and `brand` for muted chart grays. Shared axis, tooltip, and label behavior lives in `src/lib/chart-theme.js`; reusable annotation styling (circled callouts, hatched projection bands) in `src/lib/data/annotation-presets.js`. UI colors are the daisyUI theme in `src/styles/tailwind.css`.

The scrolly system is keyed to a single breakpoint, `--breakpoint-lg`, overridden to **1400px** in `src/styles/tailwind.css` — that number decides where the side-by-side desktop layout takes over from the stacked one. The reasoning is documented at the override itself.

## PNG Download

Every visualization has a PNG button that renders the figure live, so the export always matches what is on screen — there is nothing to regenerate when a chart changes. `src/lib/utils/downloadFigure.js` finds the LayerChart roots inside the figure, serializes each one's SVG, rasterizes it at retina scale, and composites the result onto a canvas together with the figure number, progress rail, title, subtitle, source, and the `sandraviz.com` wordmark. The file is named from a slug of the figure number and title.

## Developer Notes

`docs/` holds the explainers for the mechanisms that are not obvious from the code:

- `sticky-scroll-explainer.md` — how the pinned scrolly section works
- `scrolly-line-draw-in.md` — the line draw-in animation and its tuning knobs
- `line-chart-casing.md` — background-colored casing strokes at line overlaps
- `download-image-overflow-clip-bug.md` — why the PNG export adds bleed
- `sandraviz-brand.md` — brand derivation for this branch
