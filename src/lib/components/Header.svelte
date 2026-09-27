<script>
  import { onMount } from "svelte";

  // Header overlays the landing hero photo (absolutely positioned over
  // Landing's image, transparent background) rather than sitting in normal
  // flow with its own bar — see Landing.svelte's scrim. So logo/nav/icons use
  // white instead of FDL's slate/neutral brand colors, which would vanish
  // against the photo.
  //
  // `sections` is the chapter list from +page.svelte, the same array the
  // chapter rail gets: `{ id, title, charts }`. The Table of Contents lists
  // the chapters and nests each chapter's figures under it, so the two
  // navigations show the report at the same depth.
  let { sections = [] } = $props();

  // The Table of Contents is a real <details>, not daisyUI's focus-driven
  // dropdown. The focus version is what made the cover's credit links
  // untappable on a phone: the panel is held open by `:focus-within`, so the
  // first tap anywhere else is spent blurring the trigger and never reaches
  // the link under it — you have to tap an author name twice, which reads as
  // the menu blocking the link. <details> has no focus to spend, and daisyUI
  // excludes `details` from its closed-state rule precisely because the
  // element already hides its own content, so a shut menu is not in the
  // document's way at all. Ported from main.
  let toc = $state(null);

  function closeToc() {
    if (toc) toc.open = false;
  }

  onMount(() => {
    // Native <details> does not close when you tap elsewhere, so restore that.
    // `pointerdown` in the CAPTURE phase is the whole trick: it closes the
    // panel before the tap resolves but never consumes it, so the same tap
    // still activates whatever it landed on.
    function onPointerDown(event) {
      if (toc?.open && event.target instanceof Node && !toc.contains(event.target)) {
        toc.open = false;
      }
    }
    function onKeydown(event) {
      if (event.key === "Escape") closeToc();
    }
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeydown);
    };
  });

  // FDL's real profiles, from findevlab.org's page footer.
  const socials = [
    {
      label: "X",
      href: "https://twitter.com/FinDevLab",
      viewBox: "0 0 24 24",
      size: "h-4 w-4",
      path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/channel/UCMGiUdxQUqTkl755-AB_qfA",
      viewBox: "0 0 24 24",
      size: "h-4 w-4",
      path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/finance-for-development-lab/",
      viewBox: "0 0 24 24",
      size: "h-4 w-4",
      path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    },
    {
      label: "Bluesky",
      href: "https://bsky.app/profile/findevlab.bsky.social",
      viewBox: "0 0 24 24",
      size: "h-4 w-4",
      path: "M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.017.275-.036.415-.056-.14.017-.279.036-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.02.279.039.415.056 2.67.296 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z",
    },
  ];
</script>

<header class="absolute inset-x-0 top-0 z-20">
  <div class="flex items-center justify-between gap-4 px-6 py-3">
    <a href="#top" class="shrink-0 hover:opacity-80" aria-label="Back to top">
      <img
        src="/fdl-logo-white.svg"
        alt="FDL — Finance for Development Lab"
        class="h-9 w-auto sm:h-11"
      />
    </a>

    <nav class="flex items-center gap-4 sm:gap-6 lg:gap-8">
      <details class="dropdown dropdown-end" bind:this={toc}>
        <!-- `list-none` plus the webkit marker rule strip the disclosure
             triangle a <summary> paints by default; without both, Safari keeps
             showing one. `cursor-pointer` is explicit because a summary does
             not get the hand on its own the way a link does. The type is FDL's
             own — display caps with the gold underline, not main's accent
             rule. -->
        <summary
          aria-label="Table of Contents"
          class="[&::-webkit-details-marker]:hidden cursor-pointer list-none px-2 py-2 font-display text-sm tracking-wide text-white uppercase decoration-warning decoration-2 underline-offset-8 outline-none hover:underline"
        >
          <svg
            class="h-5 w-5 sm:hidden"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span class="hidden items-center gap-2 sm:flex">
            Table of Contents
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </summary>
        <!-- Same panel as ChapterRail's hover flyout, deliberately: rounded-2xl
             on px-5 py-4, a hollow dot per chapter, and the figures nested
             under a connector. daisyUI's `menu` class is dropped rather than
             restyled — its own padding and hover rules would fight every one
             of those. The dots are all idle here; unlike the rail this panel
             is a destination list, not a position indicator — but hover
             matches the rail exactly (the primary core shrinks by a scale
             transform while a wide translucent halo opens around it), and a
             figure row is one uniform tone, number included.
             The tokens are this branch's rail, not main's: primary teal-slate
             for the dots and a base-content hairline for the connector, so the
             accent rust stays reserved for the marks that point. -->
        <ul
          class="dropdown-content z-50 mt-2 flex w-80 max-w-[calc(100vw-2rem)] list-none flex-col gap-4 rounded-2xl bg-base-100 px-5 py-4 font-sans text-base-content shadow-lg"
        >
          {#each sections as section (section.id)}
            <li class="group/chapter flex flex-col">
              <a
                href="#{section.id}"
                onclick={closeToc}
                class="group flex items-start gap-3 -m-1.5 p-1.5 text-left"
              >
                <span
                  class="mt-0.5 block h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-base-content/35 bg-transparent transition-all duration-200 group-hover/chapter:scale-[0.6] group-hover/chapter:border-primary group-hover/chapter:bg-primary group-hover/chapter:ring-[9px] group-hover/chapter:ring-primary/15"
                ></span>
                <span
                  class="text-sm leading-snug text-base-content/55 transition-colors duration-200 group-hover:text-base-content"
                >
                  {section.title}
                </span>
              </a>

              {#if section.charts?.length}
                <ul class="mt-2 ml-1.5 flex list-none flex-col gap-1.5 border-l border-base-content/15 py-0.5 pl-4">
                  {#each section.charts as chart, i (chart.number ?? i)}
                    <li>
                      <a
                        href="#{section.id}-chart-{i}"
                        onclick={closeToc}
                        class="block text-xs leading-snug text-base-content/70 transition-colors duration-200 hover:text-base-content"
                      >
                        {chart.number}
                        {chart.title}
                      </a>
                    </li>
                  {/each}
                </ul>
              {/if}
            </li>
          {/each}
        </ul>
      </details>

      <div class="hidden items-center gap-4 md:flex">
        {#each socials as social (social.href)}
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            class="text-white/80 hover:text-white"
          >
            <svg class={social.size} viewBox={social.viewBox} fill="currentColor">
              <path d={social.path} />
            </svg>
          </a>
        {/each}
      </div>
    </nav>
  </div>
</header>
