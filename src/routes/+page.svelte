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
  // The fade between the tinted text ground and the flat figure surface.
  // Two things make it gentle. It is LONG — 256px, 384px on desktop. The two
  // surfaces are close enough in value that a short ramp between them reads as
  // an edge with a blur on it; over this distance the change is slow enough
  // that there is no moment where it happens. And each end HOLDS its own
  // colour for the first and last 15%, so the ramp starts and finishes away
  // from the seam: what meets the chapter is chapter colour, what meets the
  // figure is figure colour, and all the change happens in the middle where
  // there is no boundary to draw attention to it.
  const BAND = "h-64 bg-linear-to-b lg:h-96";
  const INTO_TEXT = `${BAND} from-base-100 from-15% to-base-200 to-85%`;
  const INTO_FIGURE = `${BAND} from-base-200 from-15% to-base-100 to-85%`;

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
  <meta property="og:type" content="website" />
  <meta property="og:title" content={meta.title} />
  <meta property="og:description" content={meta.description} />
  <meta property="og:url" content={page.url.origin + page.url.pathname} />
  <!-- Absolute URLs: link scrapers don't resolve relative image paths.
       TODO: static/share-image.jpg does not exist yet (1200×630). -->
  <meta property="og:image" content="{page.url.origin}/share-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={meta.title} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="twitter:image" content="{page.url.origin}/share-image.jpg" />
</svelte:head>

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
      <!-- Fade OUT of the white figure surface above. Chapter 1 has no band:
           it follows the dark photo cover, where the cut is meant to be hard.
           The ramp runs between the two SURFACE TOKENS, not literal white and
           a tint, so it keeps matching if the theme's surfaces are retuned.
           See INTO_TEXT / INTO_FIGURE above for its length and shape. -->
      {#if i > 0 && sections[i - 1].charts.length > 0}
        <div class={INTO_TEXT}></div>
      {/if}
      <div class="bg-base-200">
        <!-- Centred in the viewport, while the figure surface below sits left
             of centre (ChartDisplay `lg:left-[40%]`): the chapter is a full
             page of reading, the figure is a composition with its description
             column to the right. -->
        <!-- py-16/lg:py-28. The air above and below the copy was cut back
             from 28/40: at the old values a short chapter was mostly padding,
             and on a phone — where the column is 88vw and the type is smaller
             — it pushed the text down past the fold before it started. -->
        <div class="mx-auto w-[88vw] py-16 lg:w-200 lg:py-28">
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
      <!-- ...and back INTO it, the same band the other way round. -->
      {#if section.charts.length > 0}
        <div class={INTO_FIGURE}></div>
      {/if}
    </section>
    <!-- An `interlude` splits the figures into two scrolly runs with a text
         pause between, so the surface changes twice more: figure → tint →
         figure, each seam carrying the same band. -->
    {#if section.interlude}
      <ScrollySection
        pairs={section.charts.slice(0, section.interlude.after)}
        sectionId={section.id}
      />
      <div class={INTO_TEXT}></div>
      <Interlude {...section.interlude} id="{section.id}-steps" />
      <div class={INTO_FIGURE}></div>
      <ScrollySection
        pairs={section.charts.slice(section.interlude.after)}
        sectionId="{section.id}-steps"
      />
    {:else if section.charts.length > 0}
      <ScrollySection pairs={section.charts} sectionId={section.id} />
    {/if}
  {/each}
  <!-- Last figure surface back into the footer, which is base-200 too. -->
  <div class={INTO_TEXT}></div>
</div>

<Footer />
