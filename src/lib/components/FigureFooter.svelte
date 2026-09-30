<script>
  // Used by ChartDisplay so the source/download row and the per-figure brand
  // wordmark stay in one place.
  import { downloadFigureImage } from "$lib/utils/downloadFigure.js";
  import RollText from "./RollText.svelte";

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
  <!-- The control on every figure: a HAIRLINE OUTLINE (option B,
       2026-09-29) — 1px ink at 28%, 6px corners, darkening to 70% on hover
       while the label rolls (RollText). It replaces the neutral wash-to-fill
       pill: a filled pill on every figure was one more object beside the
       chart. (The header's Index trigger shares the corners and the roll but
       wears a soft fill instead — see Header.svelte.)

       Plain Tailwind, not daisyUI's .btn: the old pill needed `!` on every
       hover property to beat .btn:hover's specificity, and an outline has
       nothing .btn adds. The glyph stays at full ink, one step stronger than
       the /75 label, so the pill keeps a focal point at 11px. The
       Interpretation button in ChartDisplay.svelte wears the same outline;
       change both together. See docs/figure-footer-controls.md.
       ONE STYLE AT EVERY SIZE (2026-09-30): the outline on phones too. It
       briefly wore the Index button's soft fill below lg, but the two
       styles carry two meanings — OUTLINE = download (PNG, Full report),
       SOFT FILL = opens something (Index, Interpretation) — and a button
       that changes style per device muddles that. Taps darken the stroke
       (active:), since there is no hover.
       SIZE SCALES WITH THE SCREEN (2026-09-30): h-6 px-2.5 gap-1 at 11px on
       phones, 12px from md, h-8 px-4 gap-1.5 at lg (the label ran too close
       to the stroke at h-6 on desktop). At h-8 on a phone it pulled far
       more attention than a caption-row control should. The style never
       changes, only the size. The closing "Full report" button in
       +page.svelte wears the same style but stays h-8 everywhere, to pair
       with "More from FDL". -->
  <button
    type="button"
    class="group inline-flex h-6 shrink-0 cursor-pointer items-center gap-1 self-start rounded-md border border-base-content/28 px-2.5 font-sans text-[11px] tracking-wide text-base-content/75 transition-colors duration-200 hover:border-base-content/70 hover:text-base-content active:border-base-content/70 active:text-base-content disabled:cursor-wait disabled:opacity-60 md:text-xs lg:h-8 lg:gap-1.5 lg:px-4"
    disabled={downloading}
    onclick={handleDownload}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3.5 text-base-content">
      <path fill-rule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v6.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V3.75A.75.75 0 0 1 10 3ZM3.75 13a.75.75 0 0 1 .75.75v1.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A2.25 2.25 0 0 1 14.75 17h-9.5A2.25 2.25 0 0 1 3 14.75v-1.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
    </svg>
    <RollText text={downloading ? "Exporting…" : "PNG"} />
  </button>
</div>
<!-- No per-figure sandraviz.com wordmark on this branch: FDL is a client
     report, and the credit lives once in the page footer instead. The other
     branches keep it (see main/template's FigureFooter). -->
