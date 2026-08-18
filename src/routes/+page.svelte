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
  // This is a sales demo, so it opens straight on the report's Kapitel 2 (the
  // first one with a figure) — the text-only Kapitel 1 (Einleitung) is cut, as
  // are Kapitel 3-5 (regional/city breakdowns, offer counts).
  const sections = [
    {
      kicker: "Kapitel 2. Entwicklung der Wohnimmobilienpreise in Deutschland",
      title: "Kaufpreise leicht im Plus, Mieten steigen weiter deutlich",
      intro: [
        "Im Kaufsegment setzt sich die Stabilisierung im zweiten Quartal 2026 fort. Gegenüber dem Vorjahresquartal verteuern sich sowohl Eigentumswohnungen als auch Ein- und Zweifamilienhäuser um 0,8 Prozent. Im Vergleich zum Vorquartal steigen die Preise für Eigentumswohnungen leicht um 0,2 Prozent, bei Ein- und Zweifamilienhäusern fällt der Zuwachs mit 1,0 Prozent etwas deutlicher aus. Insgesamt bewegen sich die Kaufpreise damit weiterhin weitgehend seitwärts, nachdem sie seit Mitte 2022 erheblich zurückgegangen waren.",
        "Die moderate Preisentwicklung ist vor dem Hintergrund der weiterhin anspruchsvollen Finanzierungsbedingungen plausibel. Das Zinsniveau begrenzt nach wie vor die finanziellen Spielräume vieler Haushalte. Gleichzeitig spricht die zuletzt wieder leicht positive Entwicklung dafür, dass sich der Markt nach der deutlichen Preiskorrektur zunehmend stabilisiert.",
        "Die Wohnkosten steigen damit inzwischen wieder recht kontinuierlich in beiden Marktsegmenten. Während sich die Kaufpreise bislang nur leicht erhöhen, setzen die Angebotsmieten ihren deutlich stärkeren Anstieg fort. Gegenüber dem Vorjahresquartal beträgt das Plus 4,0 Prozent, gegenüber dem Vorquartal 1,3 Prozent.",
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

  const tocLinks = railSections.map((section) => ({
    href: `#${section.id}`,
    label: section.title,
  }));
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

<Header links={tocLinks} />
<ChapterRail sections={railSections} />

<div id="top">
  <Landing />

  <div id="charts"></div>
  {#each sections as section (section.id)}
    <!-- min-h, not h: a long intro grows the pane instead of being clipped
         into a nested scroller.
         Chapter text sits on tinted base-200 at EVERY breakpoint, never
         lg:-scoped — tinted text vs. flat white figures is how the reader (and
         the chapter rail) tells the two surfaces apart. -->
    <section
      id={section.id}
      class="bg-base-200 font-sans text-base-content lg:min-h-[140vh]"
    >
      <div class="bg-base-200 lg:sticky lg:top-0 lg:min-h-screen">
        <div class="lg:flex lg:min-h-screen">
          <div
            class="mx-auto w-[88vw] py-24 lg:my-auto lg:ml-[calc(43%-400px)] lg:w-200"
          >
            {#if section.kicker}
              <p class="mb-3 text-xs font-medium tracking-wide text-primary uppercase">
                {section.kicker}
              </p>
            {/if}
            <h2 class="font-display text-2xl font-bold sm:text-3xl">{section.title}</h2>
            {#each section.paragraphs as paragraph (paragraph)}
              <p class="mt-4 text-lg leading-relaxed text-base-content/80">
                {paragraph}
              </p>
            {/each}
          </div>
        </div>
      </div>
    </section>
    <!-- An `interlude` splits the figures into two scrolly runs with a text
         pause between; indexOffset keeps the second run's anchors counting. -->
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

<Footer>
  {#snippet disclosure()}
    <p>
      Grundlage: Pekka Sagner / Michael Voigtländer, „IW-Wohnindex Q2 2026“,
      IW-Report 34/2026, Institut der deutschen Wirtschaft, Köln 2026,
      <a href="https://www.iwkoeln.de" target="_blank" rel="noopener" class="link link-hover"
        >www.iwkoeln.de</a
      >. Daten und Befunde stammen aus dem Report, die Abbildungen wurden aus den
      veröffentlichten Grafiken rekonstruiert. Diese interaktive Fassung ist eine
      eigenständige Designstudie von Sandra Becker, die allein dafür verantwortlich
      ist; sie ist vom Institut der deutschen Wirtschaft weder geprüft noch
      autorisiert.
    </p>
  {/snippet}
</Footer>
