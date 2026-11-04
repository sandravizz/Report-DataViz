<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { cubicIn, quintOut } from "svelte/easing";
  import { HoverGlide } from "$lib/hoverGlide.svelte.js";
  import RollText from "./RollText.svelte";

  // Header overlays the landing cover (absolutely positioned, transparent
  // background) rather than sitting in normal flow with its own bar. The
  // cover is the engraving on the chapter ground, so logo/nav/icons are in
  // the report's ink: the Global Justice Project logo in ink (gjp-logo-ink.svg,
  // from main) and base-content. Hover marks are ink, never the accent red (as in
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
  // The link a reader picked, scrolled to once the dialog is really closed
  // (after its focus has gone back to the trigger, so nothing interrupts it).
  let pendingTarget = null;
  // Whether the sheet was opened with a mouse or tap (click `detail` > 0;
  // Enter/Space give 0). Closing a modal dialog hands focus back to the
  // trigger, and after an Escape the browser counts that as KEYBOARD focus
  // and draws the red :focus-visible ring round the Index button. A pointer
  // user never asked for that ring, so their returned focus is dropped;
  // keyboard users keep it — it is how they know where they are.
  let openedByPointer = false;

  const ms = (duration) => (reduceMotion ? 0 : duration);

  // Rows hover with the shared gliding block (lib/hoverGlide.svelte.js).
  const glide = new HoverGlide();

  function openToc(event) {
    openedByPointer = (event?.detail ?? 0) > 0;
    glide.hide();
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sheet?.showModal();
    open = true;
    document.documentElement.style.overflow = "hidden";
  }

  // Starts the slide up. The scroll lock goes at once, so the page behind is
  // already free while the sheet leaves.
  function closeToc() {
    open = false;
    unlock();
  }

  function finishClose() {
    sheet?.close();
    dropPointerFocus();
    if (pendingTarget) jump(pendingTarget);
    pendingTarget = null;
  }

  // A link lets the sheet slide away first, then the page SCROLLS down to the
  // chapter — the same glide the logo gives back to the cover (Sandra,
  // 2026-11-02: it used to jump instantly behind the sheet, which read as
  // "just there"). Default navigation is prevented so the scroll waits for
  // the sheet's outro (finishClose) instead of running underneath it.
  function goTo(event, id) {
    event.preventDefault();
    pendingTarget = id;
    closeToc();
  }

  // No `behavior`, so it follows <html>'s scroll-smooth — which the
  // reduced-motion rule in tailwind.css already turns off.
  function jump(id) {
    document.getElementById(id)?.scrollIntoView({ block: "start" });
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
    dropPointerFocus();
  }

  function dropPointerFocus() {
    if (openedByPointer && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  function unlock() {
    document.documentElement.style.overflow = "";
  }

  // A trial on this branch: the header is FIXED, so the logo (back to the
  // cover) and the Index stay reachable anywhere in the report. Desktop
  // first; phones and tablets followed on 2026-09-29 (see the markup).
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

  // The Global Justice Project's (WID) profiles, as on main.
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

<!-- FIXED AT EVERY SIZE (phones joined the desktop trial, 2026-09-29): a
     solid base-200 bar, so copy never runs through it. Below lg it is a
     56px bar (logo h-8 + py-3) holding only the logo and the Index button —
     the social icons wait for md. Things set from that height: ChartDisplay's
     top-[4.5rem] and h- calc, +page.svelte's scroll-mt-20. -->
<header class="fixed inset-x-0 top-0 z-20 bg-base-200">
  <!-- Side margins: px-[6vw] below lg, so the logo starts and the Index
       button ends exactly where the figures and text do — those are
       w-[88vw] centred, i.e. 6vw each side (2026-09-30: with a fixed px-6
       the Index button ended short of the figure's Interpretation button
       on a real phone, visible because the header sits right above it).
       At lg the figure layout changes, and the header keeps its 24px. -->
  <div
    class="flex items-center justify-between gap-4 px-[6vw] py-3 lg:px-6 lg:py-5"
  >
    <a href="#top" class="shrink-0 hover:opacity-80" aria-label="Back to the cover">
      <img
        src="/gjp-logo-ink.svg"
        alt="Global Justice Project"
        class="h-6 w-auto lg:h-8"
      />
    </a>

    <nav class="flex items-center gap-4 sm:gap-6 lg:gap-8">
      <!-- Display caps (Satoshi on this branch) on a SOFT FILL ("option C", 2026-09-29, after
           bleibtgleich.dev's Menu button): ink at 6%, 6px corners, going to
           10% on hover while the word rolls (RollText). The same tint as the
           gliding hover block inside the Index, so trigger and sheet read as
           one family. Opens the sheet below.
           Not the hairline outline the figures' PNG button wears: at header
           size a tall outlined box around full-ink caps read as an empty
           input field, the frame weaker than its contents.
           SAME BOX AS THE PNG BUTTON (2026-09-30): h-8 px-4. py-1.5 stays
           and the button stays NOT flex: the word sits on its baseline in
           the 20px line, which puts Kapra's caps low in the box. Centring it
           (inline-flex items-center) lifted them visibly. -->
      <button
        type="button"
        onclick={openToc}
        aria-haspopup="dialog"
        aria-label="Index"
        class="group h-6.5 cursor-pointer rounded-md bg-base-content/6 px-3 py-1 font-display text-xs tracking-wide lg:h-8 lg:px-4 lg:py-1.5 lg:text-sm text-base-content uppercase transition-colors duration-200 hover:bg-base-content/10 active:bg-base-content/16"
      >
        <!-- The word at every size — no hamburger on phones (Sandra,
             2026-09-29). active: darkens the fill on a tap, where there is
             no hover. -->
        <RollText text="Index" />
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
  <div class="min-h-[max(1.5rem,4dvh)] md:min-h-[4.25rem] lg:min-h-[max(2.5rem,5dvh)]" aria-hidden="true"></div>

  <!-- One centred reading column, like the chapter text. Two tiers:
         1.0  CHAPTER       semibold, full ink, hairline rule beneath
         1.1  Sub-chapter   regular, /80 ink, number in a quiet column
       Figures are deliberately NOT listed here any more: the Index is the
       report's outline, chapter and sub-chapter only.
       The number column is a fixed w-10 so every title starts on one line
       down the page. PHONES (below md) get a compact tier: smaller type and
       gaps and a w-8 number column. Both tiers are still shown — content is
       never dropped on a phone.
       Hover is the gliding highlight block (see `glide` above), not an
       underline: chapter rows already carry a rule beneath, so an underline
       read as a second line. A sub-chapter row also goes to full ink.
       The "Index" heading sits pulled up close to the top bar (negative top
       margin from md up) rather than a gap below it.
       DESKTOP (lg) fits the whole list in one screen: the curtain drops to
       the bottom edge and no further. Vertical spacing there is in dvh so it
       shrinks with a shorter window, and the type steps down one size
       (chapters lg, sub-chapters base).
       PHONES (below md, 2026-10-27) fit in one screen too, the same way:
       spacing in dvh and 15px rows, so an iPhone SE's 667px holds the whole
       outline. Tablets (md–lg) may still scroll. -->
  <div class="mx-auto w-[88vw] max-w-2xl pb-[3dvh] md:-mt-2 md:pb-24 lg:-mt-4 lg:pb-[3dvh]">
    <!-- Satoshi bold, like the chapter titles (main's heading weight). -->
    <h2
      class="text-center font-serif text-[1.75rem] leading-none font-bold tracking-[-0.01em] md:text-[2.5rem]">
      Index
    </h2>

    <!-- `isolate` keeps the block's -z-10 inside this list: behind the rows,
         above the sheet's ground. It reaches a little past the column on both
         sides so titles and numbers keep some air inside it. -->
    <div
      {@attach glide.attach}
      class="relative isolate mt-[3dvh] md:mt-12 lg:mt-[3dvh]"
    >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -inset-x-3 top-0 -z-10 bg-base-content/6"
      style={glide.style}
    ></div>

    <ol class="flex list-none flex-col gap-[2.4dvh] md:gap-10 lg:gap-[2.4dvh]">
      {#each sections as section, i (section.id)}
        <!-- No transition of its own: the rows are printed on the sheet and
             ride down with it, already there as it drops. (They used to
             settle in one by one behind it, which read as the text arriving
             late.) -->
        <!-- A `locked` chapter (demo cut, see +page.svelte) keeps its rows so
             the outline stays complete, but as plain greyed text: no link,
             no data-row (so no hover block), and aria-disabled for readers. -->
        <li>
          {#if section.locked}
            <div
              aria-disabled="true"
              class="flex cursor-default items-baseline gap-4 border-b border-base-content/25 pt-[0.6dvh] pb-[0.8dvh] text-[0.9375rem] leading-snug font-semibold text-base-content/40 md:gap-5 md:pt-2 md:pb-2.5 md:text-lg lg:pt-[0.4dvh] lg:pb-[0.8dvh]"
            >
              <span class="w-8 shrink-0 tabular-nums md:w-10">{i + 1}.0</span>
              <span>{section.title}</span>
            </div>
          {:else}
          <a
            href="#{section.id}"
            onclick={(e) => goTo(e, section.id)}
            data-row
            class="flex items-baseline gap-4 border-b border-base-content pt-[0.6dvh] pb-[0.8dvh] text-[0.9375rem] leading-snug font-semibold md:gap-5 md:pt-2 md:pb-2.5 md:text-lg lg:pt-[0.4dvh] lg:pb-[0.8dvh]"
          >
            <span class="w-8 shrink-0 tabular-nums md:w-10">{i + 1}.0</span>
            <span>{section.title}</span>
          </a>
          {/if}

          {#if section.subchapters?.length}
            <ol class="mt-[0.6dvh] flex list-none flex-col md:mt-3 lg:mt-[0.4dvh]">
              {#each section.subchapters as sub, k (sub.id)}
                <li>
                  {#if section.locked}
                    <div
                      aria-disabled="true"
                      class="flex cursor-default items-baseline gap-4 py-[0.5dvh] text-[0.9375rem] leading-snug text-base-content/40 md:gap-5 md:py-2 md:text-lg lg:py-[0.4dvh] lg:text-base"
                    >
                      <span class="w-8 shrink-0 tabular-nums md:w-10">{i + 1}.{k + 1}</span>
                      <span>{sub.title}</span>
                    </div>
                  {:else}
                  <a
                    href="#{sub.id}"
                    onclick={(e) => goTo(e, sub.id)}
                    data-row
                    class="flex items-baseline gap-4 py-[0.5dvh] text-[0.9375rem] leading-snug text-base-content/80 md:gap-5 md:py-2 md:text-lg lg:py-[0.4dvh] lg:text-base transition-colors duration-150 hover:text-base-content"
                  >
                    <span class="w-8 shrink-0 text-base-content/65 tabular-nums md:w-10">{i + 1}.{k + 1}</span>
                    <span>{sub.title}</span>
                  </a>
                  {/if}
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
