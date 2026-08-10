<script>
  import { page } from "$app/state";
  import { figures } from "$lib/data/index.js";

  const meta = {
    title: "IW-Wohnindex Q2 2026 — An Interactive Report",
    description:
      "An interactive report on the IW-Wohnindex Q2 2026 (Institut der deutschen Wirtschaft): German residential property prices and listing volumes. Web development and data visualization by SandraViz.",
  };
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Interlude from "$lib/components/Interlude.svelte";
  import Header from "$lib/components/Header.svelte";
  import ChapterRail from "$lib/components/ChapterRail.svelte";
  import Landing from "$lib/components/Landing.svelte";
  import Footer from "$lib/components/Footer.svelte";

  // First pass: chapters 1-2 of the IW-Wohnindex Q2 2026 (IW-Report 34/2026,
  // Institut der deutschen Wirtschaft, 20.07.2026). Section titles and intro
  // paragraphs are the report's own text, verbatim. `intro` takes an array of
  // paragraphs. Ids are assigned automatically (chapter-1, chapter-2, ...)
  // below. Chapters 3-5 (regional/city breakdowns and the offer-count special
  // section) are not built yet.
  const sections = [
    {
      kicker: "Kapitel 1. Einleitung",
      title:
        "Der IW-Wohnindex: Kauf- und Mietpreise für Wohnimmobilien in Deutschland",
      intro: [
        "Der vorliegende IW-Wohnindex untersucht die Entwicklung der Kauf- und Mietpreise für Wohnimmobilien in Deutschland. Der vierteljährig erscheinende Kurzreport präsentiert die Ergebnisse eines hedonischen Preisindex auf der Basis von mehreren Millionen Wohnimmobilieninseraten. Betrachtet werden dabei sowohl inserierte Kaufpreise als auch Neuvertragsmieten. Nähere Informationen zur Methodik finden sich im Anhang. Der Report fokussiert sich regelmäßig auf die allgemeinen Preisentwicklungen auf dem Kauf- und Mietmarkt und die regionalen Auswertungen nach Regionstypen für die größten deutschen Städte. In einem weiteren Kapitel wird die Preisentwicklung für Wohnimmobilien vor dem Hintergrund ausgewählter Sonderthemen näher beleuchtet. Während sich der Kernteil der Studie auf die Darlegung der Ergebnisse konzentriert, rundet das letzte Kapitel die Studie durch eine immobilienökonomische und wohnungspolitische Einordnung ab.",
        "Als Sonderteil wird in dieser Ausgabe die Entwicklung der Inseratszahlen näher betrachtet. Während Preise Auskunft darüber geben, zu welchen Konditionen Wohnimmobilien angeboten werden, zeigen Inseratszahlen, wie groß das öffentlich sichtbare Angebot ist und wie stark sich die Marktbedingungen auf Käufer und Mieter auswirken. Gerade seit der Zinswende haben sich Kauf- und Mietmärkte deutlich unterschiedlich entwickelt: Das Angebot an Kaufobjekten ist stark gestiegen, während Mietwohnungen in vielen Regionen weiterhin knapp bleiben.",
        "Vor diesem Hintergrund wird analysiert, wie sich die Zahl der inserierten Eigentumswohnungen, Ein- und Zweifamilienhäuser sowie Mietwohnungen seit dem ersten Quartal 2022 verändert hat. Neben der bundesweiten Entwicklung werden Unterschiede zwischen Regionstypen und den zehn größten Städten betrachtet. Ziel ist es, die Preisentwicklung um eine zentrale Mengenperspektive zu ergänzen und besser einzuordnen, in welchem Maß veränderte Nachfrage, längere Vermarktungszeiten, geringe Umzugsmobilität und schwache Bautätigkeit die aktuelle Marktlage prägen.",
      ],
      charts: [],
    },
    {
      kicker: "Kapitel 2. Entwicklung der Wohnimmobilienpreise in Deutschland",
      title: "Kaufpreise leicht im Plus, Mieten steigen weiter deutlich",
      intro: [
        "Im Kaufsegment setzt sich die Stabilisierung im zweiten Quartal 2026 fort. Gegenüber dem Vorjahresquartal verteuern sich sowohl Eigentumswohnungen als auch Ein- und Zweifamilienhäuser um 0,8 Prozent. Im Vergleich zum Vorquartal steigen die Preise für Eigentumswohnungen leicht um 0,2 Prozent, bei Ein- und Zweifamilienhäusern fällt der Zuwachs mit 1,0 Prozent etwas deutlicher aus. Insgesamt bewegen sich die Kaufpreise damit weiterhin weitgehend seitwärts, nachdem sie seit Mitte 2022 erheblich zurückgegangen waren.",
        "Die moderate Preisentwicklung ist vor dem Hintergrund der weiterhin anspruchsvollen Finanzierungsbedingungen plausibel. Das Zinsniveau begrenzt nach wie vor die finanziellen Spielräume vieler Haushalte. Gleichzeitig spricht die zuletzt wieder leicht positive Entwicklung dafür, dass sich der Markt nach der deutlichen Preiskorrektur zunehmend stabilisiert.",
        "Die Wohnkosten steigen damit inzwischen wieder recht kontinuierlich in beiden Marktsegmenten. Während sich die Kaufpreise bislang nur leicht erhöhen, setzen die Angebotsmieten ihren deutlich stärkeren Anstieg fort. Gegenüber dem Vorjahresquartal beträgt das Plus 4,0 Prozent, gegenüber dem Vorquartal 1,3 Prozent.",
      ],
      charts: [figures.nationalIndex, ...figures.nationalIndexAnimatedSteps],
      // Abbildung 2-1 runs twice here: finished, then rebuilt step by step.
      // `after` is how many figures precede the note, so the split below stays
      // right if figures are added or reordered.
      interlude: {
        after: 1,
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
  <!-- Absolute URLs: scrapers (Slack, WhatsApp, LinkedIn) don't resolve
       relative image paths, hence the origin prefix. TODO: static/share-image.jpg
       does not exist on this branch yet — drop an IW-Wohnindex share card there
       (1200×630 is the safe default; update the width/height below if the file
       Sandra supplies has other dimensions). -->
  <meta property="og:image" content="{page.url.origin}/share-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={meta.title} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="twitter:image" content="{page.url.origin}/share-image.jpg" />
</svelte:head>

<Header links={tocLinks} />
<ChapterRail {sections} />

<div id="top">
  <Landing />

  <div id="charts"></div>
  {#each sections as section (section.id)}
    <!-- min-h rather than h: a short intro still fills the viewport and sticks,
         a long one (chapter 1) grows the pane instead of being clipped into a
         nested scroller. -->
    <section id={section.id} class="font-sans text-base-content lg:min-h-[140vh]">
      <div class="lg:sticky lg:top-0 lg:min-h-screen lg:bg-base-100">
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
    <!-- An `interlude` splits the chapter's figures into two scrolly runs with
         a text pause between them; the second run continues the figure
         numbering via indexOffset (see ScrollySection). -->
    {#if section.interlude}
      <ScrollySection
        pairs={section.charts.slice(0, section.interlude.after)}
        sectionId={section.id}
      />
      <Interlude {...section.interlude} />
      <ScrollySection
        pairs={section.charts.slice(section.interlude.after)}
        sectionId={section.id}
        indexOffset={section.interlude.after}
      />
    {:else if section.charts.length > 0}
      <ScrollySection pairs={section.charts} sectionId={section.id} />
    {/if}
  {/each}
</div>

<Footer />
