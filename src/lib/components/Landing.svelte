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

  // From lg up the engraving runs the full width of the cover with the title
  // laid over it, bottom-left on the dark fjord (2026-09-30), so it needs a
  // wider crop with the fjord to the left of the cliff. The crop is read once
  // when the canvas mounts, so the {#key} below remounts it when this flips.
  let wide = $state(false);
  $effect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const sync = () => (wide = mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  });

  // LinkedIn URLs still to come from the client — href="#" until then.
  const authors = [
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
       figure's "2030" tag never runs into the Index button or the icons.
       Below lg the crop starts 110 photo px lower than the default (cutting
       blank sky) — the figure is at y 284, so the 2030 tag still has room
       above it.
       From lg up (2026-09-30) it leaves the flex row and spans the whole
       cover, with the fjord on the left under the title and the cliff and
       figure centre-right. The title block comes later in the DOM, so it
       paints on top. The image is never dimmed, boxed or faded for the
       text: readability comes from the type alone (see the title below). -->
  <div class="relative min-h-[38svh] flex-1 md:order-last md:min-h-0 md:w-[54%] md:flex-none lg:absolute lg:inset-0 lg:w-auto">
    <div class="absolute inset-x-0 top-20 bottom-0">
      {#key wide}
        {#if wide}
          <CoverEngraving
            lens
            crop={{ x: 250, y: 200, w: 1750, h: 1129 }}
            focusU={0.55}
            fade={{ left: 0.03, top: 0.03, bottom: 0.12 }}
          />
        {:else}
          <CoverEngraving lens crop={{ x: 780, y: 230, w: 1220, h: 1099 }} />
        {/if}
      {/key}
    </div>
  </div>

  <div
    class="relative flex flex-col items-center px-6 pt-8 pb-6 text-center sm:px-10 md:w-[46%] md:flex-1 md:items-stretch lg:w-[46%] lg:flex-none md:pt-24 md:pb-8 md:pl-[6vw] md:text-left lg:pb-10"
  >
    <div class="flex flex-1 flex-col justify-center lg:justify-end">
      <!-- Sized against vh as well as vw so the cover always fits one screen.
           From lg up the block sits BOTTOM-LEFT, over the darkest part of the
           engraving (the fjord), and the image itself is left untouched:
             · the title is a small GOLD PLATE — white on accent bars, one per
               line (box-decoration-clone), in Kapra Regular, the same language
               as the figure's 2030 tag. White on the accent is ~3.9:1, which
               passes for large type only, so only the title goes on gold;
             · the byline is white with a thin ink outline painted under each
               glyph (paint-order: stroke), which keeps it crisp over the lines
               without a box; the authors carry the gold rule always. -->
      <h1
        class="mx-auto max-w-xl font-display text-[clamp(2.25rem,min(10vw,6.5svh),3rem)] leading-[1.05] font-semibold text-balance md:mx-0 md:text-[clamp(2.25rem,min(4.4vw,7.5vh),3.75rem)] md:leading-tight lg:text-[clamp(1.75rem,min(2.6vw,5vh),2.5rem)] lg:leading-[1.45] lg:font-normal"
      >
        <span
          class="lg:box-decoration-clone lg:bg-accent lg:px-[0.3em] lg:pt-[0.12em] lg:pb-[0.06em] lg:text-accent-content"
          >IDA 2030: Cliff or no cliff?</span
        >
      </h1>
      <!-- White-on-fjord byline (lg only); below lg this wrapper changes nothing. -->
      <div
        class="lg:text-white lg:[paint-order:stroke_fill] lg:[-webkit-text-stroke:5px_var(--color-base-content)]"
      >
      <!-- nowrap per name so a surname never wraps alone. -->
      <p class="mt-6 lg:mt-5 text-base text-balance sm:text-lg md:text-xl md:text-wrap">
        <span class="text-base-content/70 md:hidden">By </span>
        {#each authors as author, i (author.name)}
          <a
            href={author.href}
            class="link-hover font-semibold whitespace-nowrap underline-offset-4 md:font-normal lg:font-medium lg:underline lg:decoration-accent lg:decoration-2 lg:underline-offset-[6px]"
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
      <!-- Publication date, confirmed 2026-09-30. -->
      <p class="mt-1 text-sm text-base-content/70 sm:text-base md:mt-2 lg:text-white/85">
        October 16, 2026 | Report
      </p>
      </div>
    </div>

    <a
      href="#charts"
      aria-label="Scroll to content"
      class="mt-6 self-center text-base-content/60 transition-opacity duration-300 hover:text-base-content md:mt-8 md:self-start lg:text-white/70 lg:hover:text-white {scrolled
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
