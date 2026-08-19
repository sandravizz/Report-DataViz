<script>
  import { page } from "$app/state";
  import { figures } from "$lib/data/index.js";

  const meta = {
    title: "An interactive, visualization-first report by SandraViz",
    description:
      "Reports don't have to be static PDFs. An interactive, visualization-first version of the Global Justice Report, built for web and mobile.",
  };
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Header from "$lib/components/Header.svelte";
  import ChapterRail from "$lib/components/ChapterRail.svelte";
  import Landing from "$lib/components/Landing.svelte";
  import Footer from "$lib/components/Footer.svelte";

  // `intro` is a list of paragraphs, not one string: each entry renders as its
  // own <p> so the chapter opener can carry several paragraphs with real space
  // between them.
  const sections = [
    {
      id: "ensuring-equality",
      title: "Ensuring Equality and Prosperity for All",
      intro: [
        "The Global Justice Report attempts to set out a new vision for global progress in the 21st century: <mark class=\"accent-mark\">grounding human development and equality in planetary habitability</mark>. It explores the conditions under which the world could move toward this horizon and traces an economically and ecologically consistent transition path from 2026 to 2100.",
        "Its main conclusion is simple: it is possible to reconcile planetary habitability and high well-being for all, but only if the transformation rests on three pillars simultaneously. Fast decarbonization of energy systems is necessary. But we also need a major shift toward sufficiency \u2013 understood as a sharp reduction in labour hours and material footprint and large changes in consumption patterns, food habits, land use, and forest cover. In addition, neither decarbonization nor sufficiency can be financed and politically sustained without a drastic reduction in inequality of income, wealth and power, both between countries and within them. The compression of global inequality is not only compatible with deep decarbonization; it is a necessary condition for shared prosperity on a finite planet.",
        "The Global Justice Report is the first attempt to propose a fully quantified plan going in this direction, combining four dimensions that today's debates often treat separately: redistribution at the world scale, a deep reform of the international financial and economic order, a radical transformation of energy systems, and substantial shifts in consumption patterns. to most climate scenarios, including by the Intergovernmental Panel on Climate Change (IPCC), the main novelty is we model all four dimensions together and place inequality and sufficiency at the center of the analysis.",
      ],
      charts: [figures.incomeGap],
    },
    {
      id: "working-less",
      title: "Working Less, Achieving Gender Equality",
      intro: [
        "The first element of sufficiency in the Global Justice Platform is a large reduction in working hours: from about 2,100 hours to 1,000 hours per year per employed person, between 2025 and 2100 (Figure 2). As observed in historical episodes of working-time reduction, productivity growth makes such reductions possible.",
      ],
      charts: [figures.workHours],
    },
    {
      id: "compressing",
      title: "Compressing the Income and Wealth Scale",
      intro: [
        "The Global Justice Platform aims at substantial compression of national income and wealth scales over 2026-2100. Global wealth and income taxes are designed both to raise the resources needed by the Global Justice Fund and to curb the concentration of income, wealth, and power at the top of the world distribution.",
      ],
      charts: figures.incomeSharesSteps,
    },
  ];

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

<Header {sections} />
<ChapterRail {sections} />

<Landing />

{#each sections as section, i (section.id)}
  <!-- Chapter text is NOT pinned and NOT sized to the viewport: only the
       figure surface in ScrollySection sticks. This is long-form copy, so the
       block is exactly as tall as its own paragraphs — a chapter with three
       paragraphs is taller than a screen, one with a single paragraph is much
       shorter. You scroll until the text ends and the next section begins;
       nothing is padded out to fill a screen it does not need. -->
  <section id={section.id} class="font-sans text-base-content">
    <!-- Fade OUT of the white figure surface above. Chapter 1 has no band: it
         follows the dark photo cover, where the cut is meant to be hard.
         h-20 = 80px, the full white-to-grey ramp: just enough to take the blade
         off the edge without reading as a gradient in its own right. At this
         length a plain two-colour ramp is right — the fade-to-transparent
         trick only earns its keep over a long band, where a hard stop at the
         end of the ramp would show a seam. -->
    {#if i > 0 && sections[i - 1].charts.length > 0}
      <div class="h-20 bg-linear-to-b from-white to-base-100"></div>
    {/if}
    <div class="bg-base-100">
      <div class="mx-auto w-[88vw] py-28 lg:w-200 lg:py-40">
        <h2 class="text-3xl font-semibold sm:text-4xl lg:text-5xl lg:leading-[1.08]">
          {section.title}
        </h2>
        <!-- mt-8/lg:mt-10 opens the gap under the heading; the paragraphs
             after the first sit on a tighter mt-4, half a line of extra air,
             which is the break McKinsey-style long-form copy uses.

             Paragraphs render as HTML so one can carry a `mark.accent-mark`
             — the accent underline. Safe here and nowhere near a general
             licence: every string in `sections` above is editorial copy
             authored in this file, never anything fetched, routed or
             user-supplied. -->
        {#each section.intro as paragraph, pIndex (pIndex)}
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
    <!-- ...and back INTO it, same 20px the other way round. -->
    {#if section.charts.length > 0}
      <div class="h-20 bg-linear-to-b from-base-100 to-white"></div>
    {/if}
  </section>
  {#if section.charts.length > 0}
    <ScrollySection pairs={section.charts} sectionId={section.id} />
  {/if}
{/each}

<!-- Last figure surface back into the footer, which is base-100 too. -->
<div class="h-20 bg-linear-to-b from-white to-base-100"></div>

<Footer />
