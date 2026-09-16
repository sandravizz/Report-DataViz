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
  // Ids are assigned automatically (chapter-1, chapter-2, ...) below.
  const sections = [
    {
      title: "Financing IDA's Growth",
      intro:
        "IDA's balance sheet has grown from about USD 197 billion in 2017 to USD 281 billion in 2025. Most of it is financed by equity, but equity's share of assets is declining — from over 80% in 2017 to 73% in 2025 — as IDA increasingly borrows to fund its growth (Figures 1 and 2).",
      charts: [
        // figures.balanceSheetTotal,
        figures.balanceSheetTotalArea,
        figures.equityShare,
        // figures.equityShareArea,
        figures.balanceEquityDouble,
      ],
    },
    {
      title: "IDA's Future: Cliff or No Cliff?",
      intro:
        "The ambition for IDA is to maintain an overall disbursement pace similar to the past 10 years. The alternative — the IDA cliff — is flat or declining disbursements (Figure 3).",
      charts: [figures.idaObjective],
    },
    {
      title: "The Largest Fund for Poor Countries",
      intro:
        "IDA is the largest source of concessional finance for the world's poorest countries: its loans represent 40% of all disbursements to eligible countries, and its grants around 20% of all grants they receive (Figure 4).",
      charts: [
        //figures.idaLoans,
        //figures.idaLoansArea,
        //figures.idaLoansAreaLegend,
        // Scrolly reveal: each of the two shares wipes in on its own step.
        ...figures.idaLoansAreaSteps,
      ],
    },
  ].map((section, i) => ({ ...section, id: `chapter-${i + 1}` }));

  const tocLinks = sections.map((section) => ({
    href: `#${section.id}`,
    label: section.title,
  }));
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

<Header links={tocLinks} />
<ChapterRail {sections} />

<!-- `main` rather than a bare div: the page had no landmark at all, so
     "jump to main content" had nothing to jump to. tabindex="-1" is what lets
     the skip link above actually move focus here (a container is not focusable
     on its own); it does NOT put the element in the tab order. The id stays
     `top` because Header's logo links to it. -->
<main id="top" tabindex="-1">
  <Landing />

  <div id="charts"></div>
  {#each sections as section (section.id)}
    <section id={section.id} class="font-sans text-base-content lg:h-[140vh]">
      <div class="bg-base-200 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div class="lg:flex lg:min-h-full">
          <!-- max-w-200 caps the reading column at the same 800px the desktop
               layout uses. Without it the column is 88vw the whole way up to
               the 1400px breakpoint, so a 1399px window sets 18px type across
               1231px — about 130 characters a line, against the 55–75 that is
               comfortable to read. The cap bites from ~909px upward; below
               that 88vw still governs, so the phone column is unchanged. -->
          <div
            class="mx-auto w-[88vw] max-w-200 py-24 lg:my-auto lg:ml-[calc(43%-400px)] lg:w-200"
          >
            <h2 class="text-2xl font-semibold sm:text-3xl">{section.title}</h2>
            {#if section.intro}
              <!-- The intro is stepped in from the heading (desktop only), so
                   the chapter title reads as the block's left edge and the
                   body text as a subordinate column under it. -->
              <!-- md:text-xl is a TYPE tier only — the scrolly mechanism stays
                   keyed to lg: (see the breakpoint note in tailwind.css). At
                   text-lg the chapter copy was 18px in an 800px column on every
                   screen from 640px up, which is where the "text is small on
                   tablet" report comes from: there was no step between the
                   phone size and the desktop one, so a 1024px iPad read the
                   phone size across a desktop-width column. -->
              <p class="mt-8 text-lg leading-relaxed text-base-content/80 md:text-xl lg:pl-16">
                <!-- Rendered as HTML so the intro can carry a
                     `mark.accent-mark` — the accent underline defined in
                     tailwind.css. The strings come from the chapter list in
                     this file, editorial copy authored in this repo; nothing
                     fetched, routed or user-supplied. -->
                {@html section.intro}
              </p>
            {/if}
          </div>
        </div>
      </div>
    </section>
    {#if section.charts.length > 0}
      <ScrollySection pairs={section.charts} sectionId={section.id} />
    {/if}
  {/each}
</main>

<Footer />
