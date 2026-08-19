<script>
  // `sections` is the same list the ChapterRail navigates, so the Table of
  // Contents can nest each chapter's figures under it rather than showing a
  // flat list of chapter links.
  let { sections = [] } = $props();

  function closeDropdown(event) {
    event.currentTarget.closest(".dropdown")?.querySelector("[role='button']")?.blur();
    event.currentTarget.blur();
  }

  // The Kiel Institute's own channels, in the order their site footer lists
  // them (LinkedIn, X, Bluesky, Facebook, YouTube).
  const socials = [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/kiel-institute-for-the-world-economy/",
      viewBox: "0 0 640 640",
      size: "h-4 w-4",
      path: "M512 96L127.9 96C110.3 96 96 110.5 96 128.3L96 511.7C96 529.5 110.3 544 127.9 544L512 544C529.6 544 544 529.5 544 511.7L544 128.3C544 110.5 529.6 96 512 96zM231.4 480L165 480L165 266.2L231.5 266.2L231.5 480L231.4 480zM198.2 160C219.5 160 236.7 177.2 236.7 198.5C236.7 219.8 219.5 237 198.2 237C176.9 237 159.7 219.8 159.7 198.5C159.7 177.2 176.9 160 198.2 160zM480.3 480L413.9 480L413.9 376C413.9 351.2 413.4 319.3 379.4 319.3C344.8 319.3 339.5 346.3 339.5 374.2L339.5 480L273.1 480L273.1 266.2L336.8 266.2L336.8 295.4L337.7 295.4C346.6 278.6 368.3 260.9 400.6 260.9C467.8 260.9 480.3 305.2 480.3 362.8L480.3 480z",
    },
    {
      label: "X",
      href: "https://twitter.com/kielinstitute",
      viewBox: "0 0 640 640",
      size: "h-4 w-4",
      path: "M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z",
    },
    {
      label: "Bluesky",
      href: "https://bsky.app/profile/kiel.institute",
      viewBox: "0 0 640 640",
      size: "h-4 w-4",
      path: "M439.8 358.7C436.5 358.3 433.1 357.9 429.8 357.4C433.2 357.8 436.5 358.3 439.8 358.7zM320 291.1C293.9 240.4 222.9 145.9 156.9 99.3C93.6 54.6 69.5 62.3 53.6 69.5C35.3 77.8 32 105.9 32 122.4C32 138.9 41.1 258 47 277.9C66.5 343.6 136.1 365.8 200.2 358.6C203.5 358.1 206.8 357.7 210.2 357.2C206.9 357.7 203.6 358.2 200.2 358.6C106.3 372.6 22.9 406.8 132.3 528.5C252.6 653.1 297.1 501.8 320 425.1C342.9 501.8 369.2 647.6 505.6 528.5C608 425.1 533.7 372.5 439.8 358.6C436.5 358.2 433.1 357.8 429.8 357.3C433.2 357.7 436.5 358.2 439.8 358.6C503.9 365.7 573.4 343.5 593 277.9C598.9 258 608 139 608 122.4C608 105.8 604.7 77.7 586.4 69.5C570.6 62.4 546.4 54.6 483.2 99.3C417.1 145.9 346.1 240.4 320 291.1z",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/kielinstitute",
      viewBox: "0 0 640 640",
      size: "h-4 w-4",
      path: "M576 320C576 178.6 461.4 64 320 64S64 178.6 64 320C64 440.8 147.7 542.1 260.2 569.9L260.2 398.2L207 398.2L207 320L260.2 320L260.2 286C260.2 198.2 300 157.5 386.2 157.5C402.5 157.5 430.7 160.7 442.3 163.9L442.3 234.8C436.2 234.2 425.5 233.8 412.2 233.8C369.8 233.8 353.5 249.9 353.5 291.6L353.5 320L438.1 320L423.6 398.2L353.5 398.2L353.5 575.6C481.4 560.1 576 451.6 576 320z",
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/channel/UC6KEgfpzS6ucREQj1vVr0wA",
      viewBox: "0 0 640 640",
      size: "h-4 w-4",
      path: "M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z",
    },
  ];
</script>

<header class="absolute inset-x-0 top-0 z-20 bg-base-100/90 backdrop-blur-sm">
  <div class="flex items-center justify-between gap-4 px-6 py-3">
    <a
      href="https://www.kielinstitut.de/"
      target="_blank"
      rel="noopener"
      class="shrink-0 hover:opacity-70"
      aria-label="Kiel Institute for the World Economy"
    >
      <img
        src="/kiel-logo.svg"
        alt="Kiel Institute for the World Economy"
        class="h-8 w-auto sm:h-10"
      />
    </a>

    <nav class="flex items-center gap-4 sm:gap-6 lg:gap-8">

      <div class="dropdown dropdown-end">
        <div
          tabindex="0"
          role="button"
          aria-label="Table of Contents"
          class="cursor-pointer px-2 py-2 font-sans text-sm underline decoration-accent decoration-2 underline-offset-8 outline-none"
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
        </div>
        <!-- Same panel as ChapterRail's hover flyout, deliberately: rounded,
             a hollow dot per chapter, and the figures nested under an orange
             connector. daisyUI's `menu` class is dropped rather than restyled
             — its own padding and hover rules would fight all of that. The
             dots are all idle here; unlike the rail this is a destination
             list, not a position indicator. It keeps bg-base-200 (not the
             base-100 the other branches use) because it opens over the cover,
             which is itself base-100 cream — a base-100 card would have no
             edge against it. -->
        <ul
          tabindex="-1"
          class="dropdown-content z-50 mt-2 flex w-80 max-w-[calc(100vw-2rem)] list-none flex-col gap-4 rounded-2xl bg-base-200 px-5 py-4 font-sans text-base-content shadow-lg"
        >
          {#each sections as section (section.id)}
            <li class="flex flex-col">
              <a
                href="#{section.id}"
                onclick={closeDropdown}
                class="group -m-1.5 flex items-start gap-3 p-1.5 text-left"
              >
                <span
                  class="mt-0.5 block h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-base-content/35 bg-transparent transition-all duration-200 group-hover:border-base-content/70 group-hover:bg-base-content/15"
                ></span>
                <span
                  class="text-sm leading-snug text-base-content/55 transition-colors duration-200 group-hover:text-base-content"
                >
                  {section.title}
                </span>
              </a>

              {#if section.charts?.length}
                <ul
                  class="mt-2 ml-1.5 flex list-none flex-col gap-1.5 border-l-2 border-accent py-0.5 pl-4"
                >
                  {#each section.charts as chart, i (chart.number ?? i)}
                    <li>
                      <a
                        href="#{section.id}-chart-{i}"
                        onclick={closeDropdown}
                        class="block text-xs leading-snug text-base-content/70 transition-colors duration-200 hover:text-base-content"
                      >
                        <span class="font-medium">{chart.number}</span>
                        {chart.title}
                      </a>
                    </li>
                  {/each}
                </ul>
              {/if}
            </li>
          {/each}
        </ul>
      </div>

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
