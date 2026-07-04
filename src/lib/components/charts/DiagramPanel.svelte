<script>
  import { palette } from "$lib/colors";

  let { pair } = $props();

  const darkInk = palette[7];
  const lightInk = palette[8];
</script>

<div class="min-w-0 flex-1">
  <svg
    viewBox="0 0 800 500"
    preserveAspectRatio="xMidYMid meet"
    class="h-full w-full font-sans text-base-content"
    role="img"
    aria-label={pair.title}
  >
    <defs>
      <marker
        id="diagram-arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
      </marker>
    </defs>

    <!-- Arrows -->
    <g stroke="currentColor" stroke-width="2" marker-end="url(#diagram-arrow)">
      <line x1="185" y1="100" x2="298" y2="164" />
      <line x1="445" y1="100" x2="382" y2="164" />
      <line x1="460" y1="232" x2="546" y2="232" />
      <line x1="310" y1="290" x2="310" y2="376" />
      <line x1="370" y1="380" x2="370" y2="294" />
    </g>

    <!-- Flow labels -->
    <g fill="currentColor" opacity="0.75" font-size="12.5">
      <text x="296" y="325" text-anchor="end">
        <tspan x="296">Capital</tspan>
        <tspan x="296" dy="16">investment</tspan>
      </text>
      <text x="384" y="325">
        <tspan x="384">Investment</tspan>
        <tspan x="384" dy="16">returns</tspan>
      </text>
    </g>

    <!-- Global Wealth Tax -->
    <rect x="50" y="25" width="230" height="70" rx="10" fill={palette[1]} />
    <text x="165" y="66" text-anchor="middle" font-size="19" font-weight="600" fill={darkInk}>
      Global Wealth Tax
    </text>

    <!-- Global Income Tax -->
    <rect x="350" y="25" width="230" height="70" rx="10" fill={palette[1]} />
    <text x="465" y="66" text-anchor="middle" font-size="19" font-weight="600" fill={darkInk}>
      Global Income Tax
    </text>

    <!-- Global Justice Fund -->
    <rect x="225" y="170" width="230" height="115" rx="12" fill={palette[3]} />
    <text x="340" y="220" text-anchor="middle" font-size="20" font-weight="600" fill={lightInk}>
      Global Justice Fund
    </text>
    <text x="340" y="250" text-anchor="middle" font-size="13" fill={lightInk} opacity="0.9">
      Collects &amp; distributes
    </text>

    <!-- Country Dividends -->
    <rect x="555" y="185" width="225" height="95" rx="10" fill={palette[2]} />
    <text x="667" y="226" text-anchor="middle" font-size="18" font-weight="600" fill={darkInk}>
      Country Dividends
    </text>
    <text x="667" y="254" text-anchor="middle" font-size="12.5" fill={darkInk} opacity="0.85">
      Climate, education, health
    </text>

    <!-- World Sovereign Fund -->
    <rect x="225" y="385" width="230" height="95" rx="10" fill={palette[4]} />
    <text x="340" y="426" text-anchor="middle" font-size="18" font-weight="600" fill={lightInk}>
      World Sovereign Fund
    </text>
    <text x="340" y="454" text-anchor="middle" font-size="11.5" fill={lightInk} opacity="0.9">
      Active portfolio of sustainable assets
    </text>
  </svg>
</div>
