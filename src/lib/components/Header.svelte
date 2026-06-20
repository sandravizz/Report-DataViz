<script>
  let open = $state(false);

  const links = [
    { href: "#top", label: "Home" },
    { href: "#work", label: "Work" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];
</script>

<header
  class="fixed inset-x-0 top-0 z-50 border-b border-[#2A2659]/10 bg-[#F4DDD6]/80 backdrop-blur-sm"
>
  <div class="flex items-center justify-between px-6 py-3">
    <a
      href="#top"
      class="whitespace-nowrap font-sans text-lg font-semibold text-[#2A2659]"
    >
      GLOBAL JUSTICE REPORT
    </a>

    <button
      type="button"
      class="inline-flex items-center justify-center rounded-lg p-2 text-[#2A2659] hover:bg-[#2A2659]/10 focus:outline-none focus:ring-2 focus:ring-[#2A2659]/20 md:hidden"
      aria-controls="primary-nav"
      aria-expanded={open}
      onclick={() => (open = !open)}
    >
      <span class="sr-only">Toggle menu</span>
      <svg
        class="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <nav
      id="primary-nav"
      class="absolute inset-x-0 top-full flex-col gap-1 border-b border-[#2A2659]/10 bg-[#F4DDD6] p-4 font-sans text-sm md:static md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0 {open
        ? 'flex'
        : 'hidden'}"
    >
      {#each links as link}
        <a
          href={link.href}
          class="px-3 py-2 text-[#2A2659]/50 hover:text-[#2A2659] md:px-0 md:py-0"
        >
          {link.label}
        </a>
      {/each}
    </nav>
  </div>
</header>
