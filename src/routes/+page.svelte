<script>
  import { page } from "$app/state";
  import { figures } from "$lib/data/index.js";

  const meta = {
    title: "An interactive, visualization-first report by SandraViz",
    description:
      "Reports don't have to be static PDFs. An interactive, visualization-first report for the Kiel Institute for the World Economy, built for web and mobile.",
  };
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Header from "$lib/components/Header.svelte";
  import ChapterRail from "$lib/components/ChapterRail.svelte";
  import Landing from "$lib/components/Landing.svelte";
  import Footer from "$lib/components/Footer.svelte";

  // Placeholder chapters, taken from the Global Transformation research
  // center's own research groups and page copy so the scaffold reads in the
  // institute's voice. The scrolly machinery, the three figure types
  // (horizontal bars, multi-line, stepped line) and the chapter rail are all
  // wired up and running on stand-in data from src/lib/data/figures/ — swap
  // titles, intros and figures once the report content arrives.
  const sections = [
    {
      id: "global-commons",
      title: "Global Commons and Climate Policy",
      intro:
        "The Research Center examines the design and effects of European and international climate policy, with a special focus on negative emission technologies. Placeholder text: this paragraph sets up the first figure before the reader scrolls into it.",
      charts: [figures.incomeGap],
    },
    {
      id: "cooperation-cohesion",
      title: "Global Cooperation and Social Cohesion",
      intro:
        "How can global cooperation be promoted, which circumstances undermine social cohesion, and how are collective risks managed? Placeholder text: the figure below steps through its data as the reader scrolls, with the interpretation moving alongside it.",
      charts: [figures.workHours],
    },
    {
      id: "geopolitical-conflict",
      title: "Geopolitical Conflict and Labor Market Transformation",
      intro:
        "Far-reaching change in the global economy promotes regional disparities and conflicts, creating frictions and social problems that demand new forms of international cooperation. Placeholder text: this chapter's figure runs through several steps, each with its own annotation.",
      charts: figures.incomeSharesSteps,
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

<Header links={tocLinks} />
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
