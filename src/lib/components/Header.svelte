<script>
  import { onMount } from "svelte";

  // Permanently solid/blurred: the hero is plain white, so there's no
  // scroll-over-photo transparency to handle (docs/sandraviz-brand.md).
  let { sections = [] } = $props();

  // The Table of Contents is a real <details>, not daisyUI's focus-driven
  // dropdown. The focus version is what made the cover's credit links
  // untappable on a phone: the panel is held open by `:focus-within`, so the
  // first tap anywhere else is spent blurring the trigger and never reaches
  // the link under it — you have to tap sandraviz.com twice, which reads as
  // the menu blocking the link. <details> has no focus to spend, and daisyUI
  // excludes `details` from its closed-state rule precisely because the
  // element already hides its own content, so a shut menu is not in the
  // document's way at all.
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

  // Matches Footer.svelte's pair.
  const socials = [
    {
      label: "GitHub",
      href: "https://github.com/sandravizz",
      viewBox: "0 0 24 24",
      size: "size-4.5",
      path: "M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.804 5.624-5.476 5.92.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 21.795 24 17.297 24 12c0-6.627-5.373-12-12-12Z",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sandraviz/",
      viewBox: "0 0 24 24",
      size: "size-4.5",
      path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.266 2.37 4.266 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
    },
  ];
</script>

<header class="relative z-50 shrink-0 bg-base-200/80 backdrop-blur-sm">
  <div class="relative flex items-center justify-end gap-4 px-6 py-3">
    <nav class="flex items-center gap-4 text-base-content sm:gap-6 lg:gap-8">
      <details class="dropdown dropdown-end" bind:this={toc}>
        <!-- `list-none` plus the webkit marker rule strip the disclosure
             triangle a <summary> paints by default; without both, Safari keeps
             showing one. `cursor-pointer` is explicit because a summary does
             not get the hand on its own the way a link does. -->
        <summary
          aria-label="Table of Contents"
          class="[&::-webkit-details-marker]:hidden cursor-pointer list-none px-2 py-2 font-sans text-sm underline decoration-accent decoration-2 underline-offset-8 outline-none"
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
             under the same hairline connector. daisyUI's `menu` class is
             dropped rather than restyled — its own padding and hover rules
             would fight every one of those. The dots are all idle here; unlike
             the rail this panel is a destination list, not a position
             indicator. -->
        <ul
          class="dropdown-content z-50 mt-2 flex w-80 max-w-[calc(100vw-2rem)] list-none flex-col gap-4 rounded-2xl bg-base-200 px-5 py-4 font-sans text-base-content shadow-lg"
        >
          {#each sections as section (section.id)}
            <li class="group/chapter flex flex-col">
              <a
                href="#{section.id}"
                onclick={closeToc}
                class="group -m-1.5 flex items-start gap-3 p-1.5 text-left"
              >
                <span
                  class="mt-0.5 block h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-base-content/35 bg-transparent transition-all duration-200 group-hover/chapter:scale-[0.6] group-hover/chapter:border-base-content group-hover/chapter:bg-base-content group-hover/chapter:ring-[9px] group-hover/chapter:ring-base-content/10"
                ></span>
                <span
                  class="text-sm leading-snug text-base-content/55 transition-colors duration-200 group-hover:text-base-content"
                >
                  {section.shortTitle}
                </span>
              </a>

              {#if section.charts?.length}
                <ul
                  class="mt-2 ml-1.5 flex list-none flex-col gap-1.5 border-l border-base-content/15 py-0.5 pl-4"
                >
                  {#each section.charts as chart, i (chart.number ?? i)}
                    <li>
                      <a
                        href="#{section.id}-chart-{i}"
                        onclick={closeToc}
                        class="block text-xs leading-snug text-base-content/45 transition-colors duration-200 hover:text-base-content"
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
            class="text-neutral hover:text-primary"
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
