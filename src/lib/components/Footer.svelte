<!-- Closing colophon: who published the report, then the production credit.
     `disclosure` is an optional snippet for report-specific licensing text,
     kept out of the main credit block so it stays visually secondary. -->
<script>
  let { disclosure } = $props();
</script>

<footer
  class="relative flex flex-col items-center bg-base-200 px-6 py-20 text-center font-sans text-base-content sm:px-10 sm:py-28"
>
  <img
    src="/fdl-logo.svg"
    alt="FDL — Finance for Development Lab"
    class="mb-6 h-12 w-auto sm:h-14"
  />
  <p class="max-w-md text-base leading-relaxed text-base-content/80 sm:text-lg">
    This interactive report was produced by the Finance for Development Lab.
  </p>
  <p class="mt-2 max-w-md text-base leading-relaxed text-base-content/80 sm:text-lg">
    Web development and data visualization by
    <a
      href="https://sandraviz.com"
      target="_blank"
      rel="noopener"
      class="font-semibold underline-offset-4 hover:underline">Sandra Becker</a
    >.
  </p>

  <div class="mt-6 flex items-center gap-5">
    <a
      href="https://github.com/sandravizz"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
      class="text-neutral hover:text-primary"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.804 5.624-5.476 5.92.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 21.795 24 17.297 24 12c0-6.627-5.373-12-12-12Z" />
      </svg>
    </a>
    <a
      href="https://www.linkedin.com/in/sandraviz/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      class="text-neutral hover:text-primary"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.266 2.37 4.266 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    </a>
  </div>

  {#if disclosure}
    <div class="mt-12 max-w-2xl text-left text-[10px] leading-relaxed text-base-content/55">
      {@render disclosure()}
    </div>
  {/if}
</footer>
