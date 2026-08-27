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
        filename: downloadName(pair),
      });
    } catch (error) {
      // Otherwise the button silently flips back from "Exporting…" with no
      // file and no trace of why.
      console.error("Figure PNG export failed", error);
    } finally {
      downloading = false;
    }
  }
</script>

<div
  class="mt-10 flex flex-nowrap items-start justify-between gap-2 font-sans text-[11px] tracking-wide text-base-content/50 lg:mt-20"
>
  <span class="leading-snug">{pair.source}</span>
  <!-- The one filled control in the report: a faint accent wash at rest that
       goes to full strength on hover. No border — the fill alone carries it,
       and the download glyph at full ink is what gives the pill a focal point
       at 11px. See docs/figure-footer-controls.md.

       This branch's accent is slate grey (#7d8597): filled at full strength
       it reads as a dark chip against the white page, so `accent-content` IS
       white and the hover flips label and glyph to it — near-black on that
       fill looks like the control went out rather than lit up. Both name
       `accent-content` rather than a literal white so the theme token stays
       in charge if the accent is ever re-cut lighter.

       Hover needs `!` on every property, not daisyUI's --btn-* variables:
       daisyUI's own `.btn:hover` is a two-class selector, so a plain hover
       utility loses the specificity contest, and .btn composes box-shadow
       from --btn-inset + --btn-shadow which .btn-ghost zeroes. The resting bg
       carries `!` for the same reason applied to `.btn-ghost`, which sets its
       own transparent fill.

       DIAL THE WASH HERE: the `/25` in `bg-accent/25!` below is the resting
       strength, as a percentage — lower is fainter, higher is greyer. Any
       integer works. Keep it under about /50 or it stops reading as a step up
       to the full-accent hover. Note that a slate wash on white lands close to
       `base-300`, which is the same hue: the pill reads as a raised surface
       rather than a tint, which is the intent. The Interpretation button in
       ChartDisplay.svelte carries the same value; change both together or the
       report's two controls drift apart. -->
  <button
    type="button"
    class="group btn btn-ghost btn-xs shrink-0 self-start gap-1 rounded-full bg-accent/25! px-2.5 font-sans text-[11px] font-normal tracking-wide text-base-content/75 normal-case hover:border-transparent! hover:bg-accent! hover:text-accent-content hover:shadow-lg!"
    disabled={downloading}
    onclick={handleDownload}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3.5 text-base-content group-hover:text-accent-content">
      <path fill-rule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v6.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V3.75A.75.75 0 0 1 10 3ZM3.75 13a.75.75 0 0 1 .75.75v1.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A2.25 2.25 0 0 1 14.75 17h-9.5A2.25 2.25 0 0 1 3 14.75v-1.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
    </svg>
    {downloading ? "Exporting…" : "PNG"}
  </button>
</div>
<!-- The wordmark is a link, not a control, so it takes the accent as a rule
     rather than a fill: the same underline as `mark.accent-mark` in the
     running text, at 1px instead of 2px because 11px text sits much closer to
     its baseline and a 2px rule there reads as a bar.

     NO HOVER SURFACE. It used to lift onto a white pill with a shadow, which
     gave an 11px credit line the same "raised control" gesture as the PNG
     button beside it — two different weights of thing saying the same thing.
     The pointer cursor plus the standing accent rule are the whole hover
     affordance now. Don't reintroduce a background or box-shadow here; the
     filled pill is reserved for the two actual controls.

     The padding and negative margins are geometry, not a leftover surface.
     self-start keeps the box around the text: as a flex item of
     ChartDisplay's column, the default stretch blew it across the figure's
     full width. -ml-2.5 cancels px-2.5 so the wordmark sits flush with the
     source line above it.

     md:-mt-2 closes the gap to the source line above. The row above is 24px
     tall because the PNG button sets its height, while the source text beside
     it is only ~15px, so there is dead space under the source that has nothing
     to do with the spacing anyone intended. Pulling back 8px against this
     element's own py-1 lands the two lines about 5px apart, so source +
     wordmark read as one footer block and the space above the block
     (mt-10 / lg:mt-20) is what separates it from the chart.

     THE PULL IS md: AND UP ONLY. Below 768px the source no longer fits beside
     the button on one line, so it wraps to two, the row grows past the
     button's 24px and the dead space it was cancelling is gone — the -8px
     then ate into the real gap and the wordmark sat almost on the source's
     second line. With no pull at phone widths the two lines land ~6px apart,
     the same as everywhere else. md rather than lg because the wrap is what
     drives this, and the source is back on one line well before 1024. -->
<a
  href="https://sandraviz.com"
  target="_blank"
  rel="noopener"
  class="-ml-2.5 inline-block md:-mt-2 self-start px-2.5 py-1 font-sans text-[11px] tracking-wide text-base-content/50 underline decoration-accent decoration-1 underline-offset-[3px]"
>
  sandraviz.com
</a>
