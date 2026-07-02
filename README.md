# Interactive Report Template

A template for turning written reports into interactive, visualization-first web experiences. Not a replacement for the PDF, but a different path alongside it — both formats have their reasons to exist. Here, the reader moves through the content while animated charts bring the data to life, with a special focus on the visualizations themselves. A possible future addition is a print-to-PDF button, bridging the two formats from a single source.

As a showcase, this template presents [*The Global Justice Report*](https://globaljusticeproject.wid.world/global-justice-report/) — a quantified plan for reconciling global socioeconomic equality with planetary habitability through 2100. Animated charts step through data on income and wealth inequality, decarbonization, human development, humanitarian aid, and political representation.

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) (Svelte 5, runes mode)
- [Tailwind CSS](https://tailwindcss.com/) + [daisyUI](https://daisyui.com/)
- [LayerChart](https://next.layerchart.com/) + [D3](https://d3js.org/) for charts (area, bar, grouped bar, stacked bar, line, scatter, donut, pie)
- [Vite](https://vitejs.dev/)
- [Vercel Web Analytics](https://vercel.com/analytics)

## Getting Started

Requires Node `20.19.6` (see `.nvmrc`).

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
    components/    # chart panels, scrolly sections, header/footer, layout
    data/           # data.js — chart data and configuration
    colors.js       # shared chart color palette
    scroll-animation.js
  routes/           # SvelteKit pages
  styles/           # Tailwind, fonts, base styles
```

Charts are defined as data/config pairs in `src/lib/data/data.js` and rendered by `ScrollySection.svelte`, which ties scroll position to chart transitions.
