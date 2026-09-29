<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { cubicIn, quintOut } from "svelte/easing";
  import { HoverGlide } from "$lib/hoverGlide.svelte.js";
  import RollText from "./RollText.svelte";

  // Header overlays the landing cover (absolutely positioned, transparent
  // background) rather than sitting in normal flow with its own bar. The
  // cover is the engraving on the chapter ground, so logo/nav/icons are in
  // the report's ink: the FDL logo recoloured all-black (fdl-logo-black.svg)
  // and base-content. Hover marks are ink, never the accent red (as in
  // ChapterRail — no red in either navigation).
  //
  // `sections` is the chapter list from +page.svelte, the same array the
  // chapter rail gets: `{ id, title, subchapters: [{ id, title, charts }] }`.
  // The Table of Contents lists the chapters and nests each one's
  // sub-chapters under it — two layers only; figures are not listed.
  let { sections = [] } = $props();

  // The Table of Contents is a FULL-PAGE SHEET, not a dropdown (after
  // silverlinings.bio's Index): clicking the trigger lays the contents over
  // the whole page as one large, numbered list — the report's structure read
  // at a glance, rather than a small menu pinned to a corner.
  //
  // It is a native <dialog> opened with showModal(), which is what makes it
  // cheap to get right: the top layer puts it above everything (rail, cursor
  // dot, pinned figures) with no z-index fight, focus is trapped inside it
  // while open, and the page behind is inert to taps and screen readers.
  // A modal dialog does not stop the page scrolling underneath, so that is
  // done by hand.
  //
  // MOTION. The dialog itself is a transparent full-screen frame; what you
  // see is the panel inside it, rendered under `{#if open}` so Svelte's
  // transitions can run on it. Opening, the panel drops down from above the
  // viewport like a blind being pulled, fast out and soft landing (quintOut),
  // with its whole content already on it — nothing inside animates on its
  // own, so the text never appears after the sheet. Closing, it
  // is pulled back up, quicker and accelerating away (cubicIn). The native
  // dialog is only closed once that outro has finished (onoutroend), so the
  // panel never vanishes mid-slide.
  let sheet = $state(null);
  let open = $state(false);
  let reduceMotion = $state(false);
  // The link a reader picked, jumped to again once the dialog is really
  // closed: closing a modal dialog hands focus back to the trigger, which sits
  // on the cover, and the browser may scroll to it.
  let pendingTarget = null;

  const ms = (duration) => (reduceMotion ? 0 : duration);

  // Rows hover with the shared gliding block (lib/hoverGlide.svelte.js).
  const glide = new HoverGlide();

  function openToc() {
    glide.hide();
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sheet?.showModal();
    open = true;
    document.documentElement.style.overflow = "hidden";
  }

  // Starts the slide up. The scroll lock goes at once, so the page behind is
  // already free (and already at the chosen chapter) while the sheet leaves.
  function closeToc() {
    open = false;
    unlock();
  }

  function finishClose() {
    sheet?.close();
    if (pendingTarget) jump(pendingTarget);
    pendingTarget = null;
  }

  // A link jumps the page INSTANTLY behind the sheet, then the sheet slides
  // away to reveal the chapter already in place — rather than the sheet
  // leaving first and the page then scrolling all the way down from the
  // cover. Default navigation is prevented so the jump can be instant even
  // though the page otherwise scrolls smoothly.
  function goTo(event, id) {
    event.preventDefault();
    pendingTarget = id;
    closeToc();
    jump(id);
  }

  function jump(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
  }

  // No close button: a click anywhere on the sheet closes it, except on a
  // chapter, sub-chapter or figure link — those run goTo() instead.
  function onSheetClick(event) {
    if (event.target.closest("a")) return;
    closeToc();
  }

  // Escape: the dialog would close itself instantly, so take over and play
  // the same slide as a click.
  function onCancel(event) {
    event.preventDefault();
    closeToc();
  }

  // Safety net for any close that did not go through closeToc().
  function onSheetClose() {
    open = false;
    unlock();
  }

  function unlock() {
    document.documentElement.style.overflow = "";
  }

  // DESKTOP ONLY (lg+), a trial on this branch: the header is FIXED, so the
  // logo (back to the cover) and the Index stay reachable anywhere in the
  // report. Below lg it is still absolute over the cover and scrolls away.
  // It keeps ONE size throughout — no compacting on scroll (Sandra: the
  // logo changing size after the cover read as a change of header). At lg
  // the logo is the SMALL size everywhere, cover included: a 72px bar
  // (logo h-8 + lg:py-5) on a solid ground so copy never runs through it.
  // (Was py-3, a 56px bar: the logo and Index sat too close to the top edge
  // of the screen, 2026-09-29.) Two things are set from this height — if it
  // changes, change them too: a pinned figure starts below the bar
  // (ChartDisplay's lg:top-24 = 72px + 24px air, and its lg:h- calc), and an
  // Index jump lands a sub-chapter title below it (+page.svelte's
  // lg:scroll-mt-24).
  //
  // The bar is plain base-200: the whole report (text AND pinned figures)
  // sits on that one ground, so the bar is the page's own colour everywhere
  // and never reads as a strip.
  onMount(() => unlock);

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

<!-- The ground is only painted from lg up; below lg the header stays
     transparent over the cover. -->
<header class="absolute inset-x-0 top-0 z-20 lg:fixed lg:bg-base-200">
  <div
    class="flex items-center justify-between gap-4 px-6 py-3 lg:py-5"
  >
    <a href="#top" class="shrink-0 hover:opacity-80" aria-label="Back to the cover">
      <img
        src="/fdl-logo-black.svg"
        alt="FDL — Finance for Development Lab"
        class="h-9 w-auto sm:h-11 lg:h-8"
      />
    </a>

    <nav class="flex items-center gap-4 sm:gap-6 lg:gap-8">
      <!-- FDL's display caps on a SOFT FILL ("option C", 2026-09-29, after
           bleibtgleich.dev's Menu button): ink at 6%, 6px corners, going to
           10% on hover while the word rolls (RollText). The same tint as the
           gliding hover block inside the Index, so trigger and sheet read as
           one family. Opens the sheet below.
           Not the hairline outline the figures' PNG button wears: at header
           size a tall outlined box around full-ink caps read as an empty
           input field, the frame weaker than its contents. py-1.5 keeps it a
           low tab rather than a box. -->
      <button
        type="button"
        onclick={openToc}
        aria-haspopup="dialog"
        aria-label="Index"
        class="group cursor-pointer rounded-md bg-base-content/6 px-3.5 py-1.5 font-display text-sm tracking-wide text-base-content uppercase transition-colors duration-200 hover:bg-base-content/10"
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
        <span class="hidden sm:inline"><RollText text="Index" /></span>
      </button>

      <div class="hidden items-center gap-4 md:flex">
        {#each socials as social (social.href)}
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            class="text-base-content/70 hover:text-base-content"
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

<!-- THE CONTENTS SHEET. Covers the whole viewport on the chapter ground and
     scrolls on its own if the list is longer than the screen. -->
<dialog
  bind:this={sheet}
  onclose={onSheetClose}
  oncancel={onCancel}
  aria-label="Index"
  class="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 backdrop:bg-transparent"
>
  {#if open}
  <!-- The panel that drops. `opacity: 1` keeps fly from fading it: it should
       read as a solid sheet sliding, not a ghost. The shadow is what you see
       of it while it moves — its lower edge passing over the cover. -->
  <!-- Click-to-close has no keyboard twin on this element because Escape
       already closes the dialog (onCancel). -->
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div
    onclick={onSheetClick}
    in:fly={{ y: "-100%", opacity: 1, duration: ms(560), easing: quintOut }}
    out:fly={{ y: "-100%", opacity: 1, duration: ms(380), easing: cubicIn }}
    onoutroend={finishClose}
    class="h-full overflow-y-auto bg-base-200 font-sans text-base-content shadow-[0_12px_40px_rgb(0_0_0/0.18)]"
  >
  <!-- Top bar, now empty: it only keeps the Index heading at the same
       height below the top edge that it had when the close button lived
       here. The sheet closes on any click that is not a link (see
       onSheetClick) or on Escape. -->
  <div class="min-h-[3.75rem] sm:min-h-[4.25rem]" aria-hidden="true"></div>

  <!-- One centred reading column, like the chapter text. Two tiers:
         1.0  CHAPTER       semibold, full ink, hairline rule beneath
         1.1  Sub-chapter   regular, /80 ink, number in a quiet column
       Figures are deliberately NOT listed here any more: the Index is the
       report's outline, chapter and sub-chapter only.
       The number column is a fixed w-10 so every title starts on one line
       down the page. PHONES (below md) get a compact tier: smaller type and
       gaps and a w-8 number column. Both tiers are still shown — content is
       never dropped on a phone. Some scroll is fine.
       Hover is the gliding highlight block (see `glide` above), not an
       underline: chapter rows already carry a rule beneath, so an underline
       read as a second line. A sub-chapter row also goes to full ink.
       The "Index" heading sits pulled up close to the top bar (negative top
       margin from md up) rather than a gap below it. -->
  <div class="mx-auto w-[88vw] max-w-2xl pb-12 md:-mt-2 md:pb-24 lg:-mt-4">
    <h2
      class="text-center text-[1.75rem] leading-none font-semibold tracking-[-0.012em] md:text-[2rem] lg:text-[2.5rem]">
      Index
    </h2>

    <!-- `isolate` keeps the block's -z-10 inside this list: behind the rows,
         above the sheet's ground. It reaches a little past the column on both
         sides so titles and numbers keep some air inside it. -->
    <div
      {@attach glide.attach}
      class="relative isolate mt-8 md:mt-12 lg:mt-16"
    >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -inset-x-3 top-0 -z-10 bg-base-content/6"
      style={glide.style}
    ></div>

    <ol class="flex list-none flex-col gap-6 md:gap-10">
      {#each sections as section, i (section.id)}
        <!-- No transition of its own: the rows are printed on the sheet and
             ride down with it, already there as it drops. (They used to
             settle in one by one behind it, which read as the text arriving
             late.) -->
        <li>
          <a
            href="#{section.id}"
            onclick={(e) => goTo(e, section.id)}
            data-row
            class="flex items-baseline gap-4 border-b border-base-content pt-2 pb-2 text-base leading-snug font-semibold md:gap-5 md:pb-2.5 md:text-lg lg:text-xl"
          >
            <span class="w-8 shrink-0 tabular-nums md:w-10">{i + 1}.0</span>
            <span>{section.title}</span>
          </a>

          {#if section.subchapters?.length}
            <ol class="mt-2 flex list-none flex-col md:mt-3">
              {#each section.subchapters as sub, k (sub.id)}
                <li>
                  <a
                    href="#{sub.id}"
                    onclick={(e) => goTo(e, sub.id)}
                    data-row
                    class="flex items-baseline gap-4 py-1.5 text-base leading-snug text-base-content/80 md:gap-5 md:py-2 md:text-lg transition-colors duration-150 hover:text-base-content"
                  >
                    <span class="w-8 shrink-0 text-base-content/55 tabular-nums md:w-10">{i + 1}.{k + 1}</span>
                    <span>{sub.title}</span>
                  </a>
                </li>
              {/each}
            </ol>
          {/if}
        </li>
      {/each}
    </ol>
    </div>
  </div>
  </div>
  {/if}
</dialog>
