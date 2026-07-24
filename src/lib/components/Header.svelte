<script>
  // Header: IW logo left (links back to top), TOC dropdown and IW's real
  // social profiles (from iwkoeln.de's own footer) right. `abstract` is an
  // optional snippet; when given, an "Abstract" dropdown appears next to the
  // TOC with the snippet as its panel content.
  let { links = [], abstract } = $props();

  function closeDropdown(event) {
    event.currentTarget.closest(".dropdown")?.querySelector("[role='button']")?.blur();
    event.currentTarget.blur();
  }

  // IW's real profiles, taken from iwkoeln.de's own footer.
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

<header
  class="fixed inset-x-0 top-0 z-50 border-b border-base-content/10 bg-base-100/80 backdrop-blur-sm"
>
  <div class="flex items-center justify-between gap-4 px-6 py-3">
    <a href="#top" class="shrink-0 hover:opacity-70" aria-label="Back to top">
      <img src="/iw-logo.svg" alt="IW — Institut der deutschen Wirtschaft" class="h-8 w-auto sm:h-9" />
    </a>

    <nav class="flex items-center gap-4 sm:gap-6 lg:gap-8">
      {#if abstract}
        <div class="dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            aria-label="Zusammenfassung"
            class="cursor-pointer px-2 py-2 font-sans text-sm decoration-primary decoration-2 underline-offset-8 outline-none hover:underline sm:px-4"
          >
            Zusammenfassung
          </div>
          <div
            tabindex="-1"
            class="dropdown-content z-50 mt-2 w-[min(calc(100vw-2rem),34rem)] rounded-box bg-base-100 p-6 font-sans shadow-lg"
          >
            <div
              class="max-h-[70vh] space-y-3 overflow-y-auto text-sm leading-relaxed text-base-content/80"
            >
              {@render abstract()}
            </div>
          </div>
        </div>
      {/if}

      <div class="dropdown dropdown-end">
        <div
          tabindex="0"
          role="button"
          aria-label="Inhaltsverzeichnis"
          class="cursor-pointer px-2 py-2 font-sans text-sm decoration-primary decoration-2 underline-offset-8 outline-none hover:underline sm:px-4"
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

      <div class="hidden items-center gap-4 md:flex">
        {#each socials as social (social.href)}
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            class="text-neutral hover:text-primary"
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
