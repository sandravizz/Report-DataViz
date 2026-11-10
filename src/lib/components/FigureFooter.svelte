<script>
  // Used by ChartDisplay so the source/download row and the per-figure brand
  // wordmark stay in one place.
  import { downloadFigureImage } from "$lib/utils/downloadFigure.js";
  import RollText from "./RollText.svelte";

  let { pair, figureEl, number, progress } = $props();
  let downloading = $state(false);

  function downloadName(p, ext) {
    const slug = `${p.number} ${p.title}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `${slug}.${ext}`;
  }

  // The figure's data file (`pair.csv`, its CSV imported `?raw` in the
  // figure file) handed over as-is. The BOM makes Excel read it as UTF-8, so
  // accented names (Sèvres, Barbès…) do not arrive garbled.
  function handleCsvDownload() {
    const blob = new Blob(["\uFEFF", pair.csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName(pair, "csv");
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
        // A figure-level legend (composite figures, DoubleChartPanel) is
        // page markup, not chart SVG, so it is handed over to be drawn.
        legend: pair.legend && pair.series
          ? pair.series.map((s) => ({ label: s.legend ?? s.key, color: s.color }))
          : null,
        source: pair.source,
        filename: downloadName(pair, "png"),
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

<!-- A figure of three or more stacked panels (small multiples) gives most
     of the air above the source back to its plots: mt-6/lg:mt-8 instead of
     mt-10/lg:mt-20 (Sandra, 2026-10-29). -->
<div
  class="{pair.panels?.length > 2
    ? 'mt-6 lg:mt-8'
    : 'mt-10 lg:mt-20'} flex flex-nowrap items-center justify-between gap-2 font-sans text-[11px] tracking-wide text-base-content/65 md:text-xs"
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
       with "More from SandraViz". -->
  <!-- PNG + CSV as ONE SPLIT CONTROL (2026-11-10): two full pills side by
       side read as twice the furniture, so they share one outline — the
       download glyph once, then PNG | CSV split by a hairline. Same outline,
       type and roll as before; each half washes on hover, the whole outline
       darkens. A step shorter at lg (h-7, was h-8). A figure without `csv`
       shows the PNG half alone. -->
  <div
    class="inline-flex h-6 shrink-0 items-stretch overflow-hidden rounded-md border border-base-content/28 font-sans text-[11px] tracking-wide text-base-content/75 transition-colors duration-200 hover:border-base-content/70 md:text-xs lg:h-7"
  >
    <span class="flex items-center pl-2 lg:pl-2.5" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3.5 text-base-content">
        <path fill-rule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v6.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V3.75A.75.75 0 0 1 10 3ZM3.75 13a.75.75 0 0 1 .75.75v1.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A2.25 2.25 0 0 1 14.75 17h-9.5A2.25 2.25 0 0 1 3 14.75v-1.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
      </svg>
    </span>
    <button
      type="button"
      aria-label="Download PNG"
      class="group inline-flex cursor-pointer items-center px-2 transition-colors duration-200 hover:bg-base-content/6 hover:text-base-content active:bg-base-content/6 active:text-base-content disabled:cursor-wait disabled:opacity-60 lg:px-2.5 pl-1.5 lg:pl-1.5"
      disabled={downloading}
      onclick={handleDownload}
    >
      <RollText text={downloading ? "Exporting…" : "PNG"} />
    </button>
    {#if pair.csv}
      <span class="my-1.5 w-px bg-base-content/20" aria-hidden="true"></span>
      <button type="button" aria-label="Download CSV" class="group inline-flex cursor-pointer items-center px-2 transition-colors duration-200 hover:bg-base-content/6 hover:text-base-content active:bg-base-content/6 active:text-base-content disabled:cursor-wait disabled:opacity-60 lg:px-2.5" onclick={handleCsvDownload}>
        <RollText text="CSV" />
      </button>
    {/if}
  </div>
</div>
<!-- No per-figure sandraviz.com wordmark on this branch: the credit lives
     once in the page footer instead. The other
     branches keep it (see main/template's FigureFooter). -->
