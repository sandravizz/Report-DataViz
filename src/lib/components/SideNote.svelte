<script>
  // Expandable aside — a daisyUI collapse on native <details>/<summary>.
  // variant "solid" is the grey box for text columns; "glass" is translucent
  // white-on-image, for placement over photos.
  let { kicker = "Sidebar", title, open = false, variant = "solid", children } = $props();

  const glass = variant === "glass";
</script>

<details
  class="collapse-plus collapse rounded-none {glass
    ? 'bg-white/10 text-white backdrop-blur-sm transition-colors duration-300 open:bg-black/45'
    : 'bg-base-200'}"
  {open}
>
  <summary class="collapse-title cursor-pointer">
    {#if kicker}
      <p
        class="text-xs font-medium tracking-wide uppercase {glass
          ? 'text-white/70'
          : 'text-primary'}"
      >
        {kicker}
      </p>
    {/if}
    <span class="mt-2 block text-xl font-semibold sm:text-2xl">{title}</span>
  </summary>
  <div
    class="collapse-content space-y-4 text-lg leading-relaxed {glass
      ? 'text-white/90'
      : 'text-base-content/80'}"
  >
    {@render children()}
  </div>
</details>
