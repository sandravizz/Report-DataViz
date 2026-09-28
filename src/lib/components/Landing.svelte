<script>
  import CoverEngraving from "$lib/components/CoverEngraving.svelte";

  // LinkedIn URLs still to come from the client — href="#" until then.
  const authors = [
    { name: "Mathilde Barras", href: "#" },
    { name: "Martin Kessler", href: "#" },
    { name: "Stephen Paduano", href: "#" },
  ];
</script>

<!-- Cover: title block left, engraved cliff right (after silverlinings.bio's
     cover), on the chapter ground. From md up the two sit side by side; below
     md the engraving stacks above the title. Header is absolutely positioned
     (see Header.svelte) and floats on top of this — it isn't fixed, so it
     scrolls away with the cover. -->
<!-- The engraving is drawn from the Preikestolen photo (CC0, via Wikimedia
     Commons: File:Preikestolen (Unsplash).jpg — public domain, no attribution
     needed); see CoverEngraving.svelte. Chosen over the full-bleed photo and
     three other treatments (dot field, ridgelines, diagram) on 2026-09-28. -->
<!-- `data-accent-cursor` marks this block as the one place the accent dot
     cursor replaces the system pointer. CursorDot.svelte looks for the
     attribute, so moving or removing the zone is done here, not there. -->
<section
  data-accent-cursor
  class="relative flex min-h-screen flex-col bg-base-200 font-sans text-base-content md:flex-row"
>
  <!-- The engraving starts below the header row (logo ~44px + py-3), so the
       figure's "2030" tag never runs into the Index button or the icons. -->
  <div class="relative h-[58vh] shrink-0 md:order-last md:h-auto md:w-[54%]">
    <div class="absolute inset-x-0 top-20 bottom-0 md:top-28">
      <CoverEngraving />
    </div>
  </div>

  <div
    class="relative flex flex-1 flex-col px-6 pt-4 pb-8 sm:px-10 md:w-[46%] md:pt-24 md:pl-[6vw]"
  >
    <div class="flex flex-1 flex-col justify-center">
      <!-- Sized against vh as well as vw so the cover always fits one screen. -->
      <h1
        class="max-w-xl font-display text-[clamp(2rem,min(8vw,6vh),2.75rem)] leading-tight font-semibold text-balance md:text-[clamp(2.25rem,min(4.4vw,7.5vh),3.75rem)]"
      >
        IDA 2030: Cliff or no cliff?
      </h1>
      <!-- nowrap per name so a surname never wraps alone. -->
      <p class="mt-6 max-w-sm text-lg sm:max-w-none sm:text-xl">
        {#each authors as author, i (author.name)}
          <a href={author.href} class="link-hover whitespace-nowrap underline-offset-4"
            >{author.name}</a
          >{i < authors.length - 1 ? ", " : ""}
        {/each}
      </p>
      <p class="mt-2 text-lg sm:text-xl">
        <a
          href="https://findevlab.org"
          target="_blank"
          rel="noopener"
          class="link-hover underline-offset-4">Finance for Development Lab</a
        >
      </p>
      <!-- Placeholder publication date until the client confirms the real one. -->
      <p class="mt-2 text-sm text-base-content/70 sm:text-base">September 1, 2026 | Report</p>
    </div>

    <a
      href="#charts"
      aria-label="Scroll to content"
      class="mt-8 self-start text-base-content/60 hover:text-base-content"
    >
      <svg
        class="h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m5 9 7 7 7-7" />
      </svg>
    </a>
  </div>
</section>
