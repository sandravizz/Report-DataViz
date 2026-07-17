<script>
  import { page } from "$app/state";
  import { figures } from "$lib/data/index.js";

  const meta = {
    title: "Ensuring a Skilled Renewable Energy and Energy Efficiency Workforce — An Interactive Report",
    description:
      "An interactive report by the International Energy Agency on employment trends and skills needs across renewable energy, grids and energy efficiency. Web development and data visualization by SandraViz.",
  };
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Header from "$lib/components/Header.svelte";
  import Landing from "$lib/components/Landing.svelte";
  import Footer from "$lib/components/Footer.svelte";

  // Chapter 1 of the IEA report "Ensuring a Skilled Renewable Energy and
  // Energy Efficiency Workforce" (2026). Section titles and intro paragraphs
  // are the report's own text, verbatim (CC BY 4.0) — `intro` takes an array
  // of paragraphs. Ids are assigned automatically (chapter-1, chapter-2, ...)
  // below.
  const sections = [
    {
      kicker:
        "Chapter 1. Employment trends in renewable energy, grids and energy efficiency",
      title:
        "Employment opportunities are growing in renewable energy, grids and energy efficiency",
      intro: [
        "The energy sector has become a driver of employment growth. In 2024, global energy employment grew 2.2% year-on-year, underpinned by energy infrastructure investments, nearly double the economy-wide rate of 1.3%. Since 2019, the energy sector added on average more than 1 million jobs annually, which marks a shift compared to the period between 2015 and 2019, when the sector created around 300 000 jobs per year on average.",
        "Electricity is playing an increasingly central role in energy spending and employment. Power generation investments increased by 70% between 2015 and 2024, and employment in the sector grew 27%, driven by solar photovoltaics (PV) and wind. This shift reflects that the energy sector has entered the Age of Electricity, where electricity is increasingly central to modern economies due to rising consumption driven by industry, electric vehicles, air conditioning and data centres among other factors.",
        "In the States Policies Scenario (STEPS) of the World Energy Outlook (WEO) 2025, labour demand in renewable energy, grids and energy efficiency reaches 35 million workers by 2035. However, the IEA Industry Employment Survey 2025 found that 66% of companies in these subsectors were already experiencing labour and skills shortages highlighting that efforts are required urgently to attract and train more workers in these sectors now.",
      ],
      charts: [figures.regionalWorkforceChange],
    },
    {
      title: "The power sector is driving employment growth in the energy sector",
      intro: [
        "In 2024, the power sector became the largest energy sector employer with 22.6 million workers, which includes generation (fossil, renewable and nuclear) and grids (transmission, distribution and storage). Power generation employment specifically, which in our definition excludes grids, grew at an annual average growth rate of 5.1% between 2019 and 2024, and reached 14.2 million workers, while grid employment grew by 1.9% on average, and reached 8.5 million workers.",
        "Employment in renewable energy, grids and energy efficiency grew at a steady pace between 2019 and 2024, averaging 2.8% per annum, apart from 2020 when the Covid-19 pandemic disrupted markets and slowed activity. In 2024, almost 40% of energy workers were employed in these areas.",
      ],
      charts: figures.workforceGrowthIndexSteps,
    },
    {
      title:
        "Spotlight: Renewable energy, grids and energy efficiency employment opportunities in Southeast Asia",
      intro: [
        "With a fast-growing population and expanding industrialisation and urbanisation, energy demand in Southeast Asia is growing rapidly and will represent 20% of the world’s global energy demand growth in the next decade. Renewable energy supply in Southeast Asia has almost tripled since 2000 reaching around 20% of the overall energy mix in 2024. In the STEPS, clean energy meets over 40% of incremental demand growth by 2035. This will in turn impact energy employment in renewable energy, grids and energy efficiency, where the region currently accounts for 5% of the global workforce. Workforce mapping and skills planning are necessary to ensure an adequately skilled labour force to meet this new demand.",
        "In the STEPS, employment in renewable energy, grids and energy efficiency in Southeast Asia rises to 1.8 million workers by 2035. Workforce expansion is supported by policy measures, such as the ASEAN Plan of Action for Energy Cooperation (APAEC) 2026-2030, aiming to reach a 45% share of renewables in the electricity mix by 2030, as well as national strategies with renewable energy and energy efficiency targets in Indonesia, the Philippines and Malaysia.",
      ],
      charts: [figures.southeastAsiaSteps],
    },
    {
      title: "Emerging and developing economies saw the strongest employment growth",
      intro: [
        "Global energy employment in renewable energy, grids and energy efficiency increased by 3% in 2024 (year-on-year) with the strongest growth in EMDE. Employment growth has varied from region to region, with some countries seeing job creation linked to national energy initiatives and dedicated investment, while others have experienced job losses or employment stagnation linked to a number of constraints such as high production costs and the high cost of capital. As countries change their national energy mixes, energy transitions will impact employment needs in different energy subsectors.",
        "China’s renewable energy, grids and energy efficiency sectors saw sustained job growth between 2019 and 2024, averaging over 4% per year, far outpacing economy-wide employment growth which fell to just below zero over the same period. China accounts for 34% of the global renewable energy, grids and energy efficiency workforce, and in the sector, it employed about 10 million people in 2024. China also remains the dominant global solar PV sector employer, employing 60% of the global workforce.",
      ],
      charts: [figures.workforceByRegion],
    },
    {
      title:
        "Employment in renewable energy, grids and energy efficiency rises by 5.6 million jobs by 2035 in the STEPS",
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
  <meta property="og:image" content="{page.url.origin}/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={meta.title} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="twitter:image" content="{page.url.origin}/og-image.jpg" />
</svelte:head>

<Header links={tocLinks} />

<div id="top">
  <Landing />

  <div id="charts"></div>
  {#each sections as section (section.id)}
    <section id={section.id} class="h-[140vh] font-sans text-base-content">
      <div class="sticky top-0 h-screen overflow-y-auto bg-base-100">
        <div class="flex min-h-full">
          <div
            class="mx-auto my-auto w-[88vw] py-24 lg:ml-[calc(43%-400px)] lg:w-200"
          >
            {#if section.kicker}
              <p class="mb-3 text-xs font-medium tracking-wide text-primary uppercase">
                {section.kicker}
              </p>
            {/if}
            <h2 class="text-2xl font-semibold sm:text-3xl">{section.title}</h2>
            {#each section.paragraphs as paragraph (paragraph)}
              <p class="mt-4 text-lg leading-relaxed text-base-content/80">
                {paragraph}
              </p>
            {/each}
          </div>
        </div>
      </div>
    </section>
    {#if section.charts.length > 0}
      <ScrollySection pairs={section.charts} />
    {/if}
  {/each}
</div>

<Footer />
