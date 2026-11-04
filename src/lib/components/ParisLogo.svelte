<script>
  // PLACEHOLDER LOGO (paris-demo, 2026-11-04): an invented mark for the demo,
  // not any real organisation's. An ink tile with the Seine's bend through
  // it in teal and the Île de la Cité as a spring-green dot, beside a
  // "Paris" wordmark set in the page's own Satoshi bold. Markup rather than
  // an <img>, so the wordmark uses the loaded web font. Sized by the
  // caller's height class; everything inside scales with it.
  let { class: className = "" } = $props();
</script>

<span class="inline-flex items-center gap-[0.35em] {className}" style="font-size: inherit">
  <svg viewBox="0 0 32 32" class="h-full w-auto shrink-0" aria-hidden="true">
    <rect width="32" height="32" rx="7" fill="#1F281D" />
    <path
      d="M-1 11 C 7 7, 11 17, 17 15 S 26 9, 33 14"
      fill="none"
      stroke="#009580"
      stroke-width="3.2"
      stroke-linecap="round"
    />
    <circle cx="16.5" cy="15.2" r="2.6" fill="#0FFF95" />
    <path d="M9 25 h14" stroke="#EFF1EF" stroke-width="1.6" stroke-linecap="round" opacity="0.5" />
  </svg>
  <span class="font-display leading-none font-bold tracking-[-0.02em] text-base-content">Paris</span>
</span>
