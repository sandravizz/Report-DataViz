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

  // Sections follow the IDA_GIZ_KAdequacyModel presentation's narrative:
  // IDA's growth, financing that growth, and IDA's future.
  const sections = [
    {
      id: "financing-ida",
      title: "Financing IDA's Growth",
      intro:
        "IDA's balance sheet has grown from about USD 197 billion in 2017 to USD 281 billion in 2025. Most of it is financed by equity, but equity's share of assets is declining — from over 80% in 2017 to 73% in 2025 — as IDA increasingly borrows to fund its growth (Figure 1).",
      charts: [figures.equityShare],
    },
    {
      id: "the-objective",
      title: "IDA's Future: Cliff or No Cliff?",
      intro:
        "The ambition for IDA is to maintain an overall disbursement pace similar to the past 10 years. The alternative — the IDA cliff — is flat or declining disbursements (Figure 2).",
      charts: [figures.idaObjective],
    },
    {
      id: "largest-fund",
      title: "The Largest Fund for Poor Countries",
      intro:
        "IDA is the largest source of concessional finance for the world's poorest countries: its loans represent 40% of all disbursements to eligible countries, and its grants around 20% of all grants they receive (Figure 3).",
      charts: [figures.idaLoans],
    },
  ];
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

<Header />

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
