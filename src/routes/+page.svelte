<script>
  import { page } from "$app/state";
  import { figures } from "$lib/data/index.js";

  const meta = {
    title: "State of Private Markets: Q1 2026 | An Interactive Report",
    description:
      "An interactive edition of Carta's State of Private Markets, Q1 2026: down rounds, valuations by stage, and AI's share of venture capital. Web development and data visualization by SandraViz.",
  };
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Header from "$lib/components/Header.svelte";
  import ChapterRail from "$lib/components/ChapterRail.svelte";
  import Landing from "$lib/components/Landing.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import CursorDot from "$lib/components/CursorDot.svelte";
  import DotGrid from "$lib/components/DotGrid.svelte";
  import RollText from "$lib/components/RollText.svelte";

  // The PDF the closing call to action downloads. Drop Carta's file in
  // static/ under this name (or change the path).
  const pdfHref = "/report.pdf";
  // The report's name as the closing colophon prints it.
  const reportTitle = "State of Private Markets: Q1 2026";
  // Where the closing "More from Carta" button sends the reader.
  const moreHref = "https://carta.com/data/";

  // Chapters follow the deck's own sections (contents slide), minus
  // Fundraising Volume (dropped with its figure, Sandra 2026-10-29: too
  // basic): Key Trends, Valuations, AI & Foundational Models, Geography &
  // Industry, Methodology — one figure per chapter, two where the deck's
  // slide drew two measures on two axes and the report splits them.
  //
  // THREE LAYERS: chapter → sub-chapter → figure, as on the other branches.
  // A sub-chapter may have no figures (text only); `passages` continue a
  // sub-chapter after its figure run with a heading-less text block and
  // their own figures. Ids are assigned automatically below.
  //
  // COPY: every sentence and number is Carta's own — the Highlights slide,
  // the slide headlines and the values printed on the slides. Nothing is
  // read off a chart into the copy (see docs/carta-brand.md). Body copy
  // defaults to nothing: no placeholder text on this branch.
  //
  // DEMO CUT (2026-10-27): only three chapters are built out — `locked`
  // chapters keep their place in the Index (the full outline, greyed and
  // not clickable) but are not rendered, not in the rail and not numbered.
  // Shown: Fundraising Volume, Key Trends and AI (the lead highlight). The
  // text-only "Terms Shift Toward Founders" and "Priced in Three Tiers" and
  // the passage after Figure 1 were cut (Sandra,
  // 2026-10-27), so the demo ends on Figure 3. Drop `locked` to open a
  // chapter. Chapters keep their full-report number (`num`) everywhere.
  const sections = assignIds([
    {
      title: "Key Trends",
      subchapters: [
        {
          title: "Down Rounds Are Low",
          intro:
            "The down-round rate fell to <mark class=\"accent-mark\">11.4% in Q1 2026</mark>. This is back in line with 2019 and 2020 levels.",
          body: [
            "Before the bull market, before the reset, before the recovery. The three-year hangover from the valuation lows of 2022 may now be in the past.",
          ],
          charts: [figures.downRounds],
        },
      ],
    },
    {
      title: "Valuations",
      locked: true,
      subchapters: [
        {
          title: "Valuations by Stage",
          intro:
            "Over the last 12 months, the median seed round was priced at <mark class=\"accent-mark\">$21M post-money</mark>, the median Series D at $540M.",
          body: [
            "In Q1 2026 alone, the median post-money valuation stood at $62.8M for Series A, $177.0M for Series B and $385M for Series C. At the 90th percentile, Series B reached $1B and Series D $9.1B.",
          ],
          charts: [figures.postMoneyByStage],
        },
      ],
    },
    {
      title: "AI & Foundational Models",
      subchapters: [
        {
          title: "AI Crosses 60% of Capital",
          intro:
            "Over 60 cents of each dollar of venture capital invested on Carta in Q1 2026 went to AI companies, <mark class=\"accent-mark\">the highest share recorded to date</mark>.",
          body: [
            "Foundational model companies drove much of this, accounting for 14.2% of total capital and nearly a quarter of AI capital. In SaaS, 83% of capital went to AI startups.",
          ],
          charts: [figures.preMoneyAiVsNonAi],
        },
      ],
    },
    {
      title: "Geography & Industry",
      subchapters: [
        {
          title: "Where AI Capital Goes",
          intro:
            "The Bay Area ranks first for investment in AI: <mark class=\"accent-mark\">70.9% of its capital</mark> went to AI companies, ahead of Austin and Washington, DC.",
          body: [
            "California took 48.0% of all capital invested from Q2 2025 to Q1 2026, and the West region as a whole 55.4%. Behind California, New York (10.3%), Massachusetts (7.9%) and Texas (6.6%) receive the largest shares.",
          ],
          charts: [figures.capitalByRegion],
        },
      ],
    },
    {
      // The deck's own methodology, verbatim — and the text the report
      // ends on (a report never ends on a pinned figure).
      title: "Methodology",
      locked: true,
      subchapters: [
        {
          title: "Overview",
          intro:
            "Carta helps more than 50,000 primarily venture-backed companies who have combined to raise more than $1.2 trillion in equity.",
          body: [
            "This study uses an aggregated and anonymized sample of Carta customer data. Companies that have contractually requested that we not use their data in anonymized and aggregated studies are not included in this analysis.",
            "The data presented in this private markets report represents a snapshot as of May 22, 2026. Historical data may change in future studies because there is typically an administrative lag between the time a transaction took place and when it is recorded in Carta. In addition, new companies signing up for Carta's services will increase historical data available for the report.",
          ],
          charts: [],
        },
        {
          title: "Financings",
          body: [
            "Financings include equity deals raised in USD by U.S.-based corporations. The financing \u201cseries\u201d (e.g. Series A) is taken from the share class name in their applicable certificate or articles of incorporation. Financing rounds that don't follow this standard are not included in any data shown by series but are included in data not shown by series. Primary rounds are defined as the first equity round within a series. Bridge rounds are defined as any round raised after the first round in a given series.",
            "In some cases, convertible notes are raised and converted at various discounted prices within a series (e.g. Series A-1, Series A-2, Series A-3). In these cases, converted securities are not included in cash raised, and only the post-money valuation of the new money is included.",
          ],
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
      return { ...chapter, id, num: i + 1, subchapters };
    });
  }

  // The chapters the demo renders (body and rail); the Index gets them all.
  const shown = sections.filter((s) => !s.locked);
  const openIds = new Set(shown.flatMap((s) => s.subchapters.map((sub) => sub.id)));

  // THE HIGHLIGHTS, from the "Q1 highlights" list on Carta's report page
  // (carta.com/data/state-of-private-markets-q1-2026/): their bold lead-ins,
  // three of the four, each cut to its first sentence(s) so the section stays
  // a short summary on the way to the figures (Sandra, 2026-10-27). Still
  // Carta's words, only trimmed. Each lead-in links to the sub-chapter that
  // tells the same story at length.
  // DESKTOP (Sandra, 2026-10-29): all FOUR, in full — `deskTitle` and
  // `deskText` are the deck's own Highlights slide (PDF p. 4), verbatim.
  // `deskOnly` items (the fourth, "New this quarter") are not on phones.
  const highlights = [
    {
      title: "AI crosses 60% of capital",
      text: "Over 60 cents of each dollar of venture capital investment on Carta in Q1 2026 went to AI companies, the highest share recorded to date.",
      deskTitle: "AI crosses 60% of capital",
      deskText:
        "Over 60 cents of each dollar of venture capital investment on Carta in Q1 2026 went to AI companies, the highest share recorded to date. Foundational model companies specifically drove much of this, accounting for 14.2% of total capital and nearly a quarter of AI capital. In SaaS, 83% of capital went to AI startups.",
      href: "#chapter-3-1",
    },
    {
      title: "Down rounds at historical lows",
      text: "The down-round rate fell to 11.4% in Q1. This is back in line with 2019 and 2020 levels.",
      deskTitle: "Down rounds are low",
      deskText:
        "The down-round rate fell to 11.4% in Q1. This is back in line with 2019 and 2020 levels. Before the bull market, before the reset, before the recovery. The three-year hangover from the valuation lows of 2022 may now be in the past.",
      href: "#chapter-1-1",
    },
    {
      title: "Series B and Series C valuations rising",
      text: "While early-stage primary valuations softened, Series B and Series C primary pre-money valuations are up 17.2% and 12.5%, respectively, since Q1 2025.",
      deskTitle: "Series B & Series C vals rising",
      deskText:
        "While early-stage primary valuations softened, Series B and Series C primary pre-money valuations are up 17.2% and 12.5%, respectively, since Q1 2025. This may be because AI companies are maturing and moving toward later stages after promising early wins.",
      href: "#chapter-2-2",
    },
    {
      // The three tables are Figure 7's three panels (AI chapter).
      title: "New this quarter",
      deskTitle: "New this quarter",
      deskText:
        "Three side-by-side tables breaking out non-AI, AI applied, and AI foundational model companies across every stage from seed to Series E+. Post-money valuation, round size, and pre-money valuation. Q1 2025 versus Q1 2026. The clearest picture yet of how differently these three categories are being priced right now.",
      href: "#chapter-3-1",
      deskOnly: true,
    },
  ];

  // Each chapter opener's title element, for its dot grid to cut a window
  // around (DotGrid `clear`).
  let chapterTitles = $state([]);

  // ONE GROUND EVERYWHERE: text and pinned figures both sit on base-200,
  // Carta's cream #fcf8f3 — the paper their chart slides are printed on.
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
                   17px on phones, 18px from md (2026-10-19): Plus Jakarta's
                   wide set made 18px read a touch big on a phone; one px
                   down is enough. The lede steps down 1px with it (21px).
                   The /80 stays: Carta's #1a1a1a at /80 is ~10:1 on the
                   cream, well clear of 4.5 (docs/type-rendering.md rule 4). -->
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
     `top` because Header's logo links to it. -->
<main id="top" tabindex="-1">
  <Landing />

  <div id="charts"></div>

  <!-- HIGHLIGHTS (2026-10-27): between the cover and the first chapter
       opener so two dark screens never meet. Kept QUIET on purpose (Sandra,
       2026-10-27): the demo shows off the figures, so this is a short summary
       to scroll past, not a feature. Styled as Carta's own report page does
       it: a serif "Q1 highlights", then a plain bulleted list, each item a
       bold lead-in with a colon running into the sentence. In the chapter
       text column, at the body copy's size. A lead-in whose sub-chapter is
       open links to it and underlines on hover.
       DESKTOP (Sandra, 2026-10-29): one narrow column left the wide screen
       empty either side, so from lg the section takes the page width and
       one full screen, and all four highlights run as four columns in the
       deck's full wording, each under a hairline, its lead-in on a line of
       its own (no colon) over its text. Phones and tablets keep the short
       bulleted list of three. -->
  <section aria-labelledby="highlights" class="bg-base-200 font-sans text-base-content lg:flex lg:min-h-screen lg:items-center">
    <div class="mx-auto w-[88vw] max-w-[40rem] py-12 lg:max-w-[80rem] lg:py-20">
      <h2
        id="highlights"
        class="font-serif text-[2rem] leading-[1.04] font-normal tracking-[-0.01em] sm:text-[2.5rem] lg:text-[3rem]"
      >
        Q1 highlights
      </h2>
      <ul
        class="mt-6 list-disc space-y-4 pl-5 text-[1.0625rem] leading-[1.6] text-base-content/80 marker:text-base-content md:mt-8 md:space-y-5 md:text-lg md:leading-[1.7] lg:mt-12 lg:grid lg:list-none lg:grid-cols-4 lg:gap-x-10 lg:space-y-0 lg:pl-0 lg:text-base lg:leading-[1.65]"
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
      <!-- THE CHAPTER OPENER (2026-10-27): the deck's section-divider slide
           ("Key Trends" etc.) — Carta's near-black ground, the coral
           square-dot grid with a window cut around the chapter title in
           SangBleu. NOT a full screen like the slide or the cover: a band of
           ~half a screen, so it marks the turn of a chapter without stopping
           the read. The window is cut around the title as it wraps
           (DotGrid's `clear`), so a long title on a phone gets a taller
           window rather than squares through it. -->
      <div
        data-chapter-opener
        class="relative flex min-h-[60svh] items-center justify-center bg-night px-5 py-20 text-white sm:min-h-[48svh] sm:px-10 lg:min-h-[58vh]"
      >
        <DotGrid clear={chapterTitles[i]} color="#ff7d55" animate={false} lens />
        <!-- SangBleu Versailles at 400 (the only weight Carta ships), as
             on the deck's section-divider slides.
             PHONES (2026-10-27): 30px and no 14ch cap, so a title like "AI &
             Foundational Models" takes two lines, not three; the band is
             taller there (60svh) so more rows of squares frame it. -->
        <h2
          bind:this={chapterTitles[i]}
          class="relative text-center font-serif text-[1.875rem] leading-[1.04] sm:max-w-[14ch] font-normal tracking-[-0.01em] text-balance sm:text-[3.25rem] lg:text-[4.5rem]"
        >
          {section.title}
        </h2>
      </div>
      {#each section.subchapters as sub (sub.id)}
      <!-- data-surface marks the sub-chapter's text block; ChapterRail reads
           it to tell which sub-chapter the reader is in. -->
      <div class="bg-base-200" data-surface="text">
        <!-- Report-style text block, after the Silver Linings reference:
             a centred display title per chapter, a centred underlined
             sub-chapter title under it, then a lede one tier bigger than the
             body and the body copy itself. Everything shares one centred
             column; the lede and body keep a ~65-character measure inside it.
             py-16/lg:py-28 sets the air above and below the copy directly —
             the block is natural height (see docs/house-style.md).
             PHONES (2026-10-27): no padding below copy that a figure
             follows (text before a chapter band or the ending keeps pb-14).
             The sub-chapter title on phones is one size down, not
             underlined (the accent-mark in the lede is the only underline
             there) and sits mt-6 above the copy. The figure
             screen that follows already opens with its own 68px before
             "FIGURE n" (ChartDisplay top-[4.25rem]), so a full py-16 here
             stacked into a ~150px hole between text and figure. -->
        <div class="mx-auto w-[88vw] max-w-200 pt-14 lg:py-28 {sub.charts.length > 0 ? 'pb-0' : 'pb-14'}">
          <!-- Sub-chapter title: centred and underlined. The chapter title
               now lives in the dark opener band above, so the first
               sub-chapter opens its block like any other. The id is on this
               wrapper so a TOC jump lands on the sub-chapter title; scroll-mt
               keeps air above. -->
          <div id={sub.id} class="scroll-mt-20 lg:scroll-mt-24">
            <h3
              class="text-center text-xl leading-tight font-medium text-balance md:text-2xl md:underline md:decoration-1 md:underline-offset-[0.2em] lg:text-[2rem]"
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

<!-- THE ENDING SCREEN (2026-09-30; band redrawn for Carta 2026-10-15), at every size. The last sub-chapter's
     text ends on its own natural height; the next scroll brings a screen of
     its own, a bookend to the cover: the same ground, nothing above but
     empty space, then the colophon the report closes on — title, publisher
     and year, and the two actions ("option C", picked 2026-09-30 from six
     endings). Ending screen + footer together fill exactly one small
     viewport (min-h-svh, like the cover), so the footer sits on the bottom
     edge and the colophon is centred in the room above it.
     STACKED AT EVERY SIZE — title, publisher · year, then the buttons —
     on the left edge of the chapter text's column (88vw, max 40rem). The
     type scales up from md so the block holds a desktop screen: the title
     goes 20 → 32 → 44px, near the chapter titles (52px at lg). (It was a
     row from md, title left and buttons right, at phone type size: on a
     desktop screen it read as too small, 2026-09-30.) The buttons keep
     their size.
     data-report-end tells ChapterRail to leave here rather than at the
     footer. -->
<div class="flex min-h-svh flex-col bg-base-200">
  <!-- The screen splits at every size: the colophon in the upper part, then
       a low decorative band filling the rest down to the footer (the
       "option E" layout, picked 2026-09-30) — here the cover's dot grid. -->
  <section
    data-report-end
    aria-label="End of report"
    class="flex flex-1 flex-col font-sans text-base-content"
  >
    <div class="pt-[16svh] pb-10 md:pt-[22svh] md:pb-12">
    <div
      class="mx-auto flex w-[88vw] max-w-[40rem] flex-col gap-6 md:gap-8 lg:gap-10"
    >
      <div>
        <!-- SangBleu, like the cover title it bookends. -->
        <p
          class="font-serif text-2xl leading-snug font-normal text-balance md:text-[2.25rem] md:leading-[1.12] lg:text-[3rem] lg:leading-[1.08] lg:tracking-[-0.01em]"
        >
          {reportTitle}
        </p>
        <p class="mt-1.5 text-sm text-base-content/65 md:mt-3 md:text-base lg:text-lg">
          Carta · June 2026
        </p>
      </div>
      <!-- "Full report" is an exact copy of the figures' PNG button
           (FigureFooter.svelte) — outline = download. "More from Carta" is the
           Index button's twin (Header.svelte) — soft fill = opens something;
           new tab, so the report stays open. EQUAL WIDTH: the stack is w-max
           and stretches both to the wider one, labels centred; both 32px
           tall at every size (Full report does not shrink on phones like the
           PNG button, so the pair stays matched). -->
      <div class="flex w-max shrink-0 flex-col items-stretch gap-2.5">
        <a
          href={pdfHref}
          download
          class="group inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-base-content/28 px-4 font-sans text-xs tracking-wide text-base-content/75 transition-colors duration-200 hover:border-base-content/70 hover:text-base-content active:border-base-content/70 active:text-base-content"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="size-3.5 text-base-content">
            <path fill-rule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v6.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V3.75A.75.75 0 0 1 10 3ZM3.75 13a.75.75 0 0 1 .75.75v1.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A2.25 2.25 0 0 1 14.75 17h-9.5A2.25 2.25 0 0 1 3 14.75v-1.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
          </svg>
          <RollText text="Full report" />
        </a>
        <a
          href={moreHref}
          target="_blank"
          rel="noopener"
          class="group h-8 cursor-pointer rounded-md bg-base-content/6 px-4 py-1.5 text-center font-display text-sm tracking-wide text-base-content uppercase transition-colors duration-200 hover:bg-base-content/10 active:bg-base-content/16"
        >
          <RollText text="More from Carta" />
        </a>
      </div>
    </div>
    </div>

    <!-- THE BAND: Carta's coral square-dot grid, the cover's pattern
         returning on the cream to close the report — the bookend the
         engraving panorama was on the findevlab branch. It fades in from
         the top (a CSS mask, the grid itself stays one flat colour) so it
         rises out of the colophon's space rather than starting on a hard
         edge. min-h keeps it a real band on a short or crowded screen.
         Decorative: the colophon above says what the page is. -->
    <div
      class="relative min-h-[30svh] flex-1 [mask-image:linear-gradient(to_bottom,transparent,black_60%)] md:min-h-[34svh]"
    >
      <DotGrid color="#ff7d55" animate={false} lens />
    </div>
  </section>

  <Footer />
</div>
