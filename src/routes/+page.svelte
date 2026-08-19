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

  // Chapters follow the report's own argument and each keeps the bold
  // lead-in sentence the report gives that passage as its heading. The intro
  // paragraphs are the report's text, trimmed to what the figure beside them
  // is about; the per-figure `description` in src/lib/data/figures/ carries
  // the rest of the reading alongside the chart itself.
  //
  // `intro` is a LIST of paragraphs, not one string: each entry renders as its
  // own <p>, and they render as HTML so one can carry a `mark.accent-mark` —
  // the orange underline marking that chapter's headline finding. Safe here
  // and nowhere near a general licence: every string below is editorial copy
  // authored in this file, never anything fetched, routed or user-supplied.
  const sections = [
    {
      id: "world-trade",
      title: "The Iran War Is Clearly Visible in World Trade",
      intro: [
        "Global industrial production, which had increased at a moderate pace last year, accelerated in the first two months of this year and in February stood 3.4 percent above its level a year earlier. <mark class=\"accent-mark\">World trade expanded even more strongly, rising by 7.6 percent over the same period</mark>. This momentum was driven mainly by the AI boom; accordingly, Asian economies, where production of the relevant capital goods is concentrated, benefited particularly strongly.",
      ],
      charts: [figures.worldTrade],
    },
    {
      id: "industrial-production",
      title: "But the Damage Remains Concentrated in the Gulf Countries",
      intro: [
        "In March, with the onset of the war in Iran and the associated closure of the Strait of Hormuz, <mark class=\"accent-mark\">both industrial production and world trade declined markedly — by around 2 percent each</mark>. The decline was due mainly to the direct effects of the war on production and trade in the Gulf region. A similar picture emerges for world trade, where exports and imports of the advanced economies initially showed little reaction.",
      ],
      charts: [figures.industrialProduction],
    },
    {
      id: "raw-materials",
      title: "Oil Prices Should Decline, but Stay Higher Than Assumed",
      intro: [
        "Prices of non-energy commodities have also risen significantly. On the supply side, commodity production is typically energy-intensive; on the demand side, industrial demand remained robust. <mark class=\"accent-mark\">Prices of metals and minerals have increased by around 10 percent since March</mark>, and food prices are clearly on an upward trend, with higher fertilizer prices raising concerns that lower fertilizer use could weigh on future harvests.",
      ],
      charts: [figures.rawMaterialPrices],
    },
  ];

  // The fade between the tinted text ground and the white figure surface is
  // painted ON THE TEXT BLOCK, not as a spacer div between the two.
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
  // chapter gets a long fade, a short one a proportionally shorter one, and
  // neither ever shows a seam.
  const FIGURE_SURFACE = "#ffffff";
  const TEXT_SURFACE = "var(--color-base-200)";
  // The cover is not a figure: it is base-100 cream, so chapter 1 ramps out of
  // the cream rather than out of white. Unlike the branches with a dark photo
  // cover — where the cut into chapter 1 is deliberately hard — this cover is
  // a pale page, and without a ramp it would meet the tint on a visible line a
  // few pixels under the scroll chevron.
  const COVER_SURFACE = "var(--color-base-100)";

  // `from` is whatever surface sits above the block, or null if nothing above
  // it needs a ramp. `rampBottom` is false when no figure follows.
  function textSurface(from, rampBottom) {
    const stops = from
      ? [`${from} 0%`, `${TEXT_SURFACE} 35%`]
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

<Landing nextId={sections[0].id} />

{#each sections as section, i (section.id)}
  <!-- Chapter text is NOT pinned and NOT sized to the viewport: only the
       figure surface in ScrollySection sticks. This is long-form copy, so the
       block is exactly as tall as its own paragraphs — you scroll until the
       text ends and the next section begins, and nothing is padded out to
       fill a screen it does not need.
       It also sits on the TINTED base-200 at every breakpoint, never
       lg:-scoped: tinted text against the flat cream figure surface is how the
       reader (and the chapter rail) tells the two apart. -->
  <section id={section.id} class="font-sans text-base-content">
    <!-- The fade into and out of the surfaces either side lives in this
         block's own background — see textSurface() above. What sits above
         chapter 1 is the cream cover; above every other chapter, a white
         figure. -->
    <div
      class="bg-base-200"
      style={textSurface(
        i === 0
          ? COVER_SURFACE
          : sections[i - 1].charts.length > 0
            ? FIGURE_SURFACE
            : null,
        section.charts.length > 0
      )}
    >
      <!-- Centred in the viewport, while the figure surface below sits left of
           centre (ChartDisplay `lg:left-[40%]`): the chapter is a full page of
           reading, the figure is a composition with its description column to
           the right. -->
      <!-- py-16/lg:py-28. The air above and below the copy was cut back from
           28/40: at the old values a single-paragraph chapter was mostly
           padding, and on a phone — where the column is 88vw and the type is
           smaller — it pushed the text down past the fold before it started. -->
      <div class="mx-auto w-[88vw] py-16 lg:w-200 lg:py-28">
        <!-- Institute heading style kept exactly — Suisse Intl Medium,
             line-height 1.166, -1px letter-spacing (their --typo-header-2-*
             tokens) — only the size ramp is the template's. -->
        <h2
          class="text-3xl leading-[1.166] font-medium tracking-[-1px] sm:text-4xl lg:text-5xl"
        >
          {section.title}
        </h2>
        <!-- mt-8/lg:mt-10 opens the gap under the heading; the paragraphs
             after the first sit on a tighter mt-4. The old lg:pl-16 indent is
             gone: it made sense when the column was pinned to the left gutter,
             but a centred column that is also inset reads as off-centre.
             Rendering as HTML is what lets a paragraph carry its accent
             underline — see the note on `sections` above for why that is safe. -->
        {#each section.intro as paragraph, pIndex (pIndex)}
          <p
            class="font-serif text-lg leading-relaxed text-base-content/80 lg:text-xl {pIndex ===
            0
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
