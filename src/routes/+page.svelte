<script>
  import { page } from "$app/state";
  import { figures } from "$lib/data/index.js";

  const meta = {
    title: "Interactive Report Design by SandraViz",
    description:
      "A scrollytelling report with animated charts — interactive report design by SandraViz. Want your report like this? Get in touch at sandraviz.com.",
  };
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Header from "$lib/components/Header.svelte";
  import Landing from "$lib/components/Landing.svelte";
  import Footer from "$lib/components/Footer.svelte";

  // Sections mirror the summary page at globaljusticeproject.wid.world/insight/summary/
  const sections = [
    {
      id: "ensuring-equality",
      title: "Ensuring Equality and Prosperity for All",
      intro:
        "The Global Justice Platform's basic objective for equality and prosperity is full income convergence across countries by 2100. There are two main reasons for this target. First, all countries in the Global South aspire to economic prosperity, and any credible framework for global climate cooperation must account for that aspiration.",
      charts: [figures.incomeGap],
    },
    {
      id: "working-less",
      title: "Working Less, Achieving Gender Equality",
      intro:
        "The first element of sufficiency in the Global Justice Platform is a large reduction in working hours: from about 2,100 hours to 1,000 hours per year per employed person, between 2025 and 2100 (Figure 2). As observed in historical episodes of working-time reduction, productivity growth makes such reductions possible.",
      charts: [figures.workHours],
    },
    {
      id: "compressing",
      title: "Compressing the Income and Wealth Scale",
      intro:"The Global Justice Platform aims at substantial compression of national income and wealth scales over 2026-2100. Global wealth and income taxes are designed both to raise the resources needed by the Global Justice Fund and to curb the concentration of income, wealth, and power at the top of the world distribution.",
      charts: [figures.incomeShares],
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
            <h2 class="text-2xl font-semibold sm:text-3xl">{section.title}</h2>
            {#if section.intro}
              <p class="mt-4 text-lg leading-relaxed text-base-content/80">
                {section.intro}
              </p>
            {/if}
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
