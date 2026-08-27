<script>
  import { page } from "$app/state";
  import { figures } from "$lib/data/index.js";

  const meta = {
    title: "An interactive, visualization-first report demo by sandraviz.com",
    description:
      "Reports don't have to be static PDFs. An interactive, visualization-first version of the Global Justice Report, built for web and mobile.",
  };
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Header from "$lib/components/Header.svelte";
  import ChapterRail from "$lib/components/ChapterRail.svelte";
  import Landing from "$lib/components/Landing.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import CursorDot from "$lib/components/CursorDot.svelte";

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
        "The Global Justice Report is the first attempt to propose a fully quantified plan going in this direction, combining four dimensions that today's debates often treat separately: redistribution at the world scale, a deep reform of the international financial and economic order, a radical transformation of energy systems, and substantial shifts in consumption patterns. Compared to most climate scenarios, including by the Intergovernmental Panel on Climate Change (IPCC), <mark class=\"accent-mark\">the main novelty is that we model all four dimensions together and place inequality and sufficiency at the center of the analysis</mark>.",
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
  // three-paragraph chapter gets a ~350px fade, a short one gets a
  // proportionally shorter one, and neither ever shows a seam.
  const FIGURE_SURFACE = "#ffffff";
  const TEXT_SURFACE = "var(--color-base-100)";

  // `rampTop` is false for chapter 1 — it follows the dark photo cover, where
  // the cut is meant to be hard. `rampBottom` is false when no figure follows.
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
  <!-- `article`, not `website`: the article:* pair below (author, published
       time) is only defined for article-type pages, and scrapers that check
       will skip them otherwise. LinkedIn already classified this page as an
       Article on its own, so this makes the declaration match. -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content={meta.title} />
  <meta property="og:description" content={meta.description} />
  <meta property="og:url" content={page.url.origin + page.url.pathname} />
  <!-- PNG, not JPEG: the share image is a chart — flat ground, hairlines,
       small type — and JPEG's lossy pass smears exactly that. The extension
       here has to match the real encoding; scrapers that trust the URL (or the
       Content-Type derived from it) show no preview at all when it lies.
       Dimensions must track the file: scrapers reserve layout from them, so a
       stale pair is worse than none at all. Re-measure on any swap. -->
  <meta property="og:image" content="{page.url.origin}/share-image.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1712" />
  <meta property="og:image:height" content="896" />
  <!-- Author and publication date, the two fields LinkedIn's Post Inspector
       reported as missing. `name="author"` is the generic form most scrapers
       read; `article:author` is the OG form. Both carry the same value so
       neither reader has to guess.
       The timestamp is midday, not midnight: a client rendering 00:00+01:00
       in UTC lands on 23:00 the PREVIOUS day and displays the wrong date. -->
  <meta name="author" content="sandraviz.com" />
  <meta property="article:author" content="https://sandraviz.com" />
  <meta property="article:published_time" content="2026-08-24T12:00:00+01:00" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={meta.title} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="twitter:image" content="{page.url.origin}/share-image.png" />
</svelte:head>

<!-- The accent dot cursor, which applies to the COVER ONLY: it follows the
     `data-accent-cursor` attribute on Landing.svelte's root section, and the
     report proper keeps the system pointer. Mounts itself only for a real
     mouse — see CursorDot.svelte. Nothing else on the page depends on it. -->
<CursorDot />

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
    <!-- The fade into and out of the white figure surface lives in this
         block's own background — see textSurface() above. -->
    <div
      class="bg-base-100"
      style={textSurface(i > 0 && sections[i - 1].charts.length > 0, section.charts.length > 0)}
    >
      <!-- py-16/lg:py-28. The air above and below the copy was cut back from
           28/40: at the old values a short chapter was mostly padding, and on
           a phone — where the column is 88vw and the type is smaller — it
           pushed the text down past the fold before it started. -->
      <div class="mx-auto w-[88vw] py-16 lg:w-200 lg:py-28">
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
            class="text-lg leading-relaxed text-base-content lg:text-xl {pIndex === 0
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

<Footer />
