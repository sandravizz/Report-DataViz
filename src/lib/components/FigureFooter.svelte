<script>
  // Used by ChartDisplay so the source/download row and the per-figure brand
  // wordmark stay in one place.
  const figureFiles = {
    "Figure 1": "Figure1.png",
    "Figure 2a": "Figure2.png",
    "Figure 2b": "Figure2.png",
    "Figure 2c": "Figure2.png",
    "Figure 2d": "Figure2.png",
    "Figure 3": "Figure3.png",
    "Figure 4a": "Figure4a.png",
    "Figure 4b": "Figure4b.png",
    "Figure 5": "Figure5.png",
  };

  let { pair } = $props();

  function figureImage(p) {
    return `/figures/${figureFiles[p.number]}`;
  }

  function downloadName(p) {
    const slug = `${p.number} ${p.title}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `${slug}.png`;
  }
</script>

<div
  class="mt-8 flex flex-nowrap items-start justify-between gap-2 font-sans text-[11px] tracking-wide text-base-content/50 lg:mt-16"
>
  <span class="leading-snug">{pair.source}</span>
  <a
    class="btn btn-ghost btn-xs shrink-0 self-start gap-1 px-1.5 font-sans text-[11px] font-normal tracking-wide text-base-content/50 normal-case hover:[--btn-bg:var(--color-base-200)] hover:[--btn-border:transparent] hover:[--btn-noise:none] hover:[--btn-shadow:none]"
    href={figureImage(pair)}
    download={downloadName(pair)}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3.5">
      <path fill-rule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v6.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V3.75A.75.75 0 0 1 10 3ZM3.75 13a.75.75 0 0 1 .75.75v1.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A2.25 2.25 0 0 1 14.75 17h-9.5A2.25 2.25 0 0 1 3 14.75v-1.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
    </svg>
    PNG
  </a>
</div>
<a
  href="https://sandraviz.com"
  target="_blank"
  rel="noopener"
  class="mt-1 inline-block font-sans text-[11px] tracking-wide text-base-content/30 hover:text-base-content/50"
>
  sandraviz.com
</a>
