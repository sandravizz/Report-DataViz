<script>
  import GlobeMark from './GlobeMark.svelte';
</script>

<!-- Cover, built on the institute's own page-header pattern (see
     kielinstitut.de/institute/research-centers/global-transformation/): a
     small sans "lead" label above the headline, the headline itself in
     Suisse Intl Medium at line-height 1 with -1px letter-spacing, then the
     running text in Suisse Works serif. Copy is the research center's own,
     standing in until the report text arrives. -->
<section class="flex min-h-screen flex-col px-6 pt-24 pb-10 font-sans text-base-content sm:px-10 md:px-14">
  <div class="grid flex-1 items-center gap-10 md:grid-cols-[5fr_7fr] md:gap-16">
    <div class="max-w-xl">
      <div class="text-lg font-medium tracking-[-0.5px] text-base-content/70">
        Research Center
      </div>
      <h1 class="mt-2 text-4xl leading-none font-medium tracking-[-1px] sm:text-5xl md:text-[3.4375rem]">
        Global Transformation
      </h1>
      <p class="mt-6 font-serif text-lg leading-relaxed text-base-content/80 sm:text-xl">
        The global economy is confronted with far-reaching changes — the ecological
        transformation, adaptation to climate change, and the regional disparities and conflicts
        these promote.
      </p>
      <p class="mt-6 font-serif text-base text-base-content/80 sm:text-lg">
        Content &amp; data:
        <a
          href="https://www.kielinstitut.de/institute/research-centers/global-transformation/"
          target="_blank"
          rel="noopener"
          class="link-hover underline-offset-4">Kiel Institute for the World Economy</a
        > (2026)
      </p>
      <p class="mt-2 font-serif text-sm text-base-content/60 sm:text-base">
        Interactive design study ·
        <a
          href="https://www.sandraviz.com/"
          target="_blank"
          rel="noopener"
          class="underline underline-offset-4">SandraViz</a
        >
      </p>
    </div>

    <div class="justify-self-center text-primary/20 md:justify-self-end">
      <GlobeMark class="w-44 sm:w-56 md:w-72 lg:w-80" />
    </div>
  </div>
</section>
