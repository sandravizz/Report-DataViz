<script>
  import StreetMap from "$lib/components/StreetMap.svelte";

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
</script>

<!-- Cover (paris-demo, option J of the cover studies, 2026-11-08): the real
     street map of Paris on main's violet, main roads in spring green, the
     title on the side where the map fades out. The lens shows street names
     (StreetMap.svelte).
     PLACEHOLDER COPY: title, subtitle, publisher and date are to be written.
     ONE SCREEN at every size: the title is sized against svh as well as vw.
     `data-accent-cursor` marks this block as the one place the dot cursor
     replaces the system pointer (CursorDot.svelte, white here).
     Sized to the *small* viewport (svh) below md: plain 100vh on iOS Safari
     is taller than what's visible. -->
<section
  data-accent-cursor
  class="relative flex min-h-svh flex-col bg-secondary font-sans text-white md:min-h-screen"
>
  <StreetMap side="left" />

  <div class="relative flex flex-1 flex-col justify-center px-[6vw] pt-20 pb-6 lg:pt-24">
    <div class="md:max-w-[44vw]">
      <h1
        class="font-serif text-[clamp(2.5rem,min(10vw,11svh),6.5rem)] leading-[1.04] font-bold tracking-[-0.01em] text-balance"
      >
        Report Title
      </h1>
      <p class="mt-4 text-lg sm:text-xl md:mt-5 md:text-2xl">Subtitle of the report</p>
      <p class="mt-6 text-sm md:mt-8 md:text-base">
        <span class="underline decoration-accent decoration-2 underline-offset-4">Publisher</span> · Month 2026
      </p>
    </div>
  </div>

  <a
    href="#charts"
    aria-label="Scroll to content"
    class="relative mx-auto mb-6 text-white/90 transition-opacity duration-300 hover:text-white md:mb-8 {scrolled
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
