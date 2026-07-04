<script>
  const links = [
    { href: "#at-a-glance", label: "Global Justice by 2100 at a Glance" },
    { href: "#ensuring-equality", label: "Ensuring Equality and Prosperity for All" },
    { href: "#working-less", label: "Working Less, Achieving Gender Equality" },
    { href: "#staying-below-2c", label: "Staying Below 2 °C" },
    { href: "#building-platform", label: "Building the Global Justice Platform" },
    { href: "#funding", label: "Funding It at the Right Scale" },
    { href: "#compressing", label: "Compressing the Income and Wealth Scale" },
    { href: "#coalitions", label: "Building National and Global Coalitions" },
    { href: "#democratic-world-order", label: "Building a Democratic World Order" },
  ];

  function closeDropdown(event) {
    event.currentTarget.closest(".dropdown")?.querySelector("[role='button']")?.blur();
    event.currentTarget.blur();
  }
</script>

<header
  class="fixed inset-x-0 top-0 z-50 border-b border-base-content/10 bg-base-100/80 backdrop-blur-sm"
>
  <div class="flex items-center justify-between px-6 py-3">
    <a
      href="#top"
      class="whitespace-nowrap font-sans text-lg font-semibold text-base-content hover:opacity-70"
    >
      GLOBAL JUSTICE REPORT
    </a>

    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost font-sans text-sm font-normal">
        All Chapters
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </div>
      <ul
        tabindex="-1"
        class="dropdown-content menu z-50 mt-2 w-80 rounded-box border border-base-content/10 bg-base-100 p-2 font-sans shadow-lg"
      >
        {#each links as link (link.href)}
          <li>
            <a href={link.href} onclick={closeDropdown}>{link.label}</a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</header>
