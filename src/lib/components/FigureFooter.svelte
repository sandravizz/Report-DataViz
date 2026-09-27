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
      // Without this the export's rejections become unhandled: the button
      // would silently flip back from "Exporting…" with no file and no trace.
      console.error("Figure PNG export failed", error);
    } finally {
      downloading = false;
    }
  }
</script>

<div
  class="mt-10 flex flex-nowrap items-start justify-between gap-2 font-sans text-[11px] tracking-wide text-base-content/55 md:text-xs lg:mt-20"
>
  <span class="leading-snug">{pair.source}</span>
  <!-- The filled control on every figure: a faint NEUTRAL wash at rest that
       goes to full strength on hover. No border — the fill alone carries it,
       and the download glyph at full ink is what gives the pill a focal point
       at 11px. See docs/figure-footer-controls.md.

       Neutral, not accent, since 2026-09-27. The wash used to be `accent/25`
       going to full `accent`, which read well when the rust was the only
       saturated thing on the page. It is not any more: the figures now draw
       their story series in that same rust (see the header of colors.js), so
       an accent-filled button sat on every figure as a second red object,
       competing with the one mark that is supposed to mean "look here". The
       control is chrome, and now says so. `--color-neutral` is the `strong`
       step of the ramp in colors.js.

       The full-strength hover ground is dark, so it needs the light ink the
       theme defines as its counterpart: `neutral-content`, not
       `base-content`. The glyph follows it — it is painted a step stronger
       than the label, and left at `base-content` it would go invisible the
       moment the fill came up.

       Hover needs `!` on every property, not daisyUI's --btn-* variables:
       daisyUI's own `.btn:hover` is a two-class selector, so a plain hover
       utility loses the specificity contest, and .btn composes box-shadow
       from --btn-inset + --btn-shadow which .btn-ghost zeroes. The resting bg
       carries `!` for the same reason applied to `.btn-ghost`, which sets its
       own transparent fill.

       DIAL IT HERE: the `/25` in `bg-neutral/25!` below is the resting
       strength, as a percentage — lower is fainter, higher is stronger. Any
       integer works. Keep it under about /50 or it stops reading as a step up
       to the full-strength hover. The Interpretation button in
       ChartDisplay.svelte carries the same value; change both together or the
       report's two controls drift apart. -->
  <button
    type="button"
    class="group btn btn-ghost btn-xs shrink-0 self-start gap-1 rounded-full bg-neutral/25! px-2.5 font-sans text-[11px] font-normal tracking-wide text-base-content/75 normal-case md:text-xs hover:border-transparent! hover:bg-neutral! hover:text-neutral-content! hover:shadow-lg!"
    disabled={downloading}
    onclick={handleDownload}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3.5 text-base-content group-hover:text-neutral-content">
      <path fill-rule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v6.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V3.75A.75.75 0 0 1 10 3ZM3.75 13a.75.75 0 0 1 .75.75v1.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A2.25 2.25 0 0 1 14.75 17h-9.5A2.25 2.25 0 0 1 3 14.75v-1.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
    </svg>
    {downloading ? "Exporting…" : "PNG"}
  </button>
</div>
<!-- No per-figure sandraviz.com wordmark on this branch: FDL is a client
     report, and the credit lives once in the page footer instead. The other
     branches keep it (see main/template's FigureFooter). -->
