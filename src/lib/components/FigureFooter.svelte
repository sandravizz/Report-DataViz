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
  <!-- Hover lift borrowed from ChapterRail's panel: the control takes the
       colour of the surface behind it (base-100) and rises on a shadow-lg
       rather than darkening in place. Painted with `!` utilities, not
       daisyUI's --btn-* variables: .btn composes box-shadow from --btn-inset
       and --btn-shadow, which .btn-ghost zeroes, so a plain shadow utility
       loses. .btn's own 200ms transition already matches the rail's. -->
  <button
    type="button"
    class="btn btn-ghost btn-xs shrink-0 self-start gap-1 rounded-full px-2.5 font-sans text-[11px] font-normal tracking-wide text-base-content/50 normal-case hover:border-transparent! hover:bg-base-100! hover:shadow-lg!"
    disabled={downloading}
    onclick={handleDownload}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3.5">
      <path fill-rule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v6.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V3.75A.75.75 0 0 1 10 3ZM3.75 13a.75.75 0 0 1 .75.75v1.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A2.25 2.25 0 0 1 14.75 17h-9.5A2.25 2.25 0 0 1 3 14.75v-1.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
    </svg>
    {downloading ? "Exporting…" : "PNG"}
  </button>
</div>
<!-- Same lift as the PNG button. self-start keeps the pill around the text:
     as a flex item of ChartDisplay's column, the default stretch blew the
     hover surface across the figure's full width. -ml-2.5 cancels the pill's
     padding so the wordmark sits where it did before the pill existed. -->
<a
  href="https://sandraviz.com"
  target="_blank"
  rel="noopener"
  class="-ml-2.5 inline-block self-start rounded-full px-2.5 py-1 font-sans text-[11px] tracking-wide text-base-content/30 transition-[background-color,box-shadow,color] duration-200 hover:bg-base-100 hover:text-base-content/50 hover:shadow-lg"
>
  sandraviz.com
</a>
