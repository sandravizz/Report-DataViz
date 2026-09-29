<script>
  import CoverEngraving from "$lib/components/CoverEngraving.svelte";

  // The scroll-down arrow is only an invitation: it fades out the moment the
  // reader starts scrolling (and back in if they return to the very top),
  // rather than riding up the screen with the cover.
  let scrolled = $state(false);
  $effect(() => {
    const onScroll = () => (scrolled = window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

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
<!-- Below md the cover is sized to the *small* viewport (svh) — plain 100vh on
     iOS Safari is taller than what's visible, so the date and arrow ended up
     under the browser toolbar. The engraving takes whatever height the text
     block leaves over, and the text sits centred under it in a clear
     headline → byline → dateline order (after Reuters' mobile story covers).
     From md up it goes back to the side-by-side, left-aligned layout. -->
<section
  data-accent-cursor
  class="relative flex min-h-svh flex-col bg-base-200 font-sans text-base-content md:min-h-screen md:flex-row"
>
  <!-- The engraving starts below the header row (logo ~44px + py-3), so the
       figure's "2030" tag never runs into the Index button or the icons. -->
  <div class="relative min-h-[38svh] flex-1 md:order-last md:min-h-0 md:w-[54%] md:flex-none">
    <div class="absolute inset-x-0 top-20 bottom-0 md:top-28">
      <CoverEngraving />
    </div>
  </div>

  <div
    class="relative flex flex-col items-center px-6 pt-8 pb-6 text-center sm:px-10 md:w-[46%] md:flex-1 md:items-stretch md:pt-24 md:pb-8 md:pl-[6vw] md:text-left"
  >
    <div class="flex flex-1 flex-col justify-center">
      <!-- Sized against vh as well as vw so the cover always fits one screen. -->
      <h1
        class="mx-auto max-w-xl font-display text-[clamp(2.25rem,min(10vw,6.5svh),3rem)] leading-[1.05] font-semibold text-balance md:mx-0 md:text-[clamp(2.25rem,min(4.4vw,7.5vh),3.75rem)] md:leading-tight"
      >
        IDA 2030: Cliff or no cliff?
      </h1>
      <!-- nowrap per name so a surname never wraps alone. -->
      <p class="mt-6 text-base text-balance sm:text-lg md:text-xl md:text-wrap">
        <span class="text-base-content/70 md:hidden">By </span>
        {#each authors as author, i (author.name)}
          <a
            href={author.href}
            class="link-hover font-semibold whitespace-nowrap underline-offset-4 md:font-normal"
            >{author.name}</a
          >{i < authors.length - 1 ? ", " : ""}
        {/each}
      </p>
      <p class="mt-1 text-base sm:text-lg md:mt-2 md:text-xl">
        <a
          href="https://findevlab.org"
          target="_blank"
          rel="noopener"
          class="link-hover underline-offset-4">Finance for Development Lab</a
        >
      </p>
      <!-- Placeholder publication date until the client confirms the real one. -->
      <p class="mt-1 text-sm text-base-content/70 sm:text-base md:mt-2">
        September 1, 2026 | Report
      </p>
    </div>

    <a
      href="#charts"
      aria-label="Scroll to content"
      class="mt-6 self-center text-base-content/60 transition-opacity duration-300 hover:text-base-content md:mt-8 md:self-start {scrolled
        ? 'pointer-events-none opacity-0'
        : 'opacity-100'}"
    >
      <svg
        class="h-7 w-7 md:h-8 md:w-8"
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
