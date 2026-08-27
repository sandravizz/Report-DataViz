<script>
  // IW logo left (links to iwkoeln.de); TOC dropdown and IW's own social
  // profiles right. `sections` is the same list the ChapterRail navigates, so the TOC
  // can show the figures nested under their chapter rather than a flat list of
  // chapter links.
  import { onMount } from "svelte";

  let { sections = [] } = $props();

  // The Inhaltsverzeichnis is a real <details>, not daisyUI's focus-driven
  // dropdown. The focus version is what made the cover's credit link
  // untappable on a phone: the panel is held open by `:focus-within`, so the
  // first tap anywhere else is spent blurring the trigger and never reaches
  // the link under it — you have to tap twice, which reads as the menu
  // blocking the link. <details> has no focus to spend, and daisyUI excludes
  // `details` from its closed-state rule precisely because the element already
  // hides its own content, so a shut menu is not in the document's way at all.
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

  // From iwkoeln.de's own footer.
  const socials = [
    {
      label: "LinkedIn",
      href: "https://de.linkedin.com/company/institut-der-deutschen-wirtschaft",
      viewBox: "0 0 18 18",
      size: "size-4.5",
      evenodd: false,
      path: "M16.668 0H1.328C.595 0 0 .58 0 1.297V16.7c0 .716.594 1.3 1.329 1.3h15.339c.734 0 1.332-.584 1.332-1.297V1.297C18 .58 17.402 0 16.668 0ZM5.34 15.339H2.668V6.746H5.34v8.593ZM4.004 5.576A1.548 1.548 0 1 1 4 2.48a1.548 1.548 0 0 1 .005 3.096Zm11.335 9.763H12.67v-4.177c0-.995-.017-2.278-1.388-2.278-1.389 0-1.6 1.086-1.6 2.208v4.247H7.017V6.746h2.56v1.175h.035c.355-.675 1.227-1.389 2.524-1.389 2.704 0 3.203 1.779 3.203 4.092v4.715Z",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/iw_koeln/",
      viewBox: "0 0 20 20",
      size: "size-5",
      evenodd: false,
      path: "M10 1.76c2.238 0 2.518.01 3.397.05.877.04 1.476.18 2 .383.542.21 1.001.493 1.46.95.457.459.74.918.95 1.46.203.524.343 1.123.383 2 .04.879.05 1.16.05 3.397 0 2.238-.01 2.518-.05 3.397-.04.877-.18 1.476-.383 2a4.039 4.039 0 0 1-.95 1.46c-.459.457-.918.74-1.46.95-.524.203-1.123.343-2 .383-.879.04-1.16.05-3.397.05-2.238 0-2.518-.01-3.397-.05-.877-.04-1.476-.18-2-.383a4.037 4.037 0 0 1-1.46-.95 4.038 4.038 0 0 1-.95-1.46c-.203-.524-.343-1.123-.383-2-.04-.879-.05-1.16-.05-3.397 0-2.238.01-2.518.05-3.397.04-.877.18-1.476.383-2 .21-.542.493-1.001.95-1.46.459-.457.918-.74 1.46-.95.524-.203 1.123-.343 2-.383.879-.04 1.16-.05 3.397-.05Zm0 1.485c-2.2 0-2.46.009-3.33.048-.803.037-1.239.171-1.53.284-.384.15-.658.328-.947.616a2.552 2.552 0 0 0-.616.948c-.113.29-.247.726-.284 1.53-.04.868-.048 1.129-.048 3.329s.009 2.46.048 3.33c.037.803.171 1.239.284 1.53.15.384.328.658.616.947.289.288.563.466.948.616.29.113.726.247 1.53.284.868.04 1.129.048 3.329.048s2.46-.009 3.33-.048c.803-.037 1.239-.171 1.53-.284.384-.15.658-.328.947-.616.288-.289.466-.563.616-.948.113-.29.247-.726.284-1.53.04-.869.048-1.13.048-3.329 0-2.2-.009-2.46-.048-3.33-.037-.803-.171-1.239-.284-1.53a2.553 2.553 0 0 0-.616-.947 2.552 2.552 0 0 0-.948-.616c-.29-.113-.726-.247-1.53-.284-.869-.04-1.13-.048-3.329-.048Zm.003 9.427a2.675 2.675 0 1 0 0-5.35 2.675 2.675 0 0 0 0 5.35Zm0-6.795a4.12 4.12 0 1 1 0 8.241 4.12 4.12 0 0 1 0-8.241Zm5.15 0a1.03 1.03 0 1 1-2.06 0 1.03 1.03 0 0 1 2.06 0Z",
    },
  ];
</script>

<!-- Absolute, never fixed or sticky: the header belongs to the landing screen
     and scrolls away with it, leaving the figures the full viewport. z-20 keeps
     it under the chapter rail's z-40. -->
<header class="absolute inset-x-0 top-0 z-20 text-white">
  <div class="flex items-center justify-between gap-4 px-6 py-3">
    <!-- The client's mark goes to the CLIENT, not back up this page: it is
         their logo, so the only thing a reader can expect from clicking it is
         iwkoeln.de. (It used to jump to #top, which is why that id is still on
         the page wrapper — nothing points at it now.) Their own site is all
         the repo has; no deep link to the IW-Wohnindex report page was ever
         captured, and I have not guessed one. -->
    <a
      href="https://www.iwkoeln.de"
      target="_blank"
      rel="noopener"
      class="group shrink-0"
      aria-label="Institut der deutschen Wirtschaft — iwkoeln.de"
    >
      <!-- The mark is painted, not placed: the file is a white SVG, so it is
           used as a MASK and the colour comes from `background-color`. That is
           what lets one asset resting in the accent turn white on hover — an
           <img> can only be swapped or filtered. `aspect-[3/2]` is the SVG's
           own 33×22 viewBox; the mask has to be given a box because a masked
           span has no intrinsic size the way an image does. -->
      <span
        aria-hidden="true"
        class="block aspect-[3/2] h-8 bg-accent transition-colors duration-200 group-hover:bg-white sm:h-9"
        style="mask-image:url('/iw-logo-white.svg');mask-size:contain;mask-repeat:no-repeat;mask-position:center;-webkit-mask-image:url('/iw-logo-white.svg');-webkit-mask-size:contain;-webkit-mask-repeat:no-repeat;-webkit-mask-position:center"
      ></span>
    </a>

    <nav class="flex items-center gap-4 sm:gap-6 lg:gap-8">
      <details class="dropdown dropdown-end" bind:this={toc}>
        <!-- `list-none` plus the webkit marker rule strip the disclosure
             triangle a <summary> paints by default; without both, Safari keeps
             showing one. `cursor-pointer` is explicit because a summary does
             not get the hand on its own the way a link does. -->
        <summary
          aria-label="Inhaltsverzeichnis"
          class="[&::-webkit-details-marker]:hidden cursor-pointer list-none px-2 py-2 font-sans text-sm underline decoration-accent decoration-[3px] underline-offset-8 outline-none sm:px-4"
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
            Inhaltsverzeichnis
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
        <!-- The button above wears the accent at 3px rather than the 2px used
             on light grounds: it rides the dark cover photo, where the blue
             has far less contrast to work with, so the rule buys back in area
             what it cannot get in contrast (same treatment as the credit link
             in Landing.svelte). Inside this panel the ground is light again
             and the accent behaves normally.
             Same panel as ChapterRail's hover flyout, deliberately:
             rounded-2xl on px-5 py-4, a hollow dot per entry, and the figures
             nested under an amber connector. daisyUI's `menu` class is dropped
             rather than restyled — its own padding and hover rules would fight
             every one of those. The dots are all idle here; unlike the rail
             this panel is a destination list, not a position indicator. -->
        <ul
          class="dropdown-content z-50 mt-2 flex w-80 max-w-[calc(100vw-2rem)] list-none flex-col gap-4 rounded-2xl bg-base-100 px-5 py-4 font-sans text-base-content shadow-lg"
        >
          {#each sections as section (section.id)}
            <li class="group/chapter flex flex-col">
              <a
                href="#{section.id}"
                onclick={closeToc}
                class="group -m-1.5 flex items-start gap-3 p-1.5 text-left"
              >
                <span
                  class="mt-0.5 block h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-base-content/35 bg-transparent transition-all duration-200 group-hover/chapter:scale-[0.6] group-hover/chapter:border-primary group-hover/chapter:bg-accent group-hover/chapter:ring-[9px] group-hover/chapter:ring-accent/25"
                ></span>
                <span
                  class="text-sm leading-snug text-base-content/55 transition-colors duration-200 group-hover:text-base-content"
                >
                  {section.title}
                </span>
              </a>

              <!-- Keyed by index: the animated steps share a figure number
                   (and title, hence `stepLabel`). -->
              {#if section.charts?.length}
                <ul
                  class="mt-2 ml-1.5 flex list-none flex-col gap-1.5 border-l-2 border-accent py-0.5 pl-4"
                >
                  {#each section.charts as chart, i (i)}
                    <li>
                      <a
                        href="#{section.id}-chart-{i}"
                        onclick={closeToc}
                        class="block text-xs leading-snug text-base-content/70 transition-colors duration-200 hover:text-base-content"
                      >
                        {chart.number}
                        {chart.stepLabel ?? chart.title}
                      </a>
                    </li>
                  {/each}
                </ul>
              {/if}
            </li>
          {/each}
        </ul>
      </details>

      <!-- Accent at rest, white on hover — the same two states as the IW mark
           to their left, so everything in this header presses the same way.
           The blue is a dark colour on a dark photo (~3.7:1), so at rest these
           glyphs sit quieter than the type around them and the hover is what
           lifts them; that is the intended reading here, with the scrim under
           the cover already tuned to carry the accent (see Landing.svelte). -->
      <div class="hidden items-center gap-4 md:flex">
        {#each socials as social (social.href)}
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            class="text-accent transition-colors duration-200 hover:text-white"
          >
            <svg
              class={social.size}
              viewBox={social.viewBox}
              fill="currentColor"
              fill-rule={social.evenodd ? "evenodd" : undefined}
              clip-rule={social.evenodd ? "evenodd" : undefined}
            >
              <path d={social.path} />
            </svg>
          </a>
        {/each}
      </div>
    </nav>
  </div>
</header>
