<script>
  // Header overlays the landing hero photo (absolutely positioned over
  // Landing's image, transparent background) rather than sitting in normal
  // flow with its own bar — see Landing.svelte's scrim. So logo/nav/icons use
  // white instead of FDL's slate/neutral brand colors, which would vanish
  // against the photo.
  // `abstract` is an optional snippet; when given, an "Abstract" dropdown
  // appears next to the TOC with the snippet as its panel content.
  let { links = [], abstract } = $props();

  function closeDropdown(event) {
    event.currentTarget.closest(".dropdown")?.querySelector("[role='button']")?.blur();
    event.currentTarget.blur();
  }

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

<header class="absolute inset-x-0 top-0 z-20">
  <div class="flex items-center justify-between gap-4 px-6 py-3">
    <a href="#top" class="shrink-0 hover:opacity-80" aria-label="Back to top">
      <img
        src="/fdl-logo-white.svg"
        alt="FDL — Finance for Development Lab"
        class="h-9 w-auto sm:h-11"
      />
    </a>

    <nav class="flex items-center gap-4 sm:gap-6 lg:gap-8">
      {#if abstract}
        <div class="dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            aria-label="Abstract"
            class="cursor-pointer font-display text-sm tracking-wide text-white uppercase decoration-warning decoration-2 underline-offset-8 hover:underline"
          >
            Abstract
          </div>
          <div
            tabindex="-1"
            class="dropdown-content z-50 mt-2 w-[min(calc(100vw-2rem),34rem)] rounded-box bg-base-200 p-6 font-sans shadow-lg"
          >
            <div class="max-h-[70vh] space-y-3 overflow-y-auto text-sm leading-relaxed text-base-content/80">
              {@render abstract()}
            </div>
          </div>
        </div>
      {/if}

      <div class="dropdown dropdown-end">
        <div
          tabindex="0"
          role="button"
          aria-label="Table of Contents"
          class="cursor-pointer font-display text-sm tracking-wide text-white uppercase decoration-warning decoration-2 underline-offset-8 hover:underline"
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
          class="dropdown-content menu z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-box bg-base-200 p-2 font-sans shadow-lg"
        >
          {#each links as link (link.href)}
            <li>
              <a href={link.href} onclick={closeDropdown}>{link.label}</a>
            </li>
          {/each}
        </ul>
      </div>

      <div class="hidden items-center gap-1.5 font-sans text-sm text-white md:flex">
        <span class="opacity-60">FR</span>
        <span class="font-light text-warning">|</span>
        <span class="font-semibold">EN</span>
      </div>

      <div class="hidden items-center gap-4 md:flex">
        {#each socials as social (social.href)}
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            class="text-white/80 hover:text-white"
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
