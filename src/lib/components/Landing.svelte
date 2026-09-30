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

  // The engraving fills the whole cover at every size, with the title laid
  // over it bottom-left on the dark fjord (2026-09-30). Only the framing
  // differs: a portrait phone sees a narrow slice of the wide crop, so it is
  // centred a little further left (more fjord under the text, figure still in
  // view). focusU is read once when the canvas mounts, so the {#key} below
  // remounts it when this flips.
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

<!-- Cover: the engraving fills the screen and the title block sits over it,
     bottom-left, at every size (2026-09-30; before that the title and the
     engraving sat side by side, and stacked on phones). Header is absolutely
     positioned (see Header.svelte) and floats on top of this — it isn't fixed,
     so it scrolls away with the cover. -->
<!-- The engraving is drawn from the Preikestolen photo (CC0, via Wikimedia
     Commons: File:Preikestolen (Unsplash).jpg — public domain, no attribution
     needed); see CoverEngraving.svelte. Chosen over the full-bleed photo and
     three other treatments (dot field, ridgelines, diagram) on 2026-09-28. -->
<!-- `data-accent-cursor` marks this block as the one place the accent dot
     cursor replaces the system pointer. CursorDot.svelte looks for the
     attribute, so moving or removing the zone is done here, not there. -->
<!-- Sized to the *small* viewport (svh) below md — plain 100vh on iOS Safari
     is taller than what's visible, so the date and arrow ended up under the
     browser toolbar. -->
<section
  data-accent-cursor
  class="relative flex min-h-svh flex-col bg-base-200 font-sans text-base-content md:min-h-screen"
>
  <!-- The engraving starts below the header row (logo ~44px + py-3), so the
       figure's "2030" tag never runs into the Index button or the icons. The
       crop is wide — fjord on the left, cliff and figure centre-right. The
       title block comes later in the DOM, so it paints on top. The image is
       never dimmed, boxed or faded for the text: readability comes from the
       type alone (see the title below). The lens only runs with a real mouse
       (CoverEngraving gates it), so on phones and tablets the cover is still. -->
  <div class="absolute inset-x-0 top-20 bottom-0">
    {#key wide}
      <CoverEngraving
        lens
        crop={{ x: 250, y: 200, w: 1750, h: 1129 }}
        focusU={wide ? 0.55 : 0.47}
        fade={{ left: 0.03, top: 0.03, bottom: 0.12 }}
      />
    {/key}
  </div>

  <div
    class="relative flex flex-1 flex-col px-5 pt-24 pb-6 sm:px-10 md:pb-8 md:pl-[6vw] lg:pb-10"
  >
    <div class="flex max-w-xl flex-1 flex-col justify-end">
      <!-- Sized against vh as well as vw so the cover always fits one screen.
           The block sits BOTTOM-LEFT, over the darkest part of the engraving
           (the fjord), and the image itself is left untouched:
             · the title is a small GOLD PLATE — white on accent bars, one per
               line (box-decoration-clone), in Kapra Regular, the same language
               as the figure's 2030 tag. White on the accent is ~3.9:1, which
               passes for large type only, so only the title goes on gold;
             · the byline is white with a thin ink outline painted under each
               glyph (paint-order: stroke), which keeps it crisp over the lines
               without a box; the authors carry the gold rule always. -->
      <h1
        class="font-display text-[clamp(1.6rem,min(7.5vw,5svh),2.25rem)] leading-[1.45] font-normal text-balance lg:text-[clamp(1.75rem,min(2.6vw,5vh),2.5rem)]"
      >
        <span
          class="box-decoration-clone bg-accent px-[0.3em] pt-[0.12em] pb-[0.06em] text-accent-content"
          >IDA 2030: Cliff or no cliff?</span
        >
      </h1>
      <div
        class="text-white [paint-order:stroke_fill] [-webkit-text-stroke:5px_var(--color-base-content)]"
      >
        <!-- nowrap per name so a surname never wraps alone. -->
        <p class="mt-4 text-base sm:text-lg md:mt-5 md:text-xl">
          {#each authors as author, i (author.name)}
            <a
              href={author.href}
              class="link-hover font-medium whitespace-nowrap underline decoration-accent decoration-2 underline-offset-[6px]"
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
        <p class="mt-1 text-sm text-white/85 sm:text-base md:mt-2">
          October 16, 2026 | Report
        </p>
      </div>
    </div>

    <a
      href="#charts"
      aria-label="Scroll to content"
      class="mt-6 self-start text-white/80 drop-shadow-[0_0_1.5px_rgb(0_0_0)] transition-opacity duration-300 hover:text-white md:mt-8 {scrolled
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
