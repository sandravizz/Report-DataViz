<script>
  import GlobeMark from './GlobeMark.svelte';
</script>

<!-- Cover, built on the institute's own page-header pattern (a small sans
     "lead" label above the headline, the headline in Suisse Intl Medium at
     line-height 1 with -1px letter-spacing, running text in Suisse Works
     serif) with the Economic Outlook's own cover furniture: issue number,
     title, authors, research group, and the date the forecast was closed. -->
<section class="flex min-h-screen flex-col px-6 pt-24 pb-10 font-sans text-base-content sm:px-10 md:px-14">
  <div class="grid flex-1 items-center gap-10 md:grid-cols-[5fr_7fr] md:gap-16">
    <div class="max-w-xl">
      <div class="text-lg font-medium tracking-[-0.5px] text-base-content/70">
        Economic Outlook · Nr. 133, 2026 | Q2
      </div>
      <h1 class="mt-2 text-4xl leading-none font-medium tracking-[-1px] sm:text-5xl md:text-[3.4375rem]">
        World Economy in Summer 2026
      </h1>
      <p class="mt-5 font-serif text-xl leading-snug text-base-content/80 sm:text-2xl">
        Iran War Still Weighs on Growth
      </p>
      <p class="mt-6 font-serif text-base leading-relaxed text-base-content/80 sm:text-lg">
        Klaus-Jürgen Gern, Stefan Kooths, Johanna Krohn, Wan-Hsin Liu and Jan Reents · Research
        Group Business Cycles and Growth · Finalized June 10, 2026
      </p>
      <p class="mt-4 font-serif text-base text-base-content/80 sm:text-lg">
        Content &amp; data:
        <a
          href="https://www.kielinstitut.de/"
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
