<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { cubicIn, quintOut } from "svelte/easing";
  import { HoverGlide } from "$lib/hoverGlide.svelte.js";
  import RollText from "./RollText.svelte";

  // Hover marks are ink, never an accent colour (as in ChapterRail).
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
  // chapter — the same glide the sheet's Index title gives back to the cover (Sandra,
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

  // The header is FIXED and holds ONLY the Index button (2026-11-08), so it
  // stays reachable anywhere in the report. There is no logo: the "Index"
  // title inside the sheet is the way back to the cover. It keeps ONE size
  // throughout, no compacting on scroll. At lg a 72px bar (button h-8 +
  // lg:py-5). Two things are set from this height — if it
  // changes, change them too: a pinned figure starts below the bar
  // (ChartDisplay's lg:top-24 = 72px + 24px air, and its lg:h- calc), and an
  // Index jump lands a sub-chapter title below it (+page.svelte's
  // lg:scroll-mt-24).
  //
  // The bar is plain base-200: the whole report (text AND pinned figures)
  // sits on that one ground, so the bar is the page's own colour everywhere
  // and never reads as a strip.
  //
  // OVER THE MAP (2026-11-08) the bar has no colour at all and lies on the
  // street map, its controls in white: on the cover until it has scrolled out
  // from under the bar, and on the ending screen once that has reached the
  // top (or the page has reached its end, for a phone whose screen is a little
  // taller than the ending's svh).
  let overCover = $state(true);
  let bar = $state(null);

  onMount(() => {
    const cover = document.querySelector("[data-accent-cursor]");
    const ending = document.querySelector("[data-report-end]");
    const update = () => {
      const onCover = !!cover && cover.getBoundingClientRect().bottom > bar.offsetHeight;
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const onEnding = !!ending && (ending.getBoundingClientRect().top <= 1 || atEnd);
      overCover = onCover || onEnding;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      unlock();
    };
  });
</script>

<!-- FIXED AT EVERY SIZE (phones joined the desktop trial, 2026-09-29): a
     solid base-200 bar, so copy never runs through it. Below lg it is a
     50px bar (button h-6.5 + py-3) holding only the Index button. Things set
     from that height: ChartDisplay's
     top-[4.5rem] and h- calc, +page.svelte's scroll-mt-20. -->
<header
  bind:this={bar}
  class="fixed inset-x-0 top-0 z-20 transition-colors duration-200 {overCover ? 'bg-transparent' : 'bg-base-200'}"
>
  <!-- Side margins: px-[6vw] below lg, so the Index button starts exactly
       where the figures and text do — those are w-[88vw] centred, i.e. 6vw
       each side. At lg the figure layout changes, and the header keeps its
       24px. -->
  <div class="flex items-center px-[6vw] py-3 lg:px-6 lg:py-5">
    <nav class="flex items-center">
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
        class="group h-6.5 cursor-pointer rounded-md px-3 py-1 font-display text-xs tracking-wide lg:h-8 lg:px-4 lg:py-1.5 lg:text-sm uppercase transition-colors duration-200 {overCover
          ? 'bg-white/15 text-white hover:bg-white/25 active:bg-white/30'
          : 'bg-base-content/6 text-base-content hover:bg-base-content/10 active:bg-base-content/16'}"
      >
        <!-- The word at every size — no hamburger on phones (Sandra,
             2026-09-29). active: darkens the fill on a tap, where there is
             no hover. -->
        <RollText text="Index" />
      </button>
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
    <!-- Satoshi bold, like the chapter titles (main's heading weight).
         THE WAY HOME (2026-11-08): the header has no logo, so this title is
         the link back to the cover. The sheet slides away, then the page
         scrolls up, like every other link here. -->
    <h2
      class="text-center font-serif text-[1.75rem] leading-none font-bold tracking-[-0.01em] md:text-[2.5rem]">
      <a
        href="#top"
        onclick={(e) => goTo(e, "top")}
        aria-label="Index, back to the cover"
        class="decoration-accent decoration-2 underline-offset-4 hover:underline"
      >
        Index
      </a>
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
              <span class="w-8 shrink-0 tabular-nums md:w-10">{section.num ?? i + 1}.0</span>
              <span>{section.title}</span>
            </div>
          {:else}
          <a
            href="#{section.id}"
            onclick={(e) => goTo(e, section.id)}
            data-row
            class="flex items-baseline gap-4 border-b border-base-content pt-[0.6dvh] pb-[0.8dvh] text-[0.9375rem] leading-snug font-semibold md:gap-5 md:pt-2 md:pb-2.5 md:text-lg lg:pt-[0.4dvh] lg:pb-[0.8dvh]"
          >
            <span class="w-8 shrink-0 tabular-nums md:w-10">{section.num ?? i + 1}.0</span>
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
                      <span class="w-8 shrink-0 tabular-nums md:w-10">{section.num ?? i + 1}.{k + 1}</span>
                      <span>{sub.title}</span>
                    </div>
                  {:else}
                  <a
                    href="#{sub.id}"
                    onclick={(e) => goTo(e, sub.id)}
                    data-row
                    class="flex items-baseline gap-4 py-[0.5dvh] text-[0.9375rem] leading-snug text-base-content/80 md:gap-5 md:py-2 md:text-lg lg:py-[0.4dvh] lg:text-base transition-colors duration-150 hover:text-base-content"
                  >
                    <span class="w-8 shrink-0 text-base-content/65 tabular-nums md:w-10">{section.num ?? i + 1}.{k + 1}</span>
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
