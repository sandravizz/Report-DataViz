<script>
  import { page } from "$app/state";
  import { figures } from "$lib/data/index.js";

  // Look figures up by their name in $lib/data/index.js; names that are
  // commented out there are simply skipped.
  const pick = (...names) => names.map((name) => figures[name]).filter(Boolean);

  const meta = {
    title: "Interactive Report Design by SandraViz",
    description:
      "A scrollytelling report with animated charts — interactive report design by SandraViz. Want your report like this? Get in touch at sandraviz.com.",
  };
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Header from "$lib/components/Header.svelte";
  import Landing from "$lib/components/Landing.svelte";
  import Footer from "$lib/components/Footer.svelte";

  // Sections mirror the summary page at globaljusticeproject.wid.world/insight/summary/
  const sections = [
    {
      id: "ensuring-equality",
      title: "Ensuring Equality and Prosperity for All",
      intro:
        "The Global Justice Platform's basic objective for equality and prosperity is full income convergence across countries by 2100. Today, per capita monthly gross national income ranges from €290 in Sub-Saharan Africa to €4,590 in North America/Oceania – a 16-fold gap. By 2100, all countries converge to €5,000 per month, which implies annual growth rates of around 0-0.5% in today's richest regions and 3-4% in today's poorest – the latter comparable to East Asia's average growth over the last 75 years.",
      charts: pick("incomeGap"),
    },
    {
      id: "working-less",
      title: "Working Less, Achieving Gender Equality",
      intro:
        "Productivity gains are used to reduce work rather than expand material output: annual labour hours decline from about 2,100 today to 1,000 by 2100, in line with two centuries of historical trends. Men and women converge to equal shares of economic and domestic labour with equal average pay, and the economy shifts from material sectors like food and manufacturing toward education, health, leisure and culture.",
      charts: pick("workHours", "genderEquality", "sectorShift"),
    },
    // {
    //   id: "staying-below-2c",
    //   title: "Staying Below 2 °C",
    //   intro:
    //     "Neither sufficiency nor the energy transition can keep warming below 2°C on its own – together they can. These figures compare the cumulative emissions and temperature outcomes of the report's core scenarios, decompose what drives emissions down between 2026 and 2100, and show why targeted sufficiency with structural change outperforms large uniform degrowth: converging to €60,000 per capita with sectoral transformation yields less warming than pushing everyone down to €15,000 without it.",
    //   charts: pick("emissionsScenarios", "emissionDrivers", "targetedSufficiency"),
    // },
    // {
    //   id: "building-platform",
    //   title: "Building the Global Justice Platform",
    //   intro:
    //     "The key institution of the plan is the Global Justice Fund: it collects revenues from a global wealth tax and a global income tax and invests them through a World Sovereign Fund – an active portfolio of sustainable assets stabilizing at about 60% of world GDP, roughly 10% of the world capital stock. Initial accumulation in 2026-2035 is made possible by reinvesting a large part of global tax revenue, especially the wealth tax on billionaires and centimillionaires.",
    //   charts: pick("platformDiagram", "worldSovereignFund"),
    // },
    // {
    //   id: "funding",
    //   title: "Funding It at the Right Scale",
    //   intro:
    //     "Global Justice Fund expenditures average 10.3% of world GDP per year over 2026-2060 – roughly thirty times today's total development aid. Country dividends, allocated on an equal per-capita basis, finance climate investment, health and education in each country, making possible the convergence of per capita education spending from a 1:20 gap today to €8,400 everywhere by 2100.",
    //   charts: pick("fundVsAid", "countryDividends", "educationSpending"),
    // },
    {
      id: "compressing",
      title: "Compressing the Income and Wealth Scale",
      intro:
        "Global inequality compression is both a social justice objective and the condition for financing the transition. The top 10% income share falls from 52% to 18% while the bottom 50% rises from 8% to 38%; the bottom half of wealth holders go from owning 2% of global wealth to 30%; and the billionaire class shrinks from 6.4% of global wealth to 0.05%.",
      charts: pick("incomeShares", "bottom50Wealth", "billionaireClass"),
    },
    // {
    //   id: "coalitions",
    //   title: "Building National and Global Coalitions",
    //   intro:
    //     "Is such a transformation politically feasible? At the world level, 89% of the population double their income or more between 2025 and 2100, and large majorities benefit in every region – the basis for broad national and global coalitions behind the platform.",
    //   charts: pick("incomeGrowth"),
    // },
    // {
    //   id: "democratic-world-order",
    //   title: "Building a Democratic World Order",
    //   intro:
    //     "Who holds the power, and who owes whom? The final figures look at global governance and historical responsibility: the transition from today's IMF voting rights – where Europe and North America hold four times their population share – to one person-one vote by 2050, and the finding that the North-South transfers induced by the Global Justice Fund remain well below what reparations for colonial and climate damages accumulated since 1800 would actually require.",
    //   charts: pick("votingRights", "northSouthTransfers"),
    // },
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
          <div class="mx-auto my-auto w-[88vw] py-24 lg:ml-[calc(43%-400px)] lg:w-200">
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
