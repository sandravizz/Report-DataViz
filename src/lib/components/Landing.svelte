<script>
  import DotGrid from "$lib/components/DotGrid.svelte";

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

  // The title block: the dot grid leaves a window around it.
  let titleBlock = $state(null);
</script>

<!-- Cover, after the deck's own title and section-divider slides
     (2026-10-15): Carta's near-black ground, the coral square-dot grid
     framing a window, and the title in SangBleu Versailles inside it —
     "Q1 2026" a step quieter in grey, the date in Carta's coral tag with its
     white square. The header (fixed, Header.svelte) sits on top; the grid
     starts below it.
     ONE SCREEN at every size: the type is sized against svh as well as vw,
     and the window is cut around the text as it actually wraps, so a narrow
     phone gets a taller window rather than squares through the title.
     `data-accent-cursor` marks this block as the one place the dot cursor
     replaces the system pointer (CursorDot.svelte — white here).
     Sized to the *small* viewport (svh) below md — plain 100vh on iOS Safari
     is taller than what's visible. -->
<section
  data-accent-cursor
  class="relative flex min-h-svh flex-col bg-night font-sans text-white md:min-h-screen"
>
  <div class="absolute inset-x-0 top-14 bottom-0 lg:top-18">
    <DotGrid clear={titleBlock} color="#ff7d55" />
  </div>

  <div class="relative flex flex-1 flex-col items-center justify-center px-5 pt-20 pb-6 sm:px-10 lg:pt-24">
    <div bind:this={titleBlock} class="flex flex-col items-start">
      <!-- Serif at 400, the only weight Carta ships; the size climbs with
           the screen's shorter side so the block always fits one screen. -->
      <h1
        class="font-serif text-[clamp(2.5rem,min(11vw,9svh),6rem)] leading-[1.02] font-normal tracking-[-0.01em] text-balance"
      >
        State of<br />Private Markets<br /><span class="text-[#a7aaaa]">Q1 2026</span>
      </h1>
      <!-- The deck's date tag: coral plate, white square, ink type (6.9:1). -->
      <p
        class="mt-6 inline-flex items-center gap-2.5 bg-primary px-3 py-1.5 text-sm text-primary-content md:mt-8 md:px-4 md:py-2 md:text-base"
      >
        <span class="size-2.5 shrink-0 bg-white md:size-3" aria-hidden="true"></span>
        June 1, 2026 · Carta Data
      </p>
    </div>
  </div>

  <a
    href="#charts"
    aria-label="Scroll to content"
    class="relative mx-auto mb-6 text-white/80 transition-opacity duration-300 hover:text-white md:mb-8 {scrolled
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
</section>
