# The Global Justice Report

A scrollytelling data visualization site presenting *The Global Justice Report* — a quantified plan for reconciling global socioeconomic equality with planetary habitability through 2100.

As the reader scrolls, animated charts step through data on income and wealth inequality, decarbonization, human development, humanitarian aid, and political representation.

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) (Svelte 5, runes mode)
- [Tailwind CSS](https://tailwindcss.com/) + [daisyUI](https://daisyui.com/)
- [LayerChart](https://www.layerchart.com/) + [D3](https://d3js.org/) for charts (area, bar, grouped bar, stacked bar, line, scatter, donut, pie)
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
    data/           # pairs.js — chart data and configuration
    colors.js       # shared chart color palette
    scroll-animation.js
  routes/           # SvelteKit pages
  styles/           # Tailwind, fonts, base styles
```

Charts are defined as data/config pairs in `src/lib/data/pairs.js` and rendered by `ScrollySection.svelte`, which ties scroll position to chart transitions.
