<script>
  import { page } from "$app/state";
  import { figures } from "$lib/data/index.js";

  const meta = {
    title: "Ensuring a Skilled Renewable Energy and Energy Efficiency Workforce: An Interactive Report",
    description:
      "I'm Sandra, a data visualization designer and developer. I build interactive, visualization-first reports for the web (including mobile) as well as static formats.",
  };
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Header from "$lib/components/Header.svelte";
  import ChapterRail from "$lib/components/ChapterRail.svelte";
  import Landing from "$lib/components/Landing.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import CursorDot from "$lib/components/CursorDot.svelte";

  const sections = [
    {
      kicker:
        "Chapter 1. Employment trends in renewable energy",
      title:
        "Employment opportunities are growing in renewable energy, grids and energy efficiency",
      shortTitle: "Employment opportunities are growing",
      intro: [
        "The energy sector has become a driver of employment growth. In 2024, global energy employment grew 2.2% year-on-year, underpinned by energy infrastructure investments, nearly double the economy-wide rate of 1.3%. Since 2019, the energy sector added on average more than 1 million jobs annually, which marks a shift compared to the period between 2015 and 2019, when the sector created around 300 000 jobs per year on average.",
        "Electricity is playing an increasingly central role in energy spending and employment. Power generation investments increased by 70% between 2015 and 2024, and employment in the sector grew 27%, driven by solar photovoltaics (PV) and wind. This shift reflects that the energy sector has entered the Age of Electricity, where electricity is increasingly central to modern economies due to rising consumption driven by industry, electric vehicles, air conditioning and data centres among other factors.",
        "In the States Policies Scenario (STEPS) of the World Energy Outlook (WEO) 2025, labour demand in renewable energy, grids and energy efficiency reaches 35 million workers by 2035. However, the IEA Industry Employment Survey 2025 found that 66% of companies in these subsectors were already experiencing labour and skills shortages highlighting that efforts are required urgently to attract and train more workers in these sectors now.",
      ],
      charts: [figures.regionalWorkforceChange],
    },
    {
      title: "The power sector is driving employment growth in the energy sector",
      shortTitle: "The power sector",
      intro: [
        "In 2024, the power sector became the largest energy sector employer with 22.6 million workers, which includes generation (fossil, renewable and nuclear) and grids (transmission, distribution and storage). Power generation employment specifically, which in our definition excludes grids, grew at an annual average growth rate of 5.1% between 2019 and 2024, and reached 14.2 million workers, while grid employment grew by 1.9% on average, and reached 8.5 million workers.",
        "Employment in renewable energy, grids and energy efficiency grew at a steady pace between 2019 and 2024, averaging 2.8% per annum, apart from 2020 when the Covid-19 pandemic disrupted markets and slowed activity. In 2024, almost 40% of energy workers were employed in these areas.",
      ],
      charts: figures.workforceGrowthIndexSteps,
    },
    {
      title:
        "Spotlight: Renewable energy, grids and energy efficiency employment opportunities in Southeast Asia",
      shortTitle: "Spotlight: Southeast Asia",
      intro: [
        "With a fast-growing population and expanding industrialisation and urbanisation, energy demand in Southeast Asia is growing rapidly and will represent 20% of the world’s global energy demand growth in the next decade. Renewable energy supply in Southeast Asia has almost tripled since 2000 reaching around 20% of the overall energy mix in 2024. In the STEPS, clean energy meets over 40% of incremental demand growth by 2035. This will in turn impact energy employment in renewable energy, grids and energy efficiency, where the region currently accounts for 5% of the global workforce. Workforce mapping and skills planning are necessary to ensure an adequately skilled labour force to meet this new demand.",
        "In the STEPS, employment in renewable energy, grids and energy efficiency in Southeast Asia rises to 1.8 million workers by 2035. Workforce expansion is supported by policy measures, such as the ASEAN Plan of Action for Energy Cooperation (APAEC) 2026-2030, aiming to reach a 45% share of renewables in the electricity mix by 2030, as well as national strategies with renewable energy and energy efficiency targets in Indonesia, the Philippines and Malaysia.",
      ],
      charts: [figures.southeastAsiaSteps],
    },
    {
      title: "Emerging and developing economies saw the strongest employment growth",
      shortTitle: "Emerging and developing economies",
      intro: [
        "Global energy employment in renewable energy, grids and energy efficiency increased by 3% in 2024 (year-on-year) with the strongest growth in EMDE. Employment growth has varied from region to region, with some countries seeing job creation linked to national energy initiatives and dedicated investment, while others have experienced job losses or employment stagnation linked to a number of constraints such as high production costs and the high cost of capital. As countries change their national energy mixes, energy transitions will impact employment needs in different energy subsectors.",
        "China’s renewable energy, grids and energy efficiency sectors saw sustained job growth between 2019 and 2024, averaging over 4% per year, far outpacing economy-wide employment growth which fell to just below zero over the same period. China accounts for 34% of the global renewable energy, grids and energy efficiency workforce, and in the sector, it employed about 10 million people in 2024. China also remains the dominant global solar PV sector employer, employing 60% of the global workforce.",
      ],
      charts: [figures.workforceByRegionA, figures.workforceByRegionB],
    },
    {
      title:
        "Employment in renewable energy, grids and energy efficiency rises by 5.6 million jobs by 2035 in the STEPS",
      shortTitle: "5.6 million more jobs by 2035",
      intro: [
        "In the STEPS new energy employment opportunities grow through 2035 with jobs in renewable energy, grids and energy efficiency growing roughly three times faster than overall energy sector employment. As a result, renewable energy, grids and energy efficiency employment rises from around 30 million jobs in 2024 to approximately 35 million by 2035 requiring efforts to attract more people to the energy sector and to train them. Around four in ten energy workers by 2035 are employed in renewable energy, grids and energy efficiency making these sectors a major energy employment creator.",
      ],
      charts: [figures.workforceBySectorSteps],
    },
  ].map((section, i) => ({
    ...section,
    id: `chapter-${i + 1}`,
    paragraphs: Array.isArray(section.intro) ? section.intro : [section.intro],
  }));

  // The fade between the chapter ground and the white figure surface is
  // painted ON THE CHAPTER BLOCK, not as a spacer div between the two.
  //
  // That is the whole point. A dedicated band element can only make the fade
  // longer by making the GAP longer — at 384px it left most of a screen of
  // empty page between a chapter's last line and the figure under it. As a
  // background on the block itself the ramp costs no height whatsoever: it
  // runs up behind the copy, which is dark enough that a light-to-light wash
  // underneath changes nothing about reading it. So the fade can be as long
  // as it likes and the text still sits directly above its figure.
  //
  // The stops are PERCENTAGES, so the ramp scales with the chapter: a long
  // three-paragraph chapter gets a ~350px fade, a short one a proportionally
  // shorter one, and neither ever shows a seam.
  const FIGURE_SURFACE = "var(--color-base-100)";
  const TEXT_SURFACE = "var(--color-base-200)";

  // `rampTop` is false for chapter 1 — it follows the landing screen, which is
  // already on the chapter ground, so there is nothing to fade from.
  // `rampBottom` is false when no figure follows.
  function textSurface(rampTop, rampBottom) {
    const stops = rampTop
      ? [`${FIGURE_SURFACE} 0%`, `${TEXT_SURFACE} 35%`]
      : [`${TEXT_SURFACE} 0%`];
    stops.push(
      ...(rampBottom
        ? [`${TEXT_SURFACE} 65%`, `${FIGURE_SURFACE} 100%`]
        : [`${TEXT_SURFACE} 100%`])
    );
    return `background-image:linear-gradient(to bottom,${stops.join(",")})`;
  }
</script>

<svelte:head>
  <meta property="og:type" content="website" />
  <meta property="og:title" content={meta.title} />
  <meta property="og:description" content={meta.description} />
  <meta property="og:url" content={page.url.origin + page.url.pathname} />
  <meta property="og:image" content="{page.url.origin}/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={meta.title} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="twitter:image" content="{page.url.origin}/og-image.jpg" />
</svelte:head>

<!-- The accent dot cursor, which applies to the COVER ONLY: it follows the
     `data-accent-cursor` attribute on Landing.svelte's root section, and the
     report proper keeps the system pointer. Mounts itself only for a real
     mouse — see CursorDot.svelte. Nothing else on the page depends on it. -->
<CursorDot />

<div id="top" class="flex min-h-screen flex-col">
  <Header {sections} />
  <Landing />
</div>

<ChapterRail {sections} />

<div id="charts"></div>
{#each sections as section, i (section.id)}
  <!-- Chapter text is NOT pinned and NOT sized to the viewport: only the
       figure surface in ScrollySection sticks. This is long-form copy, so the
       block is exactly as tall as its own paragraphs — a three-paragraph
       chapter runs past a screen, a one-paragraph chapter is much shorter.
       You scroll until the text ends and the next section begins; nothing is
       padded out to fill a screen it does not need. -->
  <section id={section.id} class="font-sans text-base-content">
    <!-- The fade into and out of the white figure surface lives in this
         block's own background — see textSurface() above. -->
    <div
      class="bg-base-200"
      style={textSurface(i > 0 && sections[i - 1].charts.length > 0, section.charts.length > 0)}
    >
      <div class="mx-auto w-[88vw] py-16 lg:w-200 lg:py-28">
        {#if section.kicker}
          <p class="mb-5 text-xs tracking-wide text-base-content/50 uppercase">
            {section.kicker}
          </p>
        {/if}
        <h2
          class="font-display text-3xl leading-tight font-semibold text-balance sm:text-4xl lg:text-5xl lg:leading-[1.08]"
        >
          {section.title}
        </h2>
        <!-- mt-8/lg:mt-10 opens the gap under the heading; the paragraphs
             after the first sit on a tighter mt-4, half a line of extra air.

             Paragraphs render as HTML so one can carry a `mark.accent-mark` —
             the accent underline. Safe here and nowhere near a general licence:
             every string in `sections` above is editorial copy authored in this
             file, never anything fetched, routed or user-supplied. -->
        {#each section.paragraphs as paragraph, pIndex (pIndex)}
          <p
            class="text-lg leading-relaxed text-base-content/80 lg:text-xl {pIndex === 0
              ? 'mt-8 lg:mt-10'
              : 'mt-4'}"
          >
            {@html paragraph}
          </p>
        {/each}
      </div>
    </div>
  </section>
  {#if section.charts.length > 0}
    <ScrollySection pairs={section.charts} sectionId={section.id} />
  {/if}
{/each}

<Footer>
  {#snippet disclosure()}
    <p>
      Based on data from International Energy Agency (IEA) 2026, Ensuring a Skilled Renewable
      Energy and Energy Efficiency Workforce,
      <a
        href="https://www.iea.org/reports/ensuring-a-skilled-renewable-energy-and-energy-efficiency-workforce"
        target="_blank"
        rel="noopener"
        class="underline decoration-accent underline-offset-2"
      >https://www.iea.org/reports/ensuring-a-skilled-renewable-energy-and-energy-efficiency-workforce</a>,
      as modified by Sandra Becker. Sandra Becker is solely liable and responsible for this
      derived work, which is not endorsed by the IEA or its Member countries in any manner.
      License: CC BY 4.0.
    </p>
  {/snippet}
</Footer>
