<script>
  import { onMount } from "svelte";

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

  const socials = [
    {
      label: "Bluesky",
      href: "https://bsky.app/profile/wid.world",
      viewBox: "0 0 640 640",
      size: "h-4 w-4",
      path: "M439.8 358.7C436.5 358.3 433.1 357.9 429.8 357.4C433.2 357.8 436.5 358.3 439.8 358.7zM320 291.1C293.9 240.4 222.9 145.9 156.9 99.3C93.6 54.6 69.5 62.3 53.6 69.5C35.3 77.8 32 105.9 32 122.4C32 138.9 41.1 258 47 277.9C66.5 343.6 136.1 365.8 200.2 358.6C203.5 358.1 206.8 357.7 210.2 357.2C206.9 357.7 203.6 358.2 200.2 358.6C106.3 372.6 22.9 406.8 132.3 528.5C252.6 653.1 297.1 501.8 320 425.1C342.9 501.8 369.2 647.6 505.6 528.5C608 425.1 533.7 372.5 439.8 358.6C436.5 358.2 433.1 357.8 429.8 357.3C433.2 357.7 436.5 358.2 439.8 358.6C503.9 365.7 573.4 343.5 593 277.9C598.9 258 608 139 608 122.4C608 105.8 604.7 77.7 586.4 69.5C570.6 62.4 546.4 54.6 483.2 99.3C417.1 145.9 346.1 240.4 320 291.1z",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/world_inequality_lab/",
      viewBox: "0 0 640 640",
      size: "h-4 w-4",
      path: "M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/28614308/",
      viewBox: "0 0 640 640",
      size: "h-4 w-4",
      path: "M512 96L127.9 96C110.3 96 96 110.5 96 128.3L96 511.7C96 529.5 110.3 544 127.9 544L512 544C529.6 544 544 529.5 544 511.7L544 128.3C544 110.5 529.6 96 512 96zM231.4 480L165 480L165 266.2L231.5 266.2L231.5 480L231.4 480zM198.2 160C219.5 160 236.7 177.2 236.7 198.5C236.7 219.8 219.5 237 198.2 237C176.9 237 159.7 219.8 159.7 198.5C159.7 177.2 176.9 160 198.2 160zM480.3 480L413.9 480L413.9 376C413.9 351.2 413.4 319.3 379.4 319.3C344.8 319.3 339.5 346.3 339.5 374.2L339.5 480L273.1 480L273.1 266.2L336.8 266.2L336.8 295.4L337.7 295.4C346.6 278.6 368.3 260.9 400.6 260.9C467.8 260.9 480.3 305.2 480.3 362.8L480.3 480z",
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/channel/UCARvviXwbZMoI31TjyZ14zw",
      viewBox: "0 0 640 640",
      size: "h-4 w-4",
      path: "M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z",
    },
  ];
</script>

<!-- Absolute, never fixed or sticky: the header belongs to the landing screen
     and scrolls away with it, leaving the figures the full viewport. It is
     transparent and white because it now floats on Landing's cover photo;
     z-20 keeps it under the chapter rail's z-40. -->
<header class="absolute inset-x-0 top-0 z-20 text-white">
  <div class="flex items-center justify-between gap-4 px-6 py-3">
    <a href="https://globaljusticeproject.wid.world/insight/summary/" class="shrink-0 hover:opacity-70" aria-label="Global Justice Project — source report">
      <img src="/gjp-logo-accent.svg" alt="Global Justice Project" class="h-9 w-auto sm:h-11" />
    </a>

    <nav class="flex items-center gap-4 sm:gap-6 lg:gap-8">
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
             under an accent connector. daisyUI's `menu` class is dropped
             rather than restyled — its own padding and hover rules would fight
             every one of those. The dots are all idle here; unlike the rail
             this panel is a destination list, not a position indicator — but
             hover matches the rail exactly (the accent core shrinks by a
             scale transform while a wide translucent halo opens around it),
             and a figure row is one uniform tone, number included. -->
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
                  class="mt-0.5 block h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-base-content/35 bg-transparent transition-all duration-200 group-hover/chapter:scale-[0.6] group-hover/chapter:border-accent group-hover/chapter:bg-accent group-hover/chapter:ring-[9px] group-hover/chapter:ring-accent/25"
                ></span>
                <span
                  class="text-sm leading-snug text-base-content/55 transition-colors duration-200 group-hover:text-base-content"
                >
                  {section.title}
                </span>
              </a>

              {#if section.charts?.length}
                <ul class="mt-2 ml-1.5 flex list-none flex-col gap-1.5 border-l-2 border-accent py-0.5 pl-4">
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
            class="text-accent/80 hover:text-accent"
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
