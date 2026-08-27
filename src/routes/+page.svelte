<script>
  import { page } from "$app/state";
  import { figures } from "$lib/data/index.js";

  const meta = {
    title: "IW-Wohnindex Q2 2026 — ein interaktiver Report",
    description:
      "Der IW-Wohnindex Q2 2026 (Institut der deutschen Wirtschaft) als interaktive Webpublikation: Kauf- und Mietpreise für Wohnimmobilien in Deutschland. Interaktive Designstudie von SandraViz.",
  };
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Interlude from "$lib/components/Interlude.svelte";
  import Header from "$lib/components/Header.svelte";
  import ChapterRail from "$lib/components/ChapterRail.svelte";
  import Landing from "$lib/components/Landing.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import CursorDot from "$lib/components/CursorDot.svelte";

  // The story order. Titles and `intro` paragraphs are the report's own text
  // (IW-Report 34/2026), verbatim; ids are assigned below as chapter-1, -2, …
  //
  // Paragraphs render as HTML so one can carry a `mark.accent-mark` — the
  // amber underline that marks a chapter's headline finding. Safe here and
  // nowhere near a general licence: every string in `sections` is editorial
  // copy authored in this file, never anything fetched, routed or
  // user-supplied.
  // This is a sales demo, so it opens straight on the report's Kapitel 2 (the
  // first one with a figure) — the text-only Kapitel 1 (Einleitung) is cut, as
  // are Kapitel 3-5 (regional/city breakdowns, offer counts).
  const sections = [
    {
      kicker: "Kapitel 2. Entwicklung der Wohnimmobilienpreise in Deutschland",
      title: "Kaufpreise leicht im Plus, Mieten steigen weiter deutlich",
      intro: [
        "Im Kaufsegment <mark class=\"accent-mark\">setzt sich die Stabilisierung im zweiten Quartal 2026 fort</mark>. Gegenüber dem Vorjahresquartal verteuern sich sowohl Eigentumswohnungen als auch Ein- und Zweifamilienhäuser um 0,8 Prozent. Im Vergleich zum Vorquartal steigen die Preise für Eigentumswohnungen leicht um 0,2 Prozent, bei Ein- und Zweifamilienhäusern fällt der Zuwachs mit 1,0 Prozent etwas deutlicher aus. Insgesamt bewegen sich die Kaufpreise damit weiterhin weitgehend seitwärts, nachdem sie seit Mitte 2022 erheblich zurückgegangen waren.",
        "Die moderate Preisentwicklung ist vor dem Hintergrund der weiterhin anspruchsvollen Finanzierungsbedingungen plausibel. Das Zinsniveau begrenzt nach wie vor die finanziellen Spielräume vieler Haushalte. Gleichzeitig spricht die zuletzt wieder leicht positive Entwicklung dafür, dass sich der Markt nach der deutlichen Preiskorrektur zunehmend stabilisiert.",
        "Die Wohnkosten steigen damit inzwischen wieder recht kontinuierlich in beiden Marktsegmenten. Während sich die Kaufpreise bislang nur leicht erhöhen, setzen die Angebotsmieten <mark class=\"accent-mark\">ihren deutlich stärkeren Anstieg fort</mark>. Gegenüber dem Vorjahresquartal beträgt das Plus 4,0 Prozent, gegenüber dem Vorquartal 1,3 Prozent.",
      ],
      charts: [figures.nationalIndex, ...figures.nationalIndexAnimatedSteps],
      // Abbildung 2-1 runs twice: finished, then rebuilt step by step.
      // `after` = how many figures precede the pause.
      interlude: {
        after: 1,
        // What the two runs are called in the rail and the TOC (see
        // `railSections`) — the demo's two points, not the report's.
        railLabels: ["Statische Abbildung", "Dynamische Abbildung"],
        kicker: "Hinweis zur Demo",
        title: "Dieselbe Abbildung, zweimal gezeigt",
        paragraphs: [
          "Abbildung 2-1 steht oben so, wie sie auch im Report steht: alle drei Reihen auf einmal.",
          "Auf den nächsten Bildschirmen entsteht dieselbe Abbildung noch einmal, beim Scrollen Schritt für Schritt: zuerst die Angebotsmieten, dann die Eigentumswohnungen, dann die Ein- und Zweifamilienhäuser. Die Daten sind identisch, vorgegeben ist nur die Reihenfolge, in der sie gelesen werden.",
          "In einer fertigen Publikation fiele die Wahl pro Abbildung auf eine der beiden Varianten. Hier stehen beide nebeneinander, damit der Unterschied direkt vergleichbar ist.",
        ],
      },
    },
  ].map((section, i) => ({
    ...section,
    id: `chapter-${i + 1}`,
    paragraphs: Array.isArray(section.intro) ? section.intro : [section.intro],
  }));

  // What the rail and the TOC navigate. This demo carries one chapter whose
  // figure is shown twice — finished, then rebuilt step by step — so the two
  // runs, not the chapter, are what a reader moves between: an interlude
  // chapter contributes two points, a plain one contributes itself. The ids
  // must match the elements below and the `sectionId` each ScrollySection
  // stamps on its anchors, which is how the rail lights up in step.
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
  // three-paragraph chapter gets a ~350px fade, a short one gets a
  // proportionally shorter one, and neither ever shows a seam.
  const FIGURE_SURFACE = "#ffffff";
  const TEXT_SURFACE = "var(--color-base-200)";

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

  const railSections = sections.flatMap((section) =>
    section.interlude
      ? [
          {
            id: section.id,
            title: section.interlude.railLabels[0],
            charts: section.charts.slice(0, section.interlude.after),
          },
          {
            id: `${section.id}-steps`,
            title: section.interlude.railLabels[1],
            charts: section.charts.slice(section.interlude.after),
          },
        ]
      : [{ id: section.id, title: section.title, charts: section.charts }]
  );

</script>

<svelte:head>
  <!-- `article`, not `website`: the article:* pair below (author, published
       time) is only defined for article-type pages, and scrapers that check
       will skip them otherwise. LinkedIn classifies a page like this one as an
       Article on its own, so this makes the declaration match. -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content={meta.title} />
  <meta property="og:description" content={meta.description} />
  <meta property="og:url" content={page.url.origin + page.url.pathname} />
  <!-- Absolute URLs: link scrapers don't resolve relative image paths. -->
  <meta property="og:image" content="{page.url.origin}/share-image.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1712" />
  <meta property="og:image:height" content="896" />
  <!-- Author and publication date, the two fields LinkedIn's Post Inspector
       reports as missing without them. `name="author"` is the generic form
       most scrapers read; `article:author` is the OG form. Both carry the same
       value so neither reader has to guess.
       The timestamp is midday, not midnight: a client rendering 00:00+01:00
       in UTC lands on 23:00 the PREVIOUS day and displays the wrong date. -->
  <meta name="author" content="sandraviz.com" />
  <meta property="article:author" content="https://sandraviz.com" />
  <meta property="article:published_time" content="2026-08-27T12:00:00+01:00" />
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

<Header sections={railSections} />
<ChapterRail sections={railSections} />

<div id="top">
  <Landing />

  <div id="charts"></div>
  {#each sections as section, i (section.id)}
    <!-- Chapter text is NOT pinned and NOT sized to the viewport: only the
         figure surface in ScrollySection sticks. This is long-form copy, so
         the block is exactly as tall as its own paragraphs — a chapter with
         three paragraphs runs past a screen, one with a single paragraph is
         much shorter. You scroll until the text ends and the next section
         begins; nothing is padded out to fill a screen it does not need.
         Chapter text sits on tinted base-200 at EVERY breakpoint, never
         lg:-scoped — tinted text vs. flat white figures is how the reader (and
         the chapter rail) tells the two surfaces apart. -->
    <section id={section.id} class="font-sans text-base-content">
      <!-- The fade into and out of the white figure surface lives in this
           block's own background — see textSurface() above. -->
      <div
        class="bg-base-200"
        style={textSurface(i > 0 && sections[i - 1].charts.length > 0, section.charts.length > 0)}
      >
        <!-- Centred in the viewport, while the figure surface below sits left
             of centre (ChartDisplay `lg:left-[40%]`): the chapter is a full
             page of reading, the figure is a composition with its description
             column to the right. -->
        <!-- py-16/lg:py-28. The air above and below the copy was cut back
             from 28/40: at the old values a short chapter was mostly padding,
             and on a phone — where the column is 88vw and the type is smaller
             — it pushed the text down past the fold before it started. -->
        <!-- max-w-200 caps the reading column at the same 800px the desktop
             layout uses. Without it the column is 88vw the whole way up to the
             1400px breakpoint, so a 1399px window sets 18px type across 1231px
             — about 130 characters a line, against the 55–75 that is comfortable
             to read. The cap bites from ~909px upward; below that 88vw still
             governs, so the phone column is exactly as it was. -->
        <div class="mx-auto w-[88vw] max-w-200 py-16 lg:w-200 lg:py-28">
          {#if section.kicker}
            <p class="mb-3 text-xs font-medium tracking-wide text-primary uppercase">
              {section.kicker}
            </p>
          {/if}
          <h2
            class="font-display text-3xl font-bold sm:text-4xl lg:text-5xl lg:leading-[1.08]"
          >
            {section.title}
          </h2>
          <!-- mt-8/lg:mt-10 opens the gap under the heading; the paragraphs
               after the first sit on a tighter mt-4, half a line of extra air.
               Rendering them as HTML is what lets one carry its accent
               underline — see the note on `sections` above for why that is
               safe here. -->
          <!-- Full ink, no alpha. This was `/80` and it was backwards: the
               description column beside the chart is plain `text-base-content`,
               so the short annotation read at 10.65:1 while the running text
               you actually read at length sat at 5.57:1 on base-200 — half the
               contrast for the passage doing the most work. Grayscale
               antialiasing (docs/type-rendering.md) thins glyphs slightly and
               hits 400-weight body copy at this size hardest, which is what
               finally made it noticeable. The tell was that it read fine when
               selected: selection paints text at full opacity, i.e. this.
               Reading text is the strongest ink on the page; the greys are for
               things you are not meant to look at. -->
          {#each section.paragraphs as paragraph, pIndex (pIndex)}
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
    <!-- An `interlude` splits the figures into two scrolly runs with a text
         pause between. It carries its own fade at both ends, the same way this
         chapter does — see Interlude.svelte. -->
    {#if section.interlude}
      <ScrollySection
        pairs={section.charts.slice(0, section.interlude.after)}
        sectionId={section.id}
      />
      <Interlude {...section.interlude} id="{section.id}-steps" />
      <ScrollySection
        pairs={section.charts.slice(section.interlude.after)}
        sectionId="{section.id}-steps"
      />
    {:else if section.charts.length > 0}
      <ScrollySection pairs={section.charts} sectionId={section.id} />
    {/if}
  {/each}
</div>

<Footer />
