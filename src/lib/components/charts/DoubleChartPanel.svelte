<script>
  // FT-style composite figure: pair.panels stacked vertically in one figure
  // block. The outer ChartDisplay header carries the figure's single big
  // title and the first panel's subtitle; every following panel brings only
  // a subtitle as a mid-block heading (styled and spaced exactly like the
  // header subtitle), and the figure's single source line closes the block.
  //
  // Small multiples (`panel.label`, e.g. figure 7's Non-AI / AI Applied /
  // AI Foundational Models): the header subtitle covers the whole figure, so
  // EVERY panel, the first included, carries a short name of its own — set
  // tight, since three panels share one screen.
  //
  // `pair.legend` + `pair.series`: ONE legend for every panel, right under
  // the subtitle — LayerChart's own Legend, standalone (swatches from an
  // ordinal scale). It is a filter: clicking a level shows only the levels
  // picked, in all panels at once (`selected`, handed to each panel);
  // clicking a picked one drops it, and none picked shows all again.
  //
  // `pair.scaleToggle` ([shared label, individual label]): panels share ONE
  // y domain by default — the tallest visible bar across all of them — and
  // a two-part button on the legend's row, at the right, gives each panel
  // its own scale instead. Not a LayerChart control (it has none)
  // (Sandra, 2026-10-29).
  import { Legend } from "layerchart";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import ChartPanel from "./ChartPanel.svelte";

  let { pair } = $props();

  // `picked` is what the legend shows at once; `selected` is what the
  // charts draw, applied mid-fade (see toggle).
  let picked = $state([]);
  let selected = $state([]);
  let individual = $state(false);
  let fading = $state(false);

  // Every panel gets an explicit, niced y domain — shared: the highest
  // visible level over all panels; own scale: over that panel alone — so
  // the panel can ease between two of them (BarChartPanelGroupedStacked).
  const visibleTop = $derived.by(() => {
    const levels = selected.length ? pair.series.filter((s) => selected.includes(s.key)) : pair.series;
    return levels[levels.length - 1].value;
  });
  const niceDomain = (rows) =>
    scaleLinear().domain([0, Math.max(...rows.map((d) => d[visibleTop]))]).nice().domain();
  const domains = $derived.by(() => {
    if (!pair.scaleToggle) return null;
    if (individual) return pair.panels.map((p) => niceDomain(p.data));
    const shared = niceDomain(pair.panels.flatMap((p) => p.data));
    return pair.panels.map(() => shared);
  });
  const legendScale = $derived(
    pair.series ? scaleOrdinal(pair.series.map((s) => s.key), pair.series.map((s) => s.color)) : null
  );

  // A legend click does not move anything: the charts dip to near-clear,
  // the new levels and scale are applied while they are faint, and they
  // fade back (Sandra, 2026-10-29: "really discreet"). Reduced motion
  // applies the change at once.
  const FADE_MS = 180;
  function toggle(key) {
    const next = picked.includes(key) ? picked.filter((k) => k !== key) : [...picked, key];
    // Kept in series order, so the stack order never depends on click order.
    picked = pair.series.map((s) => s.key).filter((k) => next.includes(k));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      selected = picked;
      return;
    }
    fading = true;
    setTimeout(() => {
      selected = picked;
      fading = false;
    }, FADE_MS);
  }
</script>

<div class="flex min-h-0 min-w-0 flex-1 flex-col">
  {#if pair.legend && legendScale}
    <div class="mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 lg:mb-6">
      <Legend
        scale={legendScale}
        variant="swatches"
        selected={picked}
        tickFormat={(key) => pair.series.find((s) => s.key === key)?.legend ?? key}
        onclick={(e, item) => toggle(item.value) ?? true}
        classes={{
          items: "flex flex-wrap items-center gap-x-4 gap-y-1",
          item: "flex cursor-pointer items-center gap-1.5 transition-opacity duration-200",
          swatch: "size-2.5 shrink-0 rounded-full",
          label: "font-sans text-xs font-light text-base-content",
        }}
      />
      {#if pair.scaleToggle}
        <!-- Segmented control, the chart convention for a view switch
             ("Linear | Log"): both states named, the active one in the
             Index button's soft ink fill, the other quiet. Kept discreet
             (2026-10-29): no frame, the legend's own type, 20px tall. -->
        <div role="group" aria-label="Y axis scale" class="inline-flex shrink-0 gap-0.5">
          {#each pair.scaleToggle as label, k (label)}
            {@const active = individual === (k === 1)}
            <button
              type="button"
              aria-pressed={active}
              onclick={() => (individual = k === 1)}
              class="h-5 cursor-pointer rounded-sm px-1.5 font-sans text-xs font-light transition-colors duration-200 {active
                ? 'bg-base-content/6 text-base-content'
                : 'text-base-content/55 hover:text-base-content'}"
            >
              {label}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
  <!-- The panels fade as one on a legend click (toggle). -->
  <div
    class="flex min-h-0 flex-1 flex-col transition-opacity duration-[180ms] ease-in-out"
    style:opacity={fading ? 0.2 : 1}
  >
    {#each pair.panels as panel, i (i)}
      {#if panel.label}
        <!-- data-export-label: the PNG export (downloadFigure.js) draws it. -->
        <div data-export-label class="{i > 0 ? 'mt-3 lg:mt-4' : ''} mb-1 font-sans text-xs font-medium text-base-content lg:text-sm">
          {panel.label}
        </div>
      {:else if i > 0}
        <div class="mt-6 mb-6 font-sans text-xs text-base-content lg:mt-8 lg:mb-7 lg:text-sm">
          {panel.subtitle}
        </div>
      {/if}
      <!-- `lastPanel`: on phones only the last panel writes its x labels
           (BarChartPanelGroupedStacked), the panels above share them. The last
           panel's box then starts 16px taller (basis-4 = chart-theme's
           groupedXPaddingSingle 24 − groupedXPaddingBare 8) and all three grow
           alike, so every PLOT gets the same height — on "Same scale" a bar's
           height must mean the same in each panel. -->
      <div
        class="flex min-h-0 grow {pair.legend && i === pair.panels.length - 1 && panel.kind === 'bar-grouped-stacked'
          ? 'basis-4 md:basis-0'
          : 'basis-0'}"
      >
        <ChartPanel
          pair={pair.legend
            ? {
                ...panel,
                selected,
                lastPanel: i === pair.panels.length - 1,
                ...(domains ? { yDomain: domains[i], yNice: false } : {}),
              }
            : panel}
        />
      </div>
    {/each}
  </div>
</div>
