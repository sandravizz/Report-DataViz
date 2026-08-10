<script>
  import { page } from "$app/state";
  import { figures } from "$lib/data/index.js";

  const meta = {
    title: "World Economy in Summer 2026 — Kiel Institute Economic Outlook",
    description:
      "Reports don't have to be static PDFs. An interactive, visualization-first version of the Kiel Institute's Economic Outlook Nr. 133 (2026 | Q2), built for web and mobile.",
  };
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Header from "$lib/components/Header.svelte";
  import ChapterRail from "$lib/components/ChapterRail.svelte";
  import Landing from "$lib/components/Landing.svelte";
  import Footer from "$lib/components/Footer.svelte";

  // Chapters follow the report's own argument, and each keeps the bold
  // lead-in sentence the report gives that passage as its heading. The intro
  // paragraphs are the report's text, trimmed to what the figure beside them
  // is about; the per-figure `description` in src/lib/data/figures/ carries
  // the rest of the reading alongside the chart itself.
  const sections = [
    {
      id: "world-trade",
      title: "The Iran War Is Clearly Visible in World Trade",
      intro:
        "Global industrial production, which had increased at a moderate pace last year, accelerated in the first two months of this year and in February stood 3.4 percent above its level a year earlier. World trade expanded even more strongly, rising by 7.6 percent over the same period. This momentum was driven mainly by the AI boom; accordingly, Asian economies, where production of the relevant capital goods is concentrated, benefited particularly strongly.",
      charts: [figures.worldTrade],
    },
    {
      id: "industrial-production",
      title: "But the Damage Remains Concentrated in the Gulf Countries",
      intro:
        "In March, with the onset of the war in Iran and the associated closure of the Strait of Hormuz, both industrial production and world trade declined markedly — by around 2 percent each. The decline was due mainly to the direct effects of the war on production and trade in the Gulf region. A similar picture emerges for world trade, where exports and imports of the advanced economies initially showed little reaction.",
      charts: [figures.industrialProduction],
    },
    {
      id: "raw-materials",
      title: "Oil Prices Should Decline, but Stay Higher Than Assumed",
      intro:
        "Prices of non-energy commodities have also risen significantly. On the supply side, commodity production is typically energy-intensive; on the demand side, industrial demand remained robust. Prices of metals and minerals have increased by around 10 percent since March, and food prices are clearly on an upward trend, with higher fertilizer prices raising concerns that lower fertilizer use could weigh on future harvests.",
      charts: [figures.rawMaterialPrices],
    },
  ];

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
  <meta property="og:image" content="{page.url.origin}/share-image.jpg" />
  <meta property="og:image:width" content="1712" />
  <meta property="og:image:height" content="1517" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={meta.title} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="twitter:image" content="{page.url.origin}/share-image.jpg" />
</svelte:head>

<!-- The report's own abstract, verbatim, behind the header's "Abstract"
     dropdown — the italic standfirst on its first page. -->
<Header links={tocLinks}>
  {#snippet abstract()}
    <p>
      In the spring of 2026, global growth slowed amid rising energy prices and heightened
      geopolitical risks. While production in the Persian Gulf countries has slumped, the economy
      remained firmly on an upward trajectory in most other countries. In the United States in
      particular, the economy is expected to continue expanding at a largely unchanged pace.
      Positive momentum continues to come from the boom in AI technology, which is providing strong
      impetus for trade and investment.
    </p>
    <p>
      Currently, financial markets appear to continue expecting that oil and gas production and
      transportation in the Gulf region will soon return to normal levels. In this scenario, which
      is also underlying our forecast, the consequences for the global economy will remain limited,
      the rise in inflation temporary, and the monetary policy response moderate.
    </p>
    <p>
      However, as the conflict has now lasted significantly longer than expected in March, we have
      reduced our forecast for global output growth — measured in terms of purchasing power parity
      — for this year from 3.1 percent to 2.8 percent. For the coming year, a rebound to 3.3
      percent is then expected (March forecast: 3.2 percent). The main risk to this forecast is a
      prolonged closure of the Strait of Hormuz meaning that oil supplies remain at their current
      sharply reduced levels for a significantly longer period of time, which would lead to a much
      more severe and prolonged slowdown in the global economy.
    </p>
  {/snippet}
</Header>
<ChapterRail {sections} />

<Landing />

{#each sections as section (section.id)}
  <section id={section.id} class="h-[140vh] font-sans text-base-content">
    <div class="sticky top-0 h-screen overflow-y-auto bg-base-100">
      <div class="flex min-h-full">
        <div
          class="mx-auto my-auto w-[88vw] py-24 lg:ml-[calc(43%-400px)] lg:w-200"
        >
          <!-- Institute heading style: Suisse Intl Medium, line-height 1.166,
               -1px letter-spacing (their --typo-header-2-* tokens). -->
          <h2 class="text-2xl leading-[1.166] font-medium tracking-[-1px] sm:text-3xl">
            {section.title}
          </h2>
          {#if section.intro}
            <p class="mt-8 font-serif text-lg leading-relaxed text-base-content/80 lg:pl-16">
              {section.intro}
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

<Footer />
