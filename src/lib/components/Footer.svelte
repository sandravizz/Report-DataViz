<!-- Closing band + colophon (study C).
     Two tiers, because the footer is answering two different questions.

     The BAND is the answer to "I've finished the report, now what?" — which
     the previous footer had no answer to at all: the chapter rail hides itself
     as the footer arrives, so the reader was left on a centred credit block
     with nothing to do. It offers the only two onward moves that actually
     exist: the underlying paper, and the way back up.

     The STRIP is the colophon. Keeping it physically below the band, on the
     report's own ground rather than the band's, is also what fixes the
     ownership muddle in the old footer: Sandra's GitHub and LinkedIn used to
     sit directly beneath FDL's logo in one centred stack, where they read as
     FDL's accounts. Here they belong to the credit line they sit on.

     `disclosure` is an optional snippet for report-specific licensing text,
     kept out of the credit block so it stays visually secondary. -->
<script>
  let { disclosure } = $props();

  // TODO (client): the exact URL of the underlying paper is still open — see
  // docs/fdl-client-meeting.md, same status as the author LinkedIn URLs in
  // Landing.svelte and the publication date. Pointing at the org site until
  // FDL confirms it; the band's heading promises a paper, so this wants the
  // real deep link before the report ships.
  const paperHref = "https://findevlab.org";
</script>

<footer class="bg-base-200 font-sans text-base-content">
  <!-- The band is the one place in the report where the accent appears as a
       FILLED control rather than a rule or a pointer. That is deliberate and
       it is the reason it can only appear once: the accent's job everywhere
       else (underlines, annotation pointers, the PNG pill's wash) is to point
       at something, so spending it on a solid fill anywhere above this would
       cost the pointing its force. -->
  <div class="bg-primary text-primary-content">
    <div
      class="mx-auto flex max-w-300 flex-col gap-8 px-6 py-14 sm:px-10 md:flex-row md:items-center md:justify-between md:gap-12 md:py-16"
    >
      <div class="max-w-xl">
        <h2 class="text-2xl leading-tight font-semibold text-balance sm:text-3xl">
          Read the full paper
        </h2>
        <p class="mt-3 text-base leading-relaxed text-primary-content/80 md:text-lg">
          This report visualizes findings from the Finance for Development Lab's work on IDA's
          balance sheet and its 2030 disbursement path.
        </p>
      </div>

      <!-- Plain anchors, NOT daisyUI's .btn. FigureFooter.svelte documents the
           specificity fight that .btn drags in (its own :hover is a two-class
           selector, and .btn-ghost zeroes the shadow variables), which is why
           the controls up there need `!` on every hover property. These two
           carry no daisyUI class, so there is nothing to out-specify.

           FOCUS RING: the report-wide :focus-visible rule in tailwind.css
           paints the accent, which is correct on every ground in the report
           EXCEPT this one — accent on primary is about 1.5:1, effectively
           invisible. So the band's controls override it to the band's own
           light ink. Any control added to this band needs the same override. -->
      <div class="flex flex-none flex-wrap items-center gap-3">
        <a
          href={paperHref}
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-content transition-colors hover:bg-base-100 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-content md:text-base"
        >
          findevlab.org
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 12h16m0 0-6-6m6 6-6 6" />
          </svg>
        </a>

        <!-- A real anchor to #top rather than a scroll handler: it works before
             hydration, and the reduced-motion block in tailwind.css already
             turns the smooth scroll into an instant jump for readers who ask
             for that. `#top` is the <main> landmark in +page.svelte. -->
        <a
          href="#top"
          class="inline-flex items-center gap-2 rounded-full border border-primary-content/45 px-5 py-2.5 text-sm font-semibold text-primary-content transition-colors hover:bg-primary-content/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-content md:text-base"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 20V4m0 0-6 6m6-6 6 6" />
          </svg>
          Back to top
        </a>
      </div>
    </div>
  </div>

  <!-- Colophon strip. -->
  <div
    class="mx-auto flex max-w-300 flex-col gap-5 px-6 py-8 sm:px-10 md:flex-row md:items-center md:justify-between md:gap-10"
  >
    <img
      src="/fdl-logo.svg"
      alt="FDL — Finance for Development Lab"
      class="h-9 w-auto shrink-0 sm:h-10"
    />

    <div
      class="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm leading-relaxed text-base-content/65 md:justify-end md:text-right"
    >
      <span>
        Web development and data visualization by
        <!-- The accent underline, matching `mark.accent-mark` in tailwind.css
             (2px rule, 4px offset). Sandra's name is the only underlined
             phrase in the footer, which is the report's convention for the
             accent kept intact. -->
        <a
          href="https://sandraviz.com"
          target="_blank"
          rel="noopener"
          class="font-semibold text-base-content underline decoration-accent decoration-2 underline-offset-4 hover:bg-accent/10"
          >Sandra Becker</a
        >
      </span>

      <span class="flex items-center gap-3.5">
        <a
          href="https://github.com/sandravizz"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          class="text-base-content/55 transition-colors hover:text-accent"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.804 5.624-5.476 5.92.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 21.795 24 17.297 24 12c0-6.627-5.373-12-12-12Z" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/sandraviz/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          class="text-base-content/55 transition-colors hover:text-accent"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.266 2.37 4.266 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
          </svg>
        </a>
      </span>
    </div>
  </div>

  {#if disclosure}
    <div class="mx-auto max-w-300 px-6 pb-10 sm:px-10">
      <div class="max-w-2xl text-[10px] leading-relaxed text-base-content/55 md:text-[11px]">
        {@render disclosure()}
      </div>
    </div>
  {/if}
</footer>
