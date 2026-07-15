<script>
  let { links = [] } = $props();

  function closeDropdown(event) {
    event.currentTarget.closest(".dropdown")?.querySelector("[role='button']")?.blur();
    event.currentTarget.blur();
  }
</script>

<header
  class="fixed inset-x-0 top-0 z-50 border-b border-base-content/10 bg-base-100/80 backdrop-blur-sm"
>
  <div class="flex items-center justify-between px-6 py-3">
    <div class="dropdown">
      <div
        tabindex="0"
        role="button"
        aria-label="Table of Contents"
        class="btn btn-ghost -ml-2 px-2 font-sans text-sm font-normal sm:ml-0 sm:px-4"
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
      <ul
        tabindex="-1"
        class="dropdown-content menu z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-box bg-base-100 p-2 font-sans shadow-lg"
      >
        {#each links as link (link.href)}
          <li>
            <a href={link.href} onclick={closeDropdown}>{link.label}</a>
          </li>
        {/each}
      </ul>
    </div>

    <a
      href="#top"
      class="max-w-36 text-right font-display text-xs leading-tight font-semibold tracking-wide text-base-content hover:opacity-70 sm:max-w-none sm:text-lg sm:tracking-normal sm:whitespace-nowrap"
    >
      IDA 2030: CLIFF OR NO CLIFF?
    </a>
  </div>
</header>
