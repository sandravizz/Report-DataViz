<script>
  // Header in IEA site style: their logo left (black on white, links back to
  // top), TOC dropdown and their social profiles right. Not a copy of the
  // full iea.org header — per the brief it borrows only the logo, the social
  // icons and Graphik. The report title lives in the landing hero, not here.
  // `abstract` is an optional snippet; when given, an "Abstract" dropdown
  // appears next to the TOC with the snippet as its panel content.
  let { links = [], abstract } = $props();

  function closeDropdown(event) {
    event.currentTarget.closest(".dropdown")?.querySelector("[role='button']")?.blur();
    event.currentTarget.blur();
  }

  // IEA's real profiles and their own icon glyphs, both lifted from the
  // iea.org footer (SVG sprite), in the footer's order. The site renders
  // youtube/bluesky/instagram at 20px and linkedin/facebook/x at 18px —
  // `size` mirrors that.
  const socials = [
    {
      label: "YouTube",
      href: "https://www.youtube.com/user/IEAEnergy",
      viewBox: "0 0 20 20",
      size: "size-5",
      evenodd: true,
      path: "M16.29 4.835a1.97 1.97 0 0 1 1.385 1.385c.337 1.23.324 3.793.324 3.793s0 2.551-.324 3.78a1.97 1.97 0 0 1-1.385 1.386c-1.23.324-6.15.324-6.15.324s-4.907 0-6.15-.337a1.97 1.97 0 0 1-1.385-1.385c-.324-1.217-.324-3.78-.324-3.78s0-2.551.324-3.781A2.01 2.01 0 0 1 3.99 4.822c1.23-.324 6.15-.324 6.15-.324s4.92 0 6.15.337ZM12.665 10l-4.091 2.356V7.644L12.664 10Z",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/international-energy-agency/",
      viewBox: "0 0 18 18",
      size: "size-4.5",
      evenodd: false,
      path: "M16.668 0H1.328C.595 0 0 .58 0 1.297V16.7c0 .716.594 1.3 1.329 1.3h15.339c.734 0 1.332-.584 1.332-1.297V1.297C18 .58 17.402 0 16.668 0ZM5.34 15.339H2.668V6.746H5.34v8.593ZM4.004 5.576A1.548 1.548 0 1 1 4 2.48a1.548 1.548 0 0 1 .005 3.096Zm11.335 9.763H12.67v-4.177c0-.995-.017-2.278-1.388-2.278-1.389 0-1.6 1.086-1.6 2.208v4.247H7.017V6.746h2.56v1.175h.035c.355-.675 1.227-1.389 2.524-1.389 2.704 0 3.203 1.779 3.203 4.092v4.715Z",
    },
    {
      label: "Bluesky",
      href: "https://bsky.app/profile/iea.org",
      viewBox: "0 0 600 530",
      size: "size-5",
      evenodd: false,
      path: "M135.72 44.03C202.216 93.951 273.74 195.17 300 249.49c26.262-54.316 97.782-155.54 164.28-205.46C512.26 8.009 590-19.862 590 68.825c0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.38-3.69-10.832-3.708-7.896-.017-2.936-1.193.516-3.707 7.896-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.45-163.25-81.433C20.15 217.613 9.997 86.535 9.997 68.825c0-88.687 77.742-60.816 125.72-24.795z",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/internationalenergyagency/",
      viewBox: "0 0 18 18",
      size: "size-4.5",
      evenodd: false,
      path: "M18 9.055a9 9 0 1 0-10.406 8.89v-6.289H5.309V9.055h2.285V7.072c0-2.256 1.343-3.502 3.4-3.502.984 0 2.014.176 2.014.176v2.215h-1.135c-1.118 0-1.467.694-1.467 1.406v1.688h2.496l-.399 2.601h-2.097v6.29C14.71 17.27 18 13.545 18 9.054Z",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/internationalenergyagency/",
      viewBox: "0 0 20 20",
      size: "size-5",
      evenodd: false,
      path: "M10 1.76c2.238 0 2.518.01 3.397.05.877.04 1.476.18 2 .383.542.21 1.001.493 1.46.95.457.459.74.918.95 1.46.203.524.343 1.123.383 2 .04.879.05 1.16.05 3.397 0 2.238-.01 2.518-.05 3.397-.04.877-.18 1.476-.383 2a4.039 4.039 0 0 1-.95 1.46c-.459.457-.918.74-1.46.95-.524.203-1.123.343-2 .383-.879.04-1.16.05-3.397.05-2.238 0-2.518-.01-3.397-.05-.877-.04-1.476-.18-2-.383a4.037 4.037 0 0 1-1.46-.95 4.038 4.038 0 0 1-.95-1.46c-.203-.524-.343-1.123-.383-2-.04-.879-.05-1.16-.05-3.397 0-2.238.01-2.518.05-3.397.04-.877.18-1.476.383-2 .21-.542.493-1.001.95-1.46.459-.457.918-.74 1.46-.95.524-.203 1.123-.343 2-.383.879-.04 1.16-.05 3.397-.05Zm0 1.485c-2.2 0-2.46.009-3.33.048-.803.037-1.239.171-1.53.284-.384.15-.658.328-.947.616a2.552 2.552 0 0 0-.616.948c-.113.29-.247.726-.284 1.53-.04.868-.048 1.129-.048 3.329s.009 2.46.048 3.33c.037.803.171 1.239.284 1.53.15.384.328.658.616.947.289.288.563.466.948.616.29.113.726.247 1.53.284.868.04 1.129.048 3.329.048s2.46-.009 3.33-.048c.803-.037 1.239-.171 1.53-.284.384-.15.658-.328.947-.616.288-.289.466-.563.616-.948.113-.29.247-.726.284-1.53.04-.869.048-1.13.048-3.329 0-2.2-.009-2.46-.048-3.33-.037-.803-.171-1.239-.284-1.53a2.553 2.553 0 0 0-.616-.947 2.552 2.552 0 0 0-.948-.616c-.29-.113-.726-.247-1.53-.284-.869-.04-1.13-.048-3.329-.048Zm.003 9.427a2.675 2.675 0 1 0 0-5.35 2.675 2.675 0 0 0 0 5.35Zm0-6.795a4.12 4.12 0 1 1 0 8.241 4.12 4.12 0 0 1 0-8.241Zm5.15 0a1.03 1.03 0 1 1-2.06 0 1.03 1.03 0 0 1 2.06 0Z",
    },
    {
      label: "X (formerly Twitter)",
      href: "https://twitter.com/iea",
      viewBox: "0 0 18 18",
      size: "size-4.5",
      evenodd: true,
      path: "m11.959 17.25-4.162-5.932-5.21 5.932H.381l6.437-7.327L.382.75h5.66l3.922 5.591L14.879.75h2.204l-6.138 6.987 6.673 9.513h-5.66Zm2.454-1.672H12.93L3.54 2.423h1.483L8.784 7.69l.65.914 4.98 6.974Z",
    },
  ];
</script>

<header
  class="fixed inset-x-0 top-0 z-50 border-b border-base-content/10 bg-base-100/80 backdrop-blur-sm"
>
  <div class="flex items-center justify-between gap-4 px-6 py-3">
    <a href="#top" class="shrink-0 hover:opacity-70" aria-label="Back to top">
      <img src="/iea-logo.svg" alt="IEA — International Energy Agency" class="h-8 w-auto sm:h-9" />
    </a>

    <nav class="flex items-center gap-4 sm:gap-6 lg:gap-8">
      {#if abstract}
        <div class="dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            aria-label="Abstract"
            class="cursor-pointer px-2 py-2 font-sans text-sm decoration-primary decoration-2 underline-offset-8 outline-none hover:underline sm:px-4"
          >
            Abstract
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
          aria-label="Table of Contents"
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
