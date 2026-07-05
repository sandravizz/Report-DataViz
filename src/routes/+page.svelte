<script>
  import { data } from "$lib/data/data";
  import ScrollySection from "$lib/components/ScrollySection.svelte";
  import Header from "$lib/components/Header.svelte";
  import Landing from "$lib/components/Landing.svelte";
  // import Hero from "$lib/components/Hero.svelte";
  import Footer from "$lib/components/Footer.svelte";

  // Sections mirror the summary page at globaljusticeproject.wid.world/insight/summary/
  const sections = [
    {
      id: "at-a-glance",
      title: "Global Justice by 2100 at a Glance",
      items: [
        {
          label: "Equality between countries",
          text: "Average per capita monthly gross national income (PPP Euros 2025) rises to 5,000 Euros in all countries by 2100. Today, it ranges from 290 Euros in Sub-Saharan Africa to 4,590 Euros in North America/Oceania (a 16-fold gap).",
        },
        {
          label: "Less work, more emancipation",
          text: "Annual labour hours per employed person fall from about 2,100 hours today to about 1,000 hours by 2100, continuing the historical trend toward shorter working time.",
        },
        {
          label: "Education and health for all",
          text: "Per capita education spending rises to 8,400 Euros per year across all countries in 2100. Today, it ranges from 210 to 4,140 Euros. Health spending rises to 14,400 euros. Today it ranges from 110 Euros to 8,300 Euros. The share of global working hours devoted to education and health rises from 11% today to 43% in 2100.",
        },
        {
          label: "Full gender equality",
          text: "Women and men converge on equal amounts of economic and domestic labour and on equal average pay.",
        },
        {
          label: "A world below 2 °C",
          text: "Warming reaches 1.8°C under sustainable convergence and fast decarbonization, against over 4°C under persistent inequality and slow decarbonization (current policies).",
        },
        {
          label: "Inequality compression",
          text: "The income scale is compressed to 1 to 5, and the wealth scale to 1 to 10. This represents a major compression of global income inequality, on a scale similar to the reduction achieved in Western and Nordic Europe over the 20th century.",
        },
        {
          label: "Wealth redistribution",
          text: "The bottom 50% global wealth share rises from 2% to 30% (×15), while the top 0.001% share (billionaire class) falls from 6% to 0.05% (÷100) – a striking redistribution.",
        },
        {
          label: "Global Justice Fund",
          text: "Annual expenditures (including country dividends and investment flows) reach 10.3% of world GDP per year on average over the 2026-2060 period. In comparison, current official development aid and the combined budgets of the UN, IMF, and World Bank account for less than 0.4% of world GDP. This is justified by the fact that new climate investments alone will represent 3-4% of world GDP per year in the coming decades and will need to be supplemented by a big push in education and health expenditures to foster global convergence.",
        },
        {
          label: "World Sovereign Fund",
          text: "An active portfolio of sustainable assets reaching 10% of the world capital stock (or equivalently, to 60% of the world GDP). Initial asset accumulation comes from reinvesting a large part of global wealth and income tax revenues over the 2026-2035 period.",
        },
        {
          label: "Global wealth & income taxes",
          text: "A global wealth tax (rising from 0% at 10 times the world average wealth to 20% per year on billionaires) and a global income tax (rising to 90% at the very top), both targeting around 1% of the world population.",
        },
        {
          label: "Large majority benefit in every region",
          text: "About 89% of the world will double their monetary income between 2026 and 2100; over 95% gain in the global South, and between 85–95% in the global North. Over 99% of the population is better off when the valuation of leisure and planetary habitability is included.",
        },
        {
          label: "From global plutocracy to global democracy",
          text: "All inhabitants of the world have equal political voice in the Global Justice Fund and the new international order. Currently, Europe & North America/Oceania have 4x as many votes at the IMF and World Bank as their population share, while Sub-Saharan Africa and South & South-East Asia have 4x fewer votes than their population share.",
        },
        {
          label: "End of exorbitant privileges",
          text: "The creation of an International Clearing Union and a new international currency to put an end to exorbitant privileges, i.e. the fact that rich countries benefit from higher returns on their foreign assets than what they pay on their foreign debt, thereby receiving a financial transfer from poor countries (0.6-0.8% of world GDP per year on average over 2000-2025 period, about twice as much as total development aid).",
        },
      ],
      charts: [],
    },
    {
      id: "ensuring-equality",
      title: "Ensuring Equality and Prosperity for All",
      intro:
        "The Global Justice Platform's basic objective for equality and prosperity is full income convergence across countries by 2100. Today, per capita monthly gross national income ranges from €290 in Sub-Saharan Africa to €4,590 in North America/Oceania – a 16-fold gap. By 2100, all countries converge to €5,000 per month, which implies annual growth rates of around 0-0.5% in today's richest regions and 3-4% in today's poorest – the latter comparable to East Asia's average growth over the last 75 years.",
      charts: data.slice(0, 1),
    },
    {
      id: "working-less",
      title: "Working Less, Achieving Gender Equality",
      intro:
        "Productivity gains are used to reduce work rather than expand material output: annual labour hours decline from about 2,100 today to 1,000 by 2100, in line with two centuries of historical trends. Men and women converge to equal shares of economic and domestic labour with equal average pay, and the economy shifts from material sectors like food and manufacturing toward education, health, leisure and culture.",
      charts: data.slice(1, 4),
    },
    {
      id: "staying-below-2c",
      title: "Staying Below 2 °C",
      intro:
        "Neither sufficiency nor the energy transition can keep warming below 2°C on its own – together they can. These figures compare the cumulative emissions and temperature outcomes of the report's core scenarios, decompose what drives emissions down between 2026 and 2100, and show why targeted sufficiency with structural change outperforms large uniform degrowth: converging to €60,000 per capita with sectoral transformation yields less warming than pushing everyone down to €15,000 without it.",
      charts: data.slice(4, 7),
    },
    {
      id: "building-platform",
      title: "Building the Global Justice Platform",
      intro:
        "The key institution of the plan is the Global Justice Fund: it collects revenues from a global wealth tax and a global income tax and invests them through a World Sovereign Fund – an active portfolio of sustainable assets stabilizing at about 60% of world GDP, roughly 10% of the world capital stock. Initial accumulation in 2026-2035 is made possible by reinvesting a large part of global tax revenue, especially the wealth tax on billionaires and centimillionaires.",
      charts: data.slice(7, 9),
    },
    {
      id: "funding",
      title: "Funding It at the Right Scale",
      intro:
        "Global Justice Fund expenditures average 10.3% of world GDP per year over 2026-2060 – roughly thirty times today's total development aid. Country dividends, allocated on an equal per-capita basis, finance climate investment, health and education in each country, making possible the convergence of per capita education spending from a 1:20 gap today to €8,400 everywhere by 2100.",
      charts: data.slice(9, 12),
    },
    {
      id: "compressing",
      title: "Compressing the Income and Wealth Scale",
      intro:
        "Global inequality compression is both a social justice objective and the condition for financing the transition. The top 10% income share falls from 52% to 18% while the bottom 50% rises from 8% to 38%; the bottom half of wealth holders go from owning 2% of global wealth to 30%; and the billionaire class shrinks from 6.4% of global wealth to 0.05%.",
      charts: data.slice(12, 15),
    },
    {
      id: "coalitions",
      title: "Building National and Global Coalitions",
      intro:
        "Is such a transformation politically feasible? At the world level, 89% of the population double their income or more between 2025 and 2100, and large majorities benefit in every region – the basis for broad national and global coalitions behind the platform.",
      charts: data.slice(15, 16),
    },
    {
      id: "democratic-world-order",
      title: "Building a Democratic World Order",
      intro:
        "Who holds the power, and who owes whom? The final figures look at global governance and historical responsibility: the transition from today's IMF voting rights – where Europe and North America hold four times their population share – to one person-one vote by 2050, and the finding that the North-South transfers induced by the Global Justice Fund remain well below what reparations for colonial and climate damages accumulated since 1800 would actually require.",
      charts: data.slice(16, 18),
    },
  ];
</script>

<Header />

<div id="top">
  <Landing />

  <!-- <Hero /> -->

  <div id="charts"></div>
  {#each sections as section (section.id)}
    <section id={section.id} class="h-[150vh] font-sans text-base-content">
      <div class="sticky top-0 h-screen overflow-y-auto bg-base-100">
        <div class="flex min-h-full">
          <div class="mx-auto my-auto w-[88vw] py-24 lg:ml-[calc(43%-400px)] lg:w-200">
            <h2 class="text-2xl font-semibold sm:text-3xl">{section.title}</h2>
            {#if section.intro}
              <p class="mt-4 text-lg leading-relaxed text-base-content/80">
                {section.intro}
              </p>
            {/if}
            {#if section.items}
              <ul class="mt-4 space-y-4 text-lg leading-relaxed text-base-content/80">
                {#each section.items as item (item.label)}
                  <li>
                    <strong class="text-base-content">{item.label}:</strong>
                    {item.text}
                  </li>
                {/each}
              </ul>
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
