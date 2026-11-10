<script>
  import { page } from "$app/state";
  import { figures } from "$lib/data/index.js";

  const meta = {
    title: "Paris by Maps | An Interactive Report",
    description: "An interactive report. Web development and data visualization by SandraViz.",
  };
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Header from "$lib/components/Header.svelte";
  import ChapterRail from "$lib/components/ChapterRail.svelte";
  import Landing from "$lib/components/Landing.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import CursorDot from "$lib/components/CursorDot.svelte";
  import StreetMap from "$lib/components/StreetMap.svelte";
  import RollText from "$lib/components/RollText.svelte";

  // The PDF the closing call to action downloads. Drop the report's file in
  // static/ under this name (or change the path).
  const pdfHref = "/report.pdf";
  // The report's name as the closing colophon prints it.
  const reportTitle = "Paris by Maps";
  // The publisher line under it.
  const publisherLine = "Publisher · Month 2026";
  // Where the closing "More from …" button sends the reader.
  // PLACEHOLDER: every general link goes to sandraviz.com for now.
  const moreLabel = "More from SandraViz";
  const moreHref = "https://www.sandraviz.com/";

  // paris-demo (2026-11-04): carta-demo's structure in main's look, with
  // THREE placeholder chapters — the copy and data are still to come.
  // Chapter One steps through Paris at three levels of detail (arrondissements,
  // quartiers, IRIS), with random placeholder values; Chapter Two draws the
  // whole métro network, then zooms in on the city of Paris. Chapter Three stays text-only,
  // so the report ends on text.
  //
  // THREE LAYERS: chapter → sub-chapter → figure. A sub-chapter may have no
  // figures (text only); `passages` continue a sub-chapter after its figure
  // run with a heading-less text block and their own figures. Ids are
  // assigned automatically below. To add a figure: register it in
  // $lib/data/index.js and list it in a sub-chapter's `charts`, e.g.
  // `charts: [figures.myFigure]`.
  //
  // `locked: true` keeps a chapter in the Index (greyed, not clickable) but
  // leaves it out of the page and the rail. The report must END ON TEXT —
  // never a pinned figure straight into the ending screen.
  const sections = assignIds([
    {
      title: "Chapter One",
      subchapters: [
        {
          title: "Sub-chapter title",
          intro: "Placeholder lede: <mark class=\"accent-mark\">the one line that says what this sub-chapter is about</mark>.",
          body: ["Placeholder body copy for this sub-chapter."],
          charts: [figures.parisArrondissements, figures.parisQuartiers, figures.parisIris],
        },
      ],
    },
    {
      title: "Chapter X",
      // Hidden for now (Sandra, 2026-11-10): the métro maps and Figure 6's
      // three-scroll morph; Chapter Two's two-scroll study is shown instead.
      locked: true,
      subchapters: [
        {
          title: "Sub-chapter title",
          intro: "Placeholder lede: <mark class=\"accent-mark\">the one line that says what this sub-chapter is about</mark>.",
          body: ["Placeholder body copy for this sub-chapter."],
          charts: [figures.parisMetro, figures.parisMetroCentre, figures.parisMetroRidership],
        },
      ],
    },
    {
      title: "Chapter Two",
      subchapters: [
        {
          title: "Sub-chapter title",
          intro: "Placeholder lede: <mark class=\"accent-mark\">the one line that says what this sub-chapter is about</mark>.",
          body: ["Placeholder body copy for this sub-chapter."],
          charts: [figures.parisMetroRidershipLines],
        },
        // The report ENDS ON TEXT: a closing sub-chapter after the figure.
        {
          title: "Sub-chapter title",
          intro: "Placeholder lede: <mark class=\"accent-mark\">the closing line of the report</mark>.",
          body: ["Placeholder body copy for the closing sub-chapter."],
          charts: [],
        },
      ],
    },
  ]);

  // NUMBERS THE FIGURES: one plain series in reading order — Figure 1, 2,
  // 3… — which every place a number is shown (figure eyebrow, chapter rail,
  // PNG export) reads. Figures are copied, not mutated: the data objects are
  // shared module exports.
  function assignIds(chapters) {
    let figureCount = 0;
    // The NUMBER shown (rail, Index) counts only the chapters on the page; a
    // locked one shows "X" (Sandra, 2026-11-10). Ids stay by position.
    let chapterCount = 0;
    return chapters.map((chapter, i) => {
      const id = `chapter-${i + 1}`;
      const subchapters = chapter.subchapters.map((sub, k) => {
        // Locked chapters are not rendered, so they take no figure numbers.
        const number = (c) => (chapter.locked ? c : { ...c, number: `Figure ${++figureCount}` });
        const charts = sub.charts.map(number);
        // Each passage's figure run numbers its anchors on from the runs
        // before it (anchorOffset), so the rail's `-chart-<j>` ids hold.
        let offset = charts.length;
        const passages = (sub.passages ?? []).map((p) => {
          const run = { body: [], ...p, charts: p.charts.map(number), anchorOffset: offset };
          offset += run.charts.length;
          return run;
        });
        const allCharts = [...charts, ...passages.flatMap((p) => p.charts)];
        return { body: [], ...sub, charts, passages, allCharts, id: `${id}-${k + 1}` };
      });
      return { ...chapter, id, num: chapter.locked ? "X" : ++chapterCount, subchapters };
    });
  }

  // The chapters the demo renders (body and rail); the Index gets them all.
  const shown = sections.filter((s) => !s.locked);
  const openIds = new Set(shown.flatMap((s) => s.subchapters.map((sub) => sub.id)));

  // THE HIGHLIGHTS: a short summary between the cover and the first
  // chapter, one item per chapter. PLACEHOLDERS. Phones and tablets show
  // `title` + `text` as a bulleted list; from lg `deskTitle` + `deskText`
  // run as three columns (`deskOnly` items are hidden below lg). Each
  // lead-in links to the sub-chapter that tells the same story at length.
  const highlights = [1, 2, 3].map((n) => ({
    title: `Highlight ${n}`,
    text: "Placeholder: one or two sentences summarising a key finding.",
    deskTitle: `Highlight ${n}`,
    deskText: "Placeholder: one or two sentences summarising a key finding.",
    href: `#chapter-${n}-1`,
  }));

  // Each chapter divider shows its own part of the street map, in turn: the
  // Étoile, the centre around Châtelet, Nation. The centres sit left of the
  // place they name, so it lands on the right, away from the title.
  const chapterMaps = [[2.283, 48.8738], [2.335, 48.8585], [2.384, 48.8485]];

  // ONE GROUND EVERYWHERE: text and pinned figures both sit on base-200,
  // main's pale green-grey #EFF1EF.
</script>

<!-- A text block's lede and body, shared by a sub-chapter and its
     heading-less passages. -->
{#snippet copy(text)}
              {#if text.intro}
                <!-- The lede: one tier above the body, full ink, tight
                     leading — the line that says what the sub-chapter is
                     about. Rendered as HTML so it can carry a
                     `mark.accent-mark`; the strings are editorial copy from
                     this file, nothing fetched or user-supplied.
                     PHONES (2026-10-27): the lede takes the body's size and
                     leading (17px/1.6) and steps up by weight and ink only —
                     at 21px/snug it read as a third size with its own rhythm
                     on a narrow screen. The tier returns from md.
                     Then the weight and ink step went too (Sandra,
                     2026-10-27): on phones the lede is set exactly as the
                     body, so a phone shows two text styles, title and body. -->
                <p
                  class="text-[1.0625rem] leading-[1.6] text-base-content/80 md:text-[1.375rem] md:leading-snug md:text-base-content/90 lg:text-[1.625rem]"
                >
                  {@html text.intro}
                </p>
              {/if}
              <!-- Body copy. Leading 1.6 on phones, 1.85 from md (2026-09-30):
                   1.85 suits the full ~65-character desktop measure, but on a
                   phone's ~35-character lines it read as loose, the lines
                   drifting apart (compare Reuters' mobile stories, ~1.6).
                   17px on phones, 18px from md (2026-10-19).
                   The /80 stays: main's ink #1F281D at /80 is well clear of
                   4.5:1 on #EFF1EF (docs/type-rendering.md rule 4). -->
              {#each text.body ?? [] as paragraph, j (j)}
                <p
                  class="text-[1.0625rem] leading-[1.6] text-base-content/80 md:text-lg md:leading-[1.85] {j === 0 && text.intro
                    ? 'mt-6 md:mt-8'
                    : j > 0
                      ? 'mt-6'
                      : ''}"
                >
                  {@html paragraph}
                </p>
              {/each}
{/snippet}

<svelte:head>
  <meta property="og:type" content="website" />
  <meta property="og:title" content={meta.title} />
  <meta property="og:description" content={meta.description} />
  <meta property="og:url" content={page.url.origin + page.url.pathname} />
  <!-- No og:image yet: the share image for this report is still to come.
       "summary" until then — "summary_large_image" wants an image. -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={meta.title} />
  <meta name="twitter:description" content={meta.description} />
</svelte:head>

<!-- The accent dot cursor, which applies to the COVER ONLY: it follows the
     `data-accent-cursor` attribute on Landing.svelte's root section, and the
     report proper keeps the system pointer. Mounts itself only for a real
     mouse — see CursorDot.svelte. Nothing else on the page depends on it. -->
<CursorDot />

<!-- Skip link: the first thing in the tab order, visually hidden until it is
     focused. Without it a keyboard or screen-reader user had to tab the whole
     header — two dropdown triggers, four social links — on the way into the
     report, on every visit. `sr-only focus:not-sr-only` is the standard
     pattern: it takes no space until it is the focused element. -->
<a
  href="#top"
  class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-box focus:bg-base-100 focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:text-base-content focus:shadow-lg"
>
  Skip to the report
</a>

<!-- Header and rail take the SAME chapter list and split the job: the Index
     sheet is the outline (chapters and sub-chapters), the left rail (lg+)
     always shows the CURRENT sub-chapter and its figures. -->
<Header {sections} />
<ChapterRail sections={shown} />

<!-- `main` rather than a bare div: the page had no landmark at all, so
     "jump to main content" had nothing to jump to. tabindex="-1" is what lets
     the skip link above actually move focus here (a container is not focusable
     on its own); it does NOT put the element in the tab order. The id stays
     `top` because the Index sheet's title links to it. -->
<main id="top" tabindex="-1">
  <Landing />

  <div id="charts"></div>

  <!-- HIGHLIGHTS: between the cover and the first chapter opener so two
       dark screens never meet. Kept QUIET on purpose: a short summary to
       scroll past, not a feature. A bold heading, then a plain bulleted
       list, each item a bold lead-in with a colon running into the
       sentence, in the chapter text column at the body copy's size. A
       lead-in whose sub-chapter is open links to it and underlines on hover.
       DESKTOP: from lg the section takes the page width and one full
       screen, the highlights running as three columns, each under a
       hairline, its lead-in on a line of its own (no colon) over its text. -->
  <section aria-labelledby="highlights" class="bg-base-200 font-sans text-base-content lg:flex lg:min-h-screen lg:items-center">
    <div class="mx-auto w-[88vw] max-w-[40rem] py-12 lg:max-w-[80rem] lg:py-20">
      <h2
        id="highlights"
        class="font-serif text-[2rem] leading-[1.04] font-bold tracking-[-0.01em] sm:text-[2.5rem] lg:text-[3rem]"
      >
        Highlights
      </h2>
      <ul
        class="mt-6 list-disc space-y-4 pl-5 text-[1.0625rem] leading-[1.6] text-base-content/80 marker:text-base-content md:mt-8 md:space-y-5 md:text-lg md:leading-[1.7] lg:mt-12 lg:grid lg:list-none lg:grid-cols-3 lg:gap-x-10 lg:space-y-0 lg:pl-0 lg:text-base lg:leading-[1.65]"
      >
        {#each highlights as h (h.title)}
          {@const live = openIds.has(h.href.slice(1))}
          <li class="pl-1 lg:block lg:border-t lg:border-base-content/15 lg:pt-5 lg:pl-0 {h.deskOnly ? 'hidden' : ''}">
            {#if live}
              <a href={h.href} class="font-semibold text-base-content decoration-1 underline-offset-[0.2em] hover:underline lg:mb-2 lg:block"
                ><span class="lg:hidden">{h.title}:</span><span class="hidden lg:inline">{h.deskTitle}</span></a
              >
            {:else}
              <strong class="font-semibold text-base-content lg:mb-2 lg:block"
                ><span class="lg:hidden">{h.title}:</span><span class="hidden lg:inline">{h.deskTitle}</span></strong
              >
            {/if}
            <span class="lg:hidden">{h.text}</span><span class="hidden lg:inline">{h.deskText}</span>
          </li>
        {/each}
      </ul>
    </div>
  </section>
  {#each shown as section, i (section.id)}
    <!-- Chapter text is NOT pinned and NOT sized to the viewport: only the
         figure surface in ScrollySection sticks. This is long-form copy, so
         the block is exactly as tall as its own paragraph — you scroll until
         the text ends and the next section begins, and nothing is padded out
         to fill a screen it does not need.
         It used to be `lg:h-[140vh]` on the section with a
         `lg:sticky lg:h-screen lg:overflow-y-auto` box inside, which pinned a
         short chapter in the middle of an otherwise empty screen and gave
         every chapter the same height regardless of how much it said. Ported
         from main; see docs/house-style.md. -->
    <!-- The <section> now wraps the whole chapter, its figures included: one
         text block per sub-chapter, each followed by its own figure run. The
         chapter's title opens the FIRST sub-chapter's block rather
         than sitting in a block of its own, so two grounds never stack
         with a seam between them. -->
    <section id={section.id} class="font-sans text-base-content">
      <!-- THE CHAPTER DIVIDER (2026-11-08): a band of the cover's violet
           street map, zoomed in on a different part of Paris per chapter,
           with the title on the side where it fades out. NOT a full screen
           like the cover: under half a screen, so it marks the turn of a
           chapter without stopping the read. -->
      <div
        data-chapter-opener
        class="relative flex min-h-[44svh] items-end bg-secondary px-[6vw] py-16 text-white md:items-center lg:min-h-[46vh]"
      >
        <StreetMap center={chapterMaps[i % chapterMaps.length]} span={[0.06, 0.03]} side="left" />
        <!-- Satoshi bold, main's heading weight. On phones 30px and no 14ch
             cap, so a longer title takes two lines, not three. -->
        <h2
          class="relative font-serif text-[1.875rem] leading-[1.04] sm:max-w-[14ch] font-bold tracking-[-0.01em] text-balance sm:text-[3.25rem] lg:text-[4.5rem]"
        >
          {section.title}
        </h2>
      </div>
      {#each section.subchapters as sub (sub.id)}
      <!-- data-surface marks the sub-chapter's text block; ChapterRail reads
           it to tell which sub-chapter the reader is in. -->
      <div class="bg-base-200" data-surface="text">
        <!-- Report-style text block, after the Silver Linings reference:
             a centred display title per chapter, a centred sub-chapter
             title under it (not underlined at any size), then a lede one tier bigger than the
             body and the body copy itself. Everything shares one centred
             column; the lede and body keep a ~65-character measure inside it.
             py-16/lg:py-28 sets the air above and below the copy directly —
             the block is natural height (see docs/house-style.md).
             PHONES (2026-10-27): no padding below copy that a figure
             follows (text before a chapter band or the ending keeps pb-14).
             The sub-chapter title on phones is one size down and sits
             mt-6 above the copy. The figure
             screen that follows already opens with its own 68px before
             "FIGURE n" (ChartDisplay top-[4.25rem]), so a full py-16 here
             stacked into a ~150px hole between text and figure. -->
        <div class="mx-auto w-[88vw] max-w-200 pt-14 lg:py-28 {sub.charts.length > 0 ? 'pb-0' : 'pb-14'}">
          <!-- Sub-chapter title: centred, no underline at any size. The chapter title
               now lives in the dark opener band above, so the first
               sub-chapter opens its block like any other. The id is on this
               wrapper so a TOC jump lands on the sub-chapter title; scroll-mt
               keeps air above. -->
          <div id={sub.id} class="scroll-mt-20 lg:scroll-mt-24">
            <h3
              class="text-center text-xl leading-tight font-medium text-balance md:text-2xl lg:text-[2rem]"
            >
              {sub.title}
            </h3>

            <div class="mx-auto mt-6 max-w-[40rem] md:mt-10 lg:mt-14">
              {@render copy(sub)}
            </div>
          </div>
        </div>
      </div>
      {#if sub.charts.length > 0}
        <ScrollySection pairs={sub.charts} sectionId={sub.id} chapterId={section.id} />
      {/if}
      {#each sub.passages as passage, p (p)}
        <!-- A passage: the sub-chapter's copy continuing between two figures,
             same column and air as the block above, no heading. -->
        <div class="bg-base-200" data-surface="text">
          <div class="mx-auto w-[88vw] max-w-[40rem] pt-14 lg:py-28 {passage.charts.length > 0 ? 'pb-0' : 'pb-14'}">
            {@render copy(passage)}
          </div>
        </div>
        {#if passage.charts.length > 0}
          <ScrollySection
            pairs={passage.charts}
            sectionId={sub.id}
            chapterId={section.id}
            anchorOffset={passage.anchorOffset}
          />
        {/if}
      {/each}
      {/each}
    </section>
  {/each}
</main>

<!-- THE ENDING SCREEN (2026-09-30), at every size. The last sub-chapter's
     text ends on its own natural height; the next scroll brings a screen of
     its own, a bookend to the cover: the same ground, nothing above but
     empty space, then the colophon the report closes on — title, publisher
     and year, and the two actions ("option C", picked 2026-09-30 from six
     endings). Ending screen + footer together fill exactly one small
     viewport (min-h-svh, like the cover), so the footer sits on the bottom
     edge and the colophon is centred in the room above it.
     STACKED AT EVERY SIZE — title, publisher · year, then the buttons. The
     type scales up from md so the block holds a desktop screen: the title
     goes 20 → 32 → 44px, near the chapter titles (52px at lg). (It was a
     row from md, title left and buttons right, at phone type size: on a
     desktop screen it read as too small, 2026-09-30.) The buttons keep
     their size.
     data-report-end tells ChapterRail to leave here rather than at the
     footer. -->
<div class="relative flex min-h-svh flex-col bg-secondary">
  <!-- The cover's street map returns and fills the WHOLE screen: the header
       and the footer lie on top of it with no bar of their own. The colophon
       is on the opposite side from the cover (option J, 2026-11-08), so the
       two screens mirror each other. The map's credit is in the footer. -->
  <StreetMap side="right" credit={false} />
  <section
    data-report-end
    aria-label="End of report"
    class="relative flex flex-1 items-end px-[6vw] py-20 font-sans text-white md:items-center md:justify-end"
  >
    <div class="relative flex flex-col gap-6 md:w-[34vw] md:gap-8 lg:gap-10">
      <div>
        <!-- Satoshi bold, like the cover title it bookends. -->
        <p
          class="font-serif text-2xl leading-snug font-bold text-balance md:text-[2.25rem] md:leading-[1.12] lg:text-[3rem] lg:leading-[1.08] lg:tracking-[-0.01em]"
        >
          {reportTitle}
        </p>
        <p class="mt-1.5 text-sm md:mt-3 md:text-base lg:text-lg">
          {publisherLine}
        </p>
      </div>
      <!-- "Full report" is an exact copy of the figures' PNG button
           (FigureFooter.svelte) — outline = download. "More from …" is the
           Index button's twin (Header.svelte) — soft fill = opens something;
           new tab, so the report stays open. EQUAL WIDTH: the stack is w-max
           and stretches both to the wider one, labels centred; both 32px
           tall at every size (Full report does not shrink on phones like the
           PNG button, so the pair stays matched). -->
      <div class="flex w-max shrink-0 flex-col items-stretch gap-2.5">
        <a
          href={pdfHref}
          download
          class="group inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-white/55 px-4 font-sans text-xs tracking-wide text-white transition-colors duration-200 hover:border-white active:border-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="size-3.5">
            <path fill-rule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v6.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V3.75A.75.75 0 0 1 10 3ZM3.75 13a.75.75 0 0 1 .75.75v1.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A2.25 2.25 0 0 1 14.75 17h-9.5A2.25 2.25 0 0 1 3 14.75v-1.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
          </svg>
          <RollText text="Full report" />
        </a>
        <a
          href={moreHref}
          target="_blank"
          rel="noopener"
          class="group h-8 cursor-pointer rounded-md bg-white/15 px-4 py-1.5 text-center font-display text-sm tracking-wide text-white uppercase transition-colors duration-200 hover:bg-white/25 active:bg-white/30"
        >
          <RollText text={moreLabel} />
        </a>
      </div>
    </div>
  </section>

  <Footer />
</div>
