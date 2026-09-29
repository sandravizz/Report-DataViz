<script>
  import { page } from "$app/state";
  import { figures } from "$lib/data/index.js";

  const meta = {
    title: "IDA 2030: Cliff or no cliff? — An Interactive Report",
    description:
      "An interactive report by the Finance for Development Lab on IDA's growth, its financing, and whether disbursements face a cliff by 2030. Web development and data visualization by SandraViz.",
  };
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Header from "$lib/components/Header.svelte";
  import ChapterRail from "$lib/components/ChapterRail.svelte";
  import Landing from "$lib/components/Landing.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import CursorDot from "$lib/components/CursorDot.svelte";

  // Sections follow the IDA_GIZ_KAdequacyModel presentation's narrative:
  // IDA's growth, financing that growth, and IDA's future.
  //
  // THREE LAYERS: chapter → sub-chapter → figure. A chapter carries the
  // display title (its `intro` is kept as source copy but no longer rendered —
  // the text block leads with each sub-chapter's lede instead); the figures
  // live in its sub-chapters, each with its own heading, optional intro
  // (the lede), body paragraphs (LOREM by default) and its own pinned figure
  // run. A
  // sub-chapter may have no figures (text only). A report that wants no
  // sub-chapters uses a single untitled one per chapter.
  //
  // The sub-chapter split below is a DESIGN TEST for the three-layer TOC, not
  // FDL's structure: titles and intros are placeholders drawn from the
  // chapter copy, with no numbers of their own.
  //
  // Ids are assigned automatically below: chapter-1, its sub-chapters
  // chapter-1-1, chapter-1-2, and their figure anchors chapter-1-1-chart-0...
  // Placeholder body copy for every sub-chapter until FDL's text is in.
  const LOREM = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  ];

  const sections = assignIds([
    {
      title: "Financing IDA's Growth",
      intro:
        "IDA's balance sheet has grown from about USD 197 billion in 2017 to USD 281 billion in 2025. Most of it is financed by equity, but equity's share of assets is declining — from over 80% in 2017 to 73% in 2025 — as IDA increasingly borrows to fund its growth (Figures 1 and 2).",
      subchapters: [
        {
          title: "A Growing Balance Sheet",
          intro:
            "First the size of the balance sheet, then how much of it equity still finances.",
          charts: [figures.balanceSheetTotalArea, figures.equityShare],
        },
        {
          title: "Growth and Equity Side by Side",
          intro: "Both trends on one figure: the balance sheet grows while equity's share declines.",
          charts: [figures.balanceEquityDouble],
        },
      ],
    },
    {
      title: "IDA's Future: Cliff or No Cliff?",
      intro:
        "The ambition for IDA is to maintain an overall disbursement pace similar to the past 10 years. The alternative — the IDA cliff — is flat or declining disbursements (Figure 3).",
      subchapters: [
        {
          title: "The Objective",
          intro: "Maintaining an overall disbursement pace similar to the past decade.",
          charts: [figures.idaObjective],
        },
        {
          // Text-only on purpose: the layout and the TOC have to handle a
          // sub-chapter without figures.
          title: "The Alternative: The IDA Cliff",
          intro: "The alternative is flat or declining disbursements — the IDA cliff.",
          charts: [],
        },
      ],
    },
    {
      title: "The Largest Fund for Poor Countries",
      intro:
        "IDA is the largest source of concessional finance for the world's poorest countries: its loans represent 40% of all disbursements to eligible countries, and its grants around 20% of all grants they receive (Figure 4).",
      subchapters: [
        // The two reveal steps of Figure 4, one per sub-chapter for the test.
        // Each step is a complete figure, so each still draws on its own.
        {
          title: "Loans: 40% of Disbursements",
          intro: "Lorem ipsum dolor sit amet, consectetur adipiscing elit — sed do eiusmod tempor incididunt ut labore.",
          charts: [figures.idaLoansAreaSteps[0]],
        },
        {
          title: "Grants: A Fifth of All Grants",
          intro: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
          charts: [figures.idaLoansAreaSteps[1]],
        },
        {
          // Text-only on purpose: the report must END ON TEXT, never on a
          // figure — a pinned figure running straight into the footer read
          // as the page stopping mid-thought. Placeholder closing copy until
          // FDL's conclusion is in.
          title: "Looking Ahead",
          intro: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
          charts: [],
        },
      ],
    },
  ]);

  // NUMBERS THE FIGURES: one plain series in reading order — Figure 1, 2,
  // 3… — overriding whatever `number` the figure file carries (the source
  // paper's "Figures 1 & 2", "Figure 4a"…). Every place a number is shown
  // (figure eyebrow, chapter rail, PNG export) reads this one. Figures are
  // copied, not mutated: the data objects are shared module exports.
  function assignIds(chapters) {
    let figureCount = 0;
    return chapters.map((chapter, i) => {
      const id = `chapter-${i + 1}`;
      const subchapters = chapter.subchapters.map((sub, k) => {
        const charts = sub.charts.map((c) => ({ ...c, number: `Figure ${++figureCount}` }));
        return { body: LOREM, ...sub, charts, id: `${id}-${k + 1}` };
      });
      return { ...chapter, id, subchapters };
    });
  }

  // ONE GROUND EVERYWHERE (2026-09-29). Text and pinned figures both sit on
  // base-200, the near-white teal (#f5f7f7). There used to be a white figure
  // surface with a fade painted into each text block's background on the way
  // in and out; together with the rail's highlight changing, the background
  // switching read as noise, so it went. No ramps, no second surface.
</script>

<svelte:head>
  <meta property="og:type" content="website" />
  <meta property="og:title" content={meta.title} />
  <meta property="og:description" content={meta.description} />
  <meta property="og:url" content={page.url.origin + page.url.pathname} />
  <meta property="og:image" content="{page.url.origin}/og-image-fdl.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={meta.title} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="twitter:image" content="{page.url.origin}/og-image-fdl.jpg" />
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
<ChapterRail {sections} />

<!-- `main` rather than a bare div: the page had no landmark at all, so
     "jump to main content" had nothing to jump to. tabindex="-1" is what lets
     the skip link above actually move focus here (a container is not focusable
     on its own); it does NOT put the element in the tab order. The id stays
     `top` because Header's logo links to it. -->
<main id="top" tabindex="-1">
  <Landing />

  <div id="charts"></div>
  {#each sections as section, i (section.id)}
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
      {#each section.subchapters as sub, k (sub.id)}
      <!-- data-surface marks the sub-chapter's text block; ChapterRail reads
           it to tell which sub-chapter the reader is in. -->
      <div class="bg-base-200" data-surface="text">
        <!-- Report-style text block, after the Silver Linings reference:
             a centred display title per chapter, a centred underlined
             sub-chapter title under it, then a lede one tier bigger than the
             body and the body copy itself. Everything shares one centred
             column; the lede and body keep a ~65-character measure inside it.
             py-16/lg:py-28 sets the air above and below the copy directly —
             the block is natural height (see docs/house-style.md). -->
        <div class="mx-auto w-[88vw] max-w-200 py-16 lg:py-28">
          <!-- The chapter title is the one piece of display type in the
               report body: 32px climbing to 52px, leading 1.06 and a hair of
               negative tracking so a two-line title reads as one object. -->
          {#if k === 0}
          <h2
            class="text-center text-[2rem] leading-[1.06] font-semibold tracking-[-0.012em] text-balance sm:text-[2.5rem] lg:text-[3.25rem]"
          >
            {section.title}
          </h2>
          {/if}

          <!-- Sub-chapter title: centred and underlined like a running
               subtitle under the chapter title. Under a chapter opening it
               gets a large gap so it reads as the start of a part, not a
               second line of the title. The id is on this wrapper so a TOC
               jump lands on the sub-chapter title; scroll-mt keeps air above. -->
          <div
            id={sub.id}
            class="scroll-mt-12 lg:scroll-mt-24 {k === 0 ? 'mt-12 lg:mt-20' : ''}"
          >
            <h3
              class="text-center text-2xl leading-tight font-medium text-balance underline decoration-1 underline-offset-[0.2em] lg:text-[2rem]"
            >
              {sub.title}
            </h3>

            <div class="mx-auto mt-10 max-w-[40rem] lg:mt-14">
              {#if sub.intro}
                <!-- The lede: one tier above the body, full ink, tight
                     leading — the line that says what the sub-chapter is
                     about. Rendered as HTML so it can carry a
                     `mark.accent-mark`; the strings are editorial copy from
                     this file, nothing fetched or user-supplied. -->
                <p
                  class="text-[1.375rem] leading-snug text-base-content/90 lg:text-[1.625rem]"
                >
                  {@html sub.intro}
                </p>
              {/if}
              <!-- Body copy. The /80 stays: base-content is #000000 on this
                   branch and house style rules out pure black under
                   long-form reading (docs/type-rendering.md rule 4). -->
              {#each sub.body ?? [] as paragraph, j (j)}
                <p
                  class="text-lg leading-[1.85] text-base-content/80 {j === 0 && sub.intro
                    ? 'mt-8'
                    : j > 0
                      ? 'mt-6'
                      : ''}"
                >
                  {@html paragraph}
                </p>
              {/each}
            </div>
          </div>
        </div>
      </div>
      {#if sub.charts.length > 0}
        <ScrollySection pairs={sub.charts} sectionId={sub.id} chapterId={section.id} />
      {/if}
      {/each}
    </section>
  {/each}
</main>

<Footer />
