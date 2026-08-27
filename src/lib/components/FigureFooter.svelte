<script>
  // Used by ChartDisplay so the source/download row and the per-figure brand
  // wordmark stay in one place.
  import { downloadFigureImage } from "$lib/utils/downloadFigure.js";

  let { pair, figureEl, number, progress } = $props();
  let downloading = $state(false);

  function downloadName(p) {
    const slug = `${p.number} ${p.title}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `${slug}.png`;
  }

  async function handleDownload() {
    if (!figureEl || downloading) return;
    downloading = true;
    try {
      await downloadFigureImage({
        figureEl,
        number,
        progress,
        title: pair.title,
        subtitle: pair.subtitle,
        source: pair.source,
        // The legend is DOM, not part of any chart SVG, so the exporter has to
        // redraw it from the same entries LineChartPanel renders.
        legendItems: pair.legendItems,
        filename: downloadName(pair),
      });
    } catch (error) {
      // Otherwise the button silently flips back from "Exporting…" with no
      // file and no trace.
      console.error("Figure PNG export failed", error);
    } finally {
      downloading = false;
    }
  }
</script>

<div
  class="mt-10 flex flex-nowrap items-start justify-between gap-2 font-sans text-[11px] tracking-wide text-base-content/70 lg:mt-20"
>
  <span class="leading-snug">{pair.source}</span>
  <!-- The one filled control in the report: a faint accent wash at rest that
       goes to full strength on hover. No border — the fill alone carries it,
       and the download glyph at full ink is what gives the pill a focal point
       at 11px. See docs/figure-footer-controls.md.

       Hover needs `!` on every property, not daisyUI's --btn-* variables:
       daisyUI's own `.btn:hover` is a two-class selector, so a plain hover
       utility loses the specificity contest, and .btn composes box-shadow
       from --btn-inset + --btn-shadow which .btn-ghost zeroes. The resting bg
       carries `!` for the same reason applied to `.btn-ghost`, which sets its
       own transparent fill.

       DIAL THE GREEN HERE: the `/25` in `bg-accent/25!` below is the resting
       strength, as a percentage — lower is fainter, higher is greener. Any
       integer works. Keep it under about /50 or it stops reading as a step up
       to the full-accent hover. The Interpretation button in
       ChartDisplay.svelte carries the same value; change both together or the
       report's two controls drift apart. -->
  <button
    type="button"
    class="btn btn-ghost btn-xs shrink-0 self-start gap-1 rounded-full bg-accent/25! px-2.5 font-sans text-[11px] font-normal tracking-wide text-base-content/75 normal-case hover:border-transparent! hover:bg-accent! hover:text-base-content hover:shadow-lg!"
    disabled={downloading}
    onclick={handleDownload}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3.5 text-base-content">
      <path fill-rule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v6.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V3.75A.75.75 0 0 1 10 3ZM3.75 13a.75.75 0 0 1 .75.75v1.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A2.25 2.25 0 0 1 14.75 17h-9.5A2.25 2.25 0 0 1 3 14.75v-1.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
    </svg>
    {downloading ? "Exporting…" : "PNG"}
  </button>
</div>
<!-- The wordmark is a link, not a control, so it takes the accent as a rule
     rather than a fill: the same underline as `mark.accent-mark` in the
     running text, at the same 2px. 1px was tried first — 11px text sits close
     to its baseline, so a thinner rule seemed right — but the accent is 1.3:1
     on white, and at 1px it disappeared into the figure surface entirely. The
     rule is only worth drawing if it can be seen, so thickness wins over the
     tighter fit.

     Nothing changes on hover — like the chapter nav in Header.svelte, the
     pointer cursor is the whole affordance. No fill, no lift, no transition.

     self-start keeps the link wrapped to its text: this <a> is a flex item of
     ChartDisplay's column, and the default stretch blows it across the
     figure's full width.

     -mt-1 closes the gap to the source line above. The row above is 24px tall
     because the PNG button sets its height, while the source text beside it is
     only ~15px, so there is dead space under the source that has nothing to do
     with the spacing anyone intended. Pulling back 4px lands the two lines
     about 5px apart, so source + wordmark read as one footer block and the
     space above the block (mt-10 / lg:mt-20) is what separates it from the
     chart. -->
<a
  href="https://sandraviz.com"
  target="_blank"
  rel="noopener"
  class="-mt-1 inline-block cursor-pointer self-start font-sans text-[11px] tracking-wide text-base-content/70 underline decoration-accent decoration-2 underline-offset-[3px]"
>
  sandraviz.com
</a>
