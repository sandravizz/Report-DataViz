<script>
  // THE PLACE LINE (paris-demo, Sandra 2026-11-14, "option E" of the index
  // studies): the rail described below is GONE from the left side, so the
  // pinned figure can use the page's whole width. What is left of it is one
  // line beside the Index button: the current chapter › the current
  // sub-chapter. No figure in it (the figure names itself right below) and
  // no list: the Index sheet lists every chapter and sub-chapter. Each of
  // the two names jumps to its own start. All the scroll logic below is the
  // rail's, unchanged; the notes on the rail's look are history.
  //
  // CHAPTER RAIL (2026-09-29). The Index sheet in the header is the report's
  // outline (chapters and sub-chapters). This rail is its complement: it is
  // ALWAYS open on the CURRENT chapter — its title, every sub-chapter in it,
  // and every figure with its full title — so wherever the reader is, the
  // figures around them are one click away. Scroll into another chapter
  // (either direction) and the rail swaps to that chapter.
  //
  // Nothing is revealed on hover any more, so there is no expand/collapse
  // and none of the hover-shiver machinery the old dot rail needed.
  //
  // Desktop only (lg+): the LEFT side column of the symmetric layout —
  // same width (--side-w) and same gap from the centred figure as the
  // description column on the right. Geometry lives in styles/tailwind.css.
  // The rail is 2.5rem narrower than the description (--rail-w). Its text is
  // pinned to the WINDOW EDGE 24px in — the header's px-6, so it lines up
  // under the header logo — not to the figure. (The nav itself sits at left-3
  // with px-3 of its own, so the hover block has room either side of the
  // text inside the nav's scroll clip.) It is not tied to the figure: it is surrounding information,
  // and should read as page furniture rather than sit beside the chart. On
  // wide screens that opens more white space between rail and figure than
  // --side-gap; at 1400 the figure still starts ~130px clear of it.
  //
  // NO RED: dots and labels are ink. The CURRENT place is marked DISCREETLY
  // — /85 ink against the rest at /55, and a figure's dot filled in a light
  // grey (/38) at the same size as the others. No bold, no black, no size
  // jump: a heavy marker pulled the eye off the figure and the description
  // (2026-09-29). /55 is the lowest step that clears 4.5:1 on white.
  // Hover: the shared gliding block (lib/hoverGlide.svelte.js), the same as
  // the Index sheet, in place of the old 1px underline. Text goes to /90 and
  // a figure's dot shrinks to a /55 point.
  //
  // `sections` is the chapter list from +page.svelte:
  // `{ id, title, subchapters: [{ id, title, charts, allCharts }] }` —
  // allCharts is every figure in the sub-chapter, including those after a
  // heading-less passage, so the rail lists them under the one sub-chapter.
  let { sections = [] } = $props();

  // Every sub-chapter, flattened, with the index of its chapter.
  const subs = $derived(
    sections.flatMap((section, i) => section.subchapters.map((sub) => ({ id: sub.id, chapter: i })))
  );

  let activeSubId = $state(null);
  const chapterIndex = $derived(subs.find((s) => s.id === activeSubId)?.chapter ?? 0);
  const chapter = $derived(sections[chapterIndex]);

  let showRail = $state(false);
  let nav = $state(null);
  // Id of the pinned figure's anchor (`<sub-chapter id>-chart-<step>`), or
  // null between figures. Read off ScrollySection's anchors rather than
  // redoing its progress maths.
  let activeChart = $state(null);

  // Everything the rail shows is derived from one scroll tick of live
  // getBoundingClientRect() reads — nothing cached, so nothing goes stale.
  $effect(() => {
    const firstEl = document.getElementById(sections[0]?.id);
    // The rail leaves where the report's content ends: the closing screen
    // ([data-report-end], +page.svelte) when there is one, else the footer.
    const footerEl = document.querySelector("[data-report-end]") ?? document.querySelector("footer");
    // Each sub-chapter's whole text block (the heading's data-surface
    // ancestor), not the heading: the block's top is where the reader
    // leaves the previous figure run and enters this sub-chapter.
    const subBlocks = subs.map((s) => {
      const heading = document.getElementById(s.id);
      return { id: s.id, el: heading?.closest("[data-surface]") ?? heading };
    });
    if (!firstEl || !footerEl) return;

    function update() {
      const mid = window.innerHeight / 2;

      // Shown only while the reader is IN the report, and both edges are
      // live, so scrolling back brings it back.
      // In: once chapter 1's top has climbed to 40% of the screen height.
      // (Mid-screen read as too soon, a quarter as a little too late.)
      // Out: the MIRROR of in (2026-09-30) — once the ending screen's top
      // has climbed to 60% of the screen height, i.e. the ending fills the
      // bottom 40%, just as the report fills the bottom 60% when the rail
      // arrives. Scrolling back up past that line brings it back, the way
      // scrolling up to the cover takes it away. (It used to leave the
      // moment the ending's top edge entered the window, earlier than the
      // cover's rule, so the two ends did not match.)
      const pastLanding = firstEl.getBoundingClientRect().top <= window.innerHeight * 0.4;
      const beforeFooter = footerEl.getBoundingClientRect().top > window.innerHeight * 0.6;
      // Off while a dark chapter opener (+page.svelte) runs behind the rail
      // (2026-10-27): it goes as the next chapter's band rises into it and
      // comes back once the band has scrolled up past it, i.e. once the
      // reader is into the new chapter's intro text — never half over the
      // dark. Tested against the rail's own box (laid out even while
      // hidden), so a band elsewhere on the screen leaves it alone.
      const railBox = nav?.getBoundingClientRect();
      const overOpener =
        !!railBox &&
        Array.from(document.querySelectorAll("[data-chapter-opener]")).some((el) => {
          const rect = el.getBoundingClientRect();
          return rect.top < railBox.bottom && rect.bottom > railBox.top;
        });
      showRail = pastLanding && beforeFooter && !overOpener;

      const overChart = Array.from(document.querySelectorAll("[data-scrolly]")).some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= mid && rect.bottom >= mid;
      });

      // The anchor NEAREST the viewport top is the figure on screen: each
      // anchor sits where its step is exactly centred, and ScrollySection
      // switches charts by rounding progress — the same rule.
      let anchor = null;
      if (overChart) {
        let nearest = Infinity;
        for (const el of document.querySelectorAll("[data-chart-anchor]")) {
          const distance = Math.abs(el.getBoundingClientRect().top);
          if (distance < nearest) {
            nearest = distance;
            anchor = el;
          }
        }
      }
      activeChart = anchor ? anchor.id : null;

      // Current sub-chapter. While a figure is pinned it is the figure's
      // owner (its anchor id minus the step), whichever direction the reader
      // came from. Between figures, the last sub-chapter whose text block
      // has crossed the midline.
      if (anchor) {
        activeSubId = anchor.id.replace(/-chart-\d+$/, "");
      } else {
        let id = subBlocks[0]?.id ?? null;
        for (const b of subBlocks) {
          if (b.el && b.el.getBoundingClientRect().top <= mid) id = b.id;
        }
        activeSubId = id;
      }
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  });

  // Chapters, sub-chapter headings and figure anchors alike.
  function jumpToId(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

</script>

<!-- THE PLACE LINE (see the top of the script). `inert` takes it out of the
     tab order and the accessibility tree while it is hidden; opacity alone
     does neither. Beside the Index button: the header's 24px margin + the
     button (~78px) + 14px = left-[7.25rem]; as tall as the header bar
     (4.5rem), so the words sit on the button's line. Above the header
     (z-20), under the Index sheet. -->
<nav
  bind:this={nav}
  class="fixed top-0 left-[7.25rem] z-30 hidden h-[4.5rem] max-w-[calc(100vw-9rem)] items-center gap-2 font-sans text-sm transition-opacity duration-200 lg:flex {showRail
    ? 'opacity-100'
    : 'pointer-events-none opacity-0'}"
  aria-label="Where you are in the report"
  aria-hidden={!showRail}
  inert={!showRail}
>
  {#if chapter}
    {@const number = chapter.num ?? chapterIndex + 1}
    {@const subIndex = chapter.subchapters.findIndex((sub) => sub.id === activeSubId)}
    <button
      type="button"
      onclick={() => jumpToId(chapter.id)}
      class="cursor-pointer truncate text-base-content/65 transition-colors duration-200 hover:text-base-content"
    >
      <span class="tabular-nums">{number}</span>&nbsp; {chapter.title}
    </button>
    {#if subIndex >= 0}
      <span class="text-base-content/40" aria-hidden="true">›</span>
      <button
        type="button"
        onclick={() => jumpToId(chapter.subchapters[subIndex].id)}
        aria-current="true"
        class="cursor-pointer truncate text-base-content/85 transition-colors duration-200 hover:text-base-content"
      >
        <span class="tabular-nums">{number}.{subIndex + 1}</span>&nbsp; {chapter.subchapters[subIndex].title}
      </button>
    {/if}
  {/if}
</nav>
