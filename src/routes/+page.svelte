<script>
  import { page } from "$app/state";
  import { figures } from "$lib/data/index.js";

  const meta = {
    title: "IW-Wohnindex Q2 2026 — An Interactive Report",
    description:
      "An interactive report on the IW-Wohnindex Q2 2026 (Institut der deutschen Wirtschaft): German residential property prices and listing volumes. Web development and data visualization by SandraViz.",
  };
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Header from "$lib/components/Header.svelte";
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
        "Der vorliegende IW-Wohnindex untersucht die Entwicklung der Kauf- und Mietpreise für Wohnimmobilien in Deutschland. Der vierteljährig erscheinende Kurzreport präsentiert die Ergebnisse eines hedonischen Preisindex auf der Basis von mehreren Millionen Wohnimmobilieninseraten. Betrachtet werden dabei sowohl inserierte Kaufpreise als auch Neuvertragsmieten.",
        "Der Report fokussiert sich regelmäßig auf die allgemeinen Preisentwicklungen auf dem Kauf- und Mietmarkt und die regionalen Auswertungen nach Regionstypen für die größten deutschen Städte. Als Sonderteil wird in dieser Ausgabe zudem die Entwicklung der Inseratszahlen näher betrachtet.",
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
      charts: [figures.nationalIndex],
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
</svelte:head>

<Header links={tocLinks} />

<div id="top">
  <Landing />

  <div id="charts"></div>
  {#each sections as section (section.id)}
    <section id={section.id} class="font-sans text-base-content lg:h-[140vh]">
      <div class="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:bg-base-100">
        <div class="lg:flex lg:min-h-full">
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
    {#if section.charts.length > 0}
      <ScrollySection pairs={section.charts} />
    {/if}
  {/each}
</div>

<Footer />
