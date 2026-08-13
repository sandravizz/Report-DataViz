<script>
  // The wind turbine illustration, near-square 0.92:1 cut, inlined rather than loaded from
  // /static as an <img src>. Gzipped it is only a few kB, and inline it paints
  // with the first HTML response instead of costing a second round trip that
  // queues behind the CSS, the JS bundle and the four font files. Landing.svelte
  // renders both cuts and lets an orientation media query pick one.
  //
  // Illustration by Cristina Claverol.
  // `label` is the accessible name, overridable because Footer renders the same
  // drawing mirrored and says so.
  let {
    class: className = "",
    label = "Geometric illustration of a row of wind turbines",
  } = $props();
</script>

<svg
  class={className}
  viewBox="0 0 1050.8 1137.6"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label={label}
>
  <g>
    <circle class="st1" cx="189.7" cy="607.2" r="2.2"/>
    <circle class="st1" cx="189.7" cy="662" r="2.2"/>
    <circle class="st1" cx="189.7" cy="552.4" r="2.2"/>
    <circle class="st1" cx="189.7" cy="716.8" r="2.2"/>
    <circle class="st1" cx="189.7" cy="771.5" r="2.2"/>
    <circle class="st1" cx="189.7" cy="826.3" r="2.2"/>
    <circle class="st1" cx="189.7" cy="881.1" r="2.2"/>
    <circle class="st1" cx="189.7" cy="935.9" r="2.2"/>
    <circle class="st1" cx="189.7" cy="990.7" r="2.2"/>
    <circle class="st1" cx="189.7" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="189.7" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="244.5" cy="607.2" r="2.2"/>
    <circle class="st1" cx="244.5" cy="662" r="2.2"/>
    <circle class="st1" cx="244.5" cy="716.8" r="2.2"/>
    <circle class="st1" cx="244.5" cy="771.5" r="2.2"/>
    <circle class="st1" cx="244.5" cy="826.3" r="2.2"/>
    <circle class="st1" cx="244.5" cy="881.1" r="2.2"/>
    <circle class="st1" cx="244.5" cy="935.9" r="2.2"/>
    <circle class="st1" cx="244.5" cy="990.7" r="2.2"/>
    <circle class="st1" cx="244.5" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="244.5" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="299.3" cy="607.2" r="2.2"/>
    <circle class="st1" cx="299.3" cy="662" r="2.2"/>
    <circle class="st1" cx="299.3" cy="716.8" r="2.2"/>
    <circle class="st1" cx="299.3" cy="771.5" r="2.2"/>
    <circle class="st1" cx="299.3" cy="826.3" r="2.2"/>
    <circle class="st1" cx="299.3" cy="881.1" r="2.2"/>
    <circle class="st1" cx="299.3" cy="935.9" r="2.2"/>
    <circle class="st1" cx="299.3" cy="990.7" r="2.2"/>
    <circle class="st1" cx="299.3" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="299.3" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="354" cy="607.2" r="2.2"/>
    <circle class="st1" cx="354" cy="662" r="2.2"/>
    <circle class="st1" cx="354" cy="716.8" r="2.2"/>
    <circle class="st1" cx="354" cy="771.5" r="2.2"/>
    <circle class="st1" cx="354" cy="826.3" r="2.2"/>
    <circle class="st1" cx="354" cy="881.1" r="2.2"/>
    <circle class="st1" cx="354" cy="935.9" r="2.2"/>
    <circle class="st1" cx="354" cy="990.7" r="2.2"/>
    <circle class="st1" cx="354" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="354" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="408.8" cy="607.2" r="2.2"/>
    <circle class="st1" cx="408.8" cy="662" r="2.2"/>
    <circle class="st1" cx="408.8" cy="716.8" r="2.2"/>
    <circle class="st1" cx="408.8" cy="771.5" r="2.2"/>
    <circle class="st1" cx="408.8" cy="826.3" r="2.2"/>
    <circle class="st1" cx="408.8" cy="881.1" r="2.2"/>
    <circle class="st1" cx="408.8" cy="935.9" r="2.2"/>
    <circle class="st1" cx="408.8" cy="990.7" r="2.2"/>
    <circle class="st1" cx="408.8" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="408.8" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="463.6" cy="607.2" r="2.2"/>
    <circle class="st1" cx="463.6" cy="662" r="2.2"/>
    <circle class="st1" cx="463.6" cy="716.8" r="2.2"/>
    <circle class="st1" cx="463.6" cy="771.5" r="2.2"/>
    <circle class="st1" cx="463.6" cy="826.3" r="2.2"/>
    <circle class="st1" cx="463.6" cy="881.1" r="2.2"/>
    <circle class="st1" cx="463.6" cy="935.9" r="2.2"/>
    <circle class="st1" cx="463.6" cy="990.7" r="2.2"/>
    <circle class="st1" cx="463.6" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="463.6" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="518.4" cy="607.2" r="2.2"/>
    <circle class="st1" cx="518.4" cy="662" r="2.2"/>
    <circle class="st1" cx="518.4" cy="716.8" r="2.2"/>
    <circle class="st1" cx="518.4" cy="771.5" r="2.2"/>
    <circle class="st1" cx="518.4" cy="826.3" r="2.2"/>
    <circle class="st1" cx="518.4" cy="881.1" r="2.2"/>
    <circle class="st1" cx="518.4" cy="935.9" r="2.2"/>
    <circle class="st1" cx="518.4" cy="990.7" r="2.2"/>
    <circle class="st1" cx="518.4" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="518.4" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="573.2" cy="607.2" r="2.2"/>
    <circle class="st1" cx="573.2" cy="662" r="2.2"/>
    <circle class="st1" cx="573.2" cy="716.8" r="2.2"/>
    <circle class="st1" cx="573.2" cy="771.5" r="2.2"/>
    <circle class="st1" cx="573.2" cy="826.3" r="2.2"/>
    <circle class="st1" cx="573.2" cy="881.1" r="2.2"/>
    <circle class="st1" cx="573.2" cy="935.9" r="2.2"/>
    <circle class="st1" cx="573.2" cy="990.7" r="2.2"/>
    <circle class="st1" cx="573.2" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="573.2" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="628" cy="607.2" r="2.2"/>
    <circle class="st1" cx="628" cy="662" r="2.2"/>
    <circle class="st1" cx="628" cy="716.8" r="2.2"/>
    <circle class="st1" cx="628" cy="771.5" r="2.2"/>
    <circle class="st1" cx="628" cy="826.3" r="2.2"/>
    <circle class="st1" cx="628" cy="881.1" r="2.2"/>
    <circle class="st1" cx="628" cy="935.9" r="2.2"/>
    <circle class="st1" cx="628" cy="990.7" r="2.2"/>
    <circle class="st1" cx="628" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="628" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="682.7" cy="607.2" r="2.2"/>
    <circle class="st1" cx="682.7" cy="662" r="2.2"/>
    <circle class="st1" cx="682.7" cy="716.8" r="2.2"/>
    <circle class="st1" cx="682.7" cy="771.5" r="2.2"/>
    <circle class="st1" cx="682.7" cy="826.3" r="2.2"/>
    <circle class="st1" cx="682.7" cy="881.1" r="2.2"/>
    <circle class="st1" cx="682.7" cy="935.9" r="2.2"/>
    <circle class="st1" cx="682.7" cy="990.7" r="2.2"/>
    <circle class="st1" cx="682.7" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="682.7" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="737.5" cy="607.2" r="2.2"/>
    <circle class="st1" cx="737.5" cy="662" r="2.2"/>
    <circle class="st1" cx="737.5" cy="716.8" r="2.2"/>
    <circle class="st1" cx="737.5" cy="771.5" r="2.2"/>
    <circle class="st1" cx="737.5" cy="826.3" r="2.2"/>
    <circle class="st1" cx="737.5" cy="881.1" r="2.2"/>
    <circle class="st1" cx="737.5" cy="935.9" r="2.2"/>
    <circle class="st1" cx="737.5" cy="990.7" r="2.2"/>
    <circle class="st1" cx="737.5" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="737.5" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="792.3" cy="607.2" r="2.2"/>
    <circle class="st1" cx="792.3" cy="662" r="2.2"/>
    <circle class="st1" cx="792.3" cy="716.8" r="2.2"/>
    <circle class="st1" cx="792.3" cy="771.5" r="2.2"/>
    <circle class="st1" cx="792.3" cy="826.3" r="2.2"/>
    <circle class="st1" cx="792.3" cy="881.1" r="2.2"/>
    <circle class="st1" cx="792.3" cy="935.9" r="2.2"/>
    <circle class="st1" cx="792.3" cy="990.7" r="2.2"/>
    <circle class="st1" cx="792.3" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="792.3" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="847.1" cy="607.2" r="2.2"/>
    <circle class="st1" cx="847.1" cy="662" r="2.2"/>
    <circle class="st1" cx="847.1" cy="716.8" r="2.2"/>
    <circle class="st1" cx="847.1" cy="771.5" r="2.2"/>
    <circle class="st1" cx="847.1" cy="826.3" r="2.2"/>
    <circle class="st1" cx="847.1" cy="881.1" r="2.2"/>
    <circle class="st1" cx="847.1" cy="935.9" r="2.2"/>
    <circle class="st1" cx="847.1" cy="990.7" r="2.2"/>
    <circle class="st1" cx="847.1" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="847.1" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="901.9" cy="607.2" r="2.2"/>
    <circle class="st1" cx="901.9" cy="662" r="2.2"/>
    <circle class="st1" cx="901.9" cy="716.8" r="2.2"/>
    <circle class="st1" cx="901.9" cy="771.5" r="2.2"/>
    <circle class="st1" cx="901.9" cy="826.3" r="2.2"/>
    <circle class="st1" cx="901.9" cy="881.1" r="2.2"/>
    <circle class="st1" cx="901.9" cy="935.9" r="2.2"/>
    <circle class="st1" cx="901.9" cy="990.7" r="2.2"/>
    <circle class="st1" cx="901.9" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="901.9" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="956.7" cy="607.2" r="2.2"/>
    <circle class="st1" cx="956.7" cy="662" r="2.2"/>
    <circle class="st1" cx="956.7" cy="716.8" r="2.2"/>
    <circle class="st1" cx="956.7" cy="771.5" r="2.2"/>
    <circle class="st1" cx="956.7" cy="826.3" r="2.2"/>
    <circle class="st1" cx="956.7" cy="881.1" r="2.2"/>
    <circle class="st1" cx="956.7" cy="935.9" r="2.2"/>
    <circle class="st1" cx="956.7" cy="990.7" r="2.2"/>
    <circle class="st1" cx="956.7" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="956.7" cy="1100.2" r="2.2"/>
    <circle class="st1" cx="1011.4" cy="607.2" r="2.2"/>
    <circle class="st1" cx="1011.4" cy="662" r="2.2"/>
    <circle class="st1" cx="1011.4" cy="716.8" r="2.2"/>
    <circle class="st1" cx="1011.4" cy="771.5" r="2.2"/>
    <circle class="st1" cx="1011.4" cy="826.3" r="2.2"/>
    <circle class="st1" cx="1011.4" cy="881.1" r="2.2"/>
    <circle class="st1" cx="1011.4" cy="935.9" r="2.2"/>
    <circle class="st1" cx="1011.4" cy="990.7" r="2.2"/>
    <circle class="st1" cx="1011.4" cy="1045.5" r="2.2"/>
    <circle class="st1" cx="1011.4" cy="1100.2" r="2.2"/>
  </g>
  <g>
    <g>
      <line class="st2" x1="985.6" y1="980" x2="897" y2="920"/>
      <line class="st2" x1="892.2" y1="927.3" x2="985.2" y2="980.7"/>
      <line class="st2" x1="978.7" y1="926.2" x2="889.3" y2="977.6"/>
      <line class="st2" x1="889.8" y1="978.6" x2="982.9" y2="933.8"/>
      <line class="st2" x1="937.1" y1="1005.3" x2="936.9" y2="900.9"/>
      <line class="st2" x1="935.7" y1="900.9" x2="928.7" y2="1002.1"/>
      <line class="st2" x1="922" y1="917.3" x2="949.6" y2="969.8"/>
      <line class="st2" x1="907.6" y1="954.5" x2="966.8" y2="956.5"/>
      <line class="st2" x1="952.4" y1="918.7" x2="912.6" y2="981.6"/>
    </g>
    <g>
      <polyline class="st3" points="934.9 954.9 933.5 1092.6 931.8 1095.4 931.8 1095.4 931.8 1097.5 940.5 1097.5 940.5 1095.4 940.5 1095.4 938.8 1092.5 937.4 954.9"/>
      <path class="st3" d="M937.1,950.2v-25.9s-.1-17.2-.1-17.2c0-.4-.4-.8-.7-.9-.3,0-.9.3-.9.7l-2.2,31.5,2.1,4v7.8"/>
      <path class="st3" d="M933.6,952.1l-22.4,13-14.9,8.7c-.4.2-.5.8-.4,1.1.1.3.7.6,1,.4l28.4-13.8,2.4-3.8,6.7-3.9"/>
      <path class="st3" d="M937.9,953.6l22.4,12.9,15,8.6c.4.2.9,0,1.1-.2.2-.2.2-.9-.2-1.1l-26.2-17.7-4.5-.2-6.7-3.9"/>
      <circle cx="936.2" cy="952.2" r="2.2"/>
      <path class="st6" d="M938.4,952.2c0,1.2-1,2.2-2.2,2.2s-2.2-1-2.2-2.2,1-2.2,2.2-2.2,2.2,1,2.2,2.2ZM938.4,952.2c0,1.2-1,2.2-2.2,2.2s-2.2-1-2.2-2.2,1-2.2,2.2-2.2,2.2,1,2.2,2.2ZM937.2,952.2c0-.6-.5-1-1-1s-1,.5-1,1,.5,1,1,1,1-.5,1-1Z"/>
      <path d="M937.2,952.2c0,.6-.5,1-1,1s-1-.5-1-1,.5-1,1-1,1,.5,1,1ZM936.8,952.2c0-.3-.3-.6-.6-.6s-.6.3-.6.6.3.6.6.6.6-.3.6-.6Z"/>
      <circle class="st5" cx="936.2" cy="952.2" r=".6"/>
      <circle class="st4" cx="936.2" cy="952.2" r="3.1"/>
    </g>
  </g>
  <g>
    <g>
      <circle class="st1" cx="189.7" cy="59.3" r="2.2"/>
      <circle class="st1" cx="189.7" cy="114.1" r="2.2"/>
      <circle class="st1" cx="189.7" cy="168.9" r="2.2"/>
      <circle class="st1" cx="189.7" cy="223.7" r="2.2"/>
      <circle class="st1" cx="189.7" cy="278.5" r="2.2"/>
      <circle class="st1" cx="189.7" cy="333.3" r="2.2"/>
      <circle class="st1" cx="189.7" cy="388.1" r="2.2"/>
      <circle class="st1" cx="189.7" cy="442.8" r="2.2"/>
      <circle class="st1" cx="189.7" cy="497.6" r="2.2"/>
      <circle class="st1" cx="244.5" cy="59.3" r="2.2"/>
      <circle class="st1" cx="244.5" cy="114.1" r="2.2"/>
      <circle class="st1" cx="244.5" cy="168.9" r="2.2"/>
      <circle class="st1" cx="244.5" cy="223.7" r="2.2"/>
      <circle class="st1" cx="244.5" cy="278.5" r="2.2"/>
      <circle class="st1" cx="244.5" cy="333.3" r="2.2"/>
      <circle class="st1" cx="244.5" cy="388.1" r="2.2"/>
      <circle class="st1" cx="244.5" cy="442.8" r="2.2"/>
      <circle class="st1" cx="244.5" cy="497.6" r="2.2"/>
      <circle class="st1" cx="244.5" cy="552.4" r="2.2"/>
      <circle class="st1" cx="299.3" cy="59.3" r="2.2"/>
      <circle class="st1" cx="299.3" cy="114.1" r="2.2"/>
      <circle class="st1" cx="299.3" cy="168.9" r="2.2"/>
      <circle class="st1" cx="299.3" cy="223.7" r="2.2"/>
      <circle class="st1" cx="299.3" cy="278.5" r="2.2"/>
      <circle class="st1" cx="299.3" cy="333.3" r="2.2"/>
      <circle class="st1" cx="299.3" cy="388.1" r="2.2"/>
      <circle class="st1" cx="299.3" cy="442.8" r="2.2"/>
      <circle class="st1" cx="299.3" cy="497.6" r="2.2"/>
      <circle class="st1" cx="299.3" cy="552.4" r="2.2"/>
      <circle class="st1" cx="354" cy="59.3" r="2.2"/>
      <circle class="st1" cx="354" cy="114.1" r="2.2"/>
      <circle class="st1" cx="354" cy="168.9" r="2.2"/>
      <circle class="st1" cx="354" cy="223.7" r="2.2"/>
      <circle class="st1" cx="354" cy="278.5" r="2.2"/>
      <circle class="st1" cx="354" cy="333.3" r="2.2"/>
      <circle class="st1" cx="354" cy="388.1" r="2.2"/>
      <circle class="st1" cx="365.8" cy="437" r="2.2"/>
      <circle class="st1" cx="336.5" cy="483.3" r="2.2"/>
      <circle class="st1" cx="354" cy="552.4" r="2.2"/>
      <circle class="st1" cx="408.8" cy="59.3" r="2.2"/>
      <circle class="st1" cx="408.8" cy="114.1" r="2.2"/>
      <circle class="st1" cx="408.8" cy="168.9" r="2.2"/>
      <circle class="st1" cx="408.8" cy="223.7" r="2.2"/>
      <circle class="st1" cx="408.8" cy="278.5" r="2.2"/>
      <circle class="st1" cx="408.8" cy="333.3" r="2.2"/>
      <circle class="st1" cx="408.8" cy="388.1" r="2.2"/>
      <circle class="st1" cx="408.8" cy="442.8" r="2.2"/>
      <circle class="st1" cx="408.8" cy="497.6" r="2.2"/>
      <circle class="st1" cx="408.8" cy="552.4" r="2.2"/>
      <circle class="st1" cx="463.6" cy="59.3" r="2.2"/>
      <circle class="st1" cx="463.6" cy="114.1" r="2.2"/>
      <circle class="st1" cx="463.6" cy="168.9" r="2.2"/>
      <circle class="st1" cx="463.6" cy="223.7" r="2.2"/>
      <circle class="st1" cx="463.6" cy="278.5" r="2.2"/>
      <circle class="st1" cx="463.6" cy="333.3" r="2.2"/>
      <circle class="st1" cx="463.6" cy="388.1" r="2.2"/>
      <circle class="st1" cx="463.6" cy="442.8" r="2.2"/>
      <circle class="st1" cx="463.6" cy="497.6" r="2.2"/>
      <circle class="st1" cx="490.2" cy="574.8" r="2.2"/>
      <circle class="st1" cx="518.4" cy="59.3" r="2.2"/>
      <circle class="st1" cx="518.4" cy="114.1" r="2.2"/>
      <circle class="st1" cx="518.4" cy="168.9" r="2.2"/>
      <circle class="st1" cx="518.4" cy="223.7" r="2.2"/>
      <circle class="st1" cx="518.4" cy="278.5" r="2.2"/>
      <circle class="st1" cx="518.4" cy="333.3" r="2.2"/>
      <circle class="st1" cx="518.4" cy="388.1" r="2.2"/>
      <circle class="st1" cx="518.4" cy="442.8" r="2.2"/>
      <circle class="st1" cx="518.4" cy="497.6" r="2.2"/>
      <circle class="st1" cx="480.7" cy="520.9" r="2.2"/>
      <circle class="st1" cx="573.2" cy="59.3" r="2.2"/>
      <circle class="st1" cx="573.2" cy="114.1" r="2.2"/>
      <circle class="st1" cx="573.2" cy="168.9" r="2.2"/>
      <circle class="st1" cx="573.2" cy="223.7" r="2.2"/>
      <circle class="st1" cx="573.2" cy="278.5" r="2.2"/>
      <circle class="st1" cx="573.2" cy="333.3" r="2.2"/>
      <circle class="st1" cx="573.2" cy="388.1" r="2.2"/>
      <circle class="st1" cx="573.2" cy="442.8" r="2.2"/>
      <circle class="st1" cx="573.2" cy="497.6" r="2.2"/>
      <circle class="st1" cx="573.2" cy="552.4" r="2.2"/>
      <circle class="st1" cx="628" cy="59.3" r="2.2"/>
      <circle class="st1" cx="628" cy="114.1" r="2.2"/>
      <circle class="st1" cx="628" cy="168.9" r="2.2"/>
      <circle class="st1" cx="628" cy="223.7" r="2.2"/>
      <circle class="st1" cx="628" cy="278.5" r="2.2"/>
      <circle class="st1" cx="628" cy="333.3" r="2.2"/>
      <circle class="st1" cx="628" cy="388.1" r="2.2"/>
      <circle class="st1" cx="628" cy="442.8" r="2.2"/>
      <circle class="st1" cx="628" cy="497.6" r="2.2"/>
      <circle class="st1" cx="628" cy="552.4" r="2.2"/>
      <circle class="st1" cx="682.7" cy="59.3" r="2.2"/>
      <circle class="st1" cx="682.7" cy="114.1" r="2.2"/>
      <circle class="st1" cx="682.7" cy="168.9" r="2.2"/>
      <circle class="st1" cx="682.7" cy="223.7" r="2.2"/>
      <circle class="st1" cx="682.7" cy="278.5" r="2.2"/>
      <circle class="st1" cx="682.7" cy="333.3" r="2.2"/>
      <circle class="st1" cx="682.7" cy="388.1" r="2.2"/>
      <circle class="st1" cx="682.7" cy="442.8" r="2.2"/>
      <circle class="st1" cx="682.7" cy="497.6" r="2.2"/>
      <circle class="st1" cx="682.7" cy="552.4" r="2.2"/>
      <circle class="st1" cx="737.5" cy="59.3" r="2.2"/>
      <circle class="st1" cx="737.5" cy="114.1" r="2.2"/>
      <circle class="st1" cx="737.5" cy="168.9" r="2.2"/>
      <circle class="st1" cx="737.5" cy="223.7" r="2.2"/>
      <circle class="st1" cx="737.5" cy="278.5" r="2.2"/>
      <circle class="st1" cx="737.5" cy="333.3" r="2.2"/>
      <circle class="st1" cx="737.5" cy="388.1" r="2.2"/>
      <circle class="st1" cx="737.5" cy="442.8" r="2.2"/>
      <circle class="st1" cx="737.5" cy="497.6" r="2.2"/>
      <circle class="st1" cx="737.5" cy="552.4" r="2.2"/>
      <circle class="st1" cx="792.3" cy="59.3" r="2.2"/>
      <circle class="st1" cx="792.3" cy="114.1" r="2.2"/>
      <circle class="st1" cx="792.3" cy="168.9" r="2.2"/>
      <circle class="st1" cx="792.3" cy="223.7" r="2.2"/>
      <circle class="st1" cx="792.3" cy="278.5" r="2.2"/>
      <circle class="st1" cx="792.3" cy="333.3" r="2.2"/>
      <circle class="st1" cx="792.3" cy="388.1" r="2.2"/>
      <circle class="st1" cx="792.3" cy="442.8" r="2.2"/>
      <circle class="st1" cx="792.3" cy="497.6" r="2.2"/>
      <circle class="st1" cx="792.3" cy="552.4" r="2.2"/>
      <circle class="st1" cx="847.1" cy="59.3" r="2.2"/>
      <circle class="st1" cx="847.1" cy="114.1" r="2.2"/>
      <circle class="st1" cx="847.1" cy="168.9" r="2.2"/>
      <circle class="st1" cx="847.1" cy="223.7" r="2.2"/>
      <circle class="st1" cx="847.1" cy="278.5" r="2.2"/>
      <circle class="st1" cx="847.1" cy="333.3" r="2.2"/>
      <circle class="st1" cx="847.1" cy="388.1" r="2.2"/>
      <circle class="st1" cx="847.1" cy="442.8" r="2.2"/>
      <circle class="st1" cx="847.1" cy="497.6" r="2.2"/>
      <circle class="st1" cx="847.1" cy="552.4" r="2.2"/>
      <circle class="st1" cx="901.9" cy="59.3" r="2.2"/>
      <circle class="st1" cx="901.9" cy="114.1" r="2.2"/>
      <circle class="st1" cx="901.9" cy="168.9" r="2.2"/>
      <circle class="st1" cx="901.9" cy="223.7" r="2.2"/>
      <circle class="st1" cx="901.9" cy="278.5" r="2.2"/>
      <circle class="st1" cx="901.9" cy="333.3" r="2.2"/>
      <circle class="st1" cx="901.9" cy="388.1" r="2.2"/>
      <circle class="st1" cx="901.9" cy="442.8" r="2.2"/>
      <circle class="st1" cx="901.9" cy="497.6" r="2.2"/>
      <circle class="st1" cx="901.9" cy="552.4" r="2.2"/>
      <circle class="st1" cx="956.7" cy="59.3" r="2.2"/>
      <circle class="st1" cx="956.7" cy="114.1" r="2.2"/>
      <circle class="st1" cx="956.7" cy="168.9" r="2.2"/>
      <circle class="st1" cx="956.7" cy="223.7" r="2.2"/>
      <circle class="st1" cx="956.7" cy="278.5" r="2.2"/>
      <circle class="st1" cx="956.7" cy="333.3" r="2.2"/>
      <circle class="st1" cx="956.7" cy="388.1" r="2.2"/>
      <circle class="st1" cx="956.7" cy="442.8" r="2.2"/>
      <circle class="st1" cx="956.7" cy="497.6" r="2.2"/>
      <circle class="st1" cx="956.7" cy="552.4" r="2.2"/>
      <circle class="st1" cx="1011.4" cy="59.3" r="2.2"/>
      <circle class="st1" cx="1011.4" cy="114.1" r="2.2"/>
      <circle class="st1" cx="1011.4" cy="168.9" r="2.2"/>
      <circle class="st1" cx="1011.4" cy="223.7" r="2.2"/>
      <circle class="st1" cx="1011.4" cy="278.5" r="2.2"/>
      <circle class="st1" cx="1011.4" cy="333.3" r="2.2"/>
      <circle class="st1" cx="1011.4" cy="388.1" r="2.2"/>
      <circle class="st1" cx="1011.4" cy="442.8" r="2.2"/>
      <circle class="st1" cx="1011.4" cy="497.6" r="2.2"/>
      <circle class="st1" cx="1011.4" cy="552.4" r="2.2"/>
    </g>
    <g>
      <rect class="st0" x="1041.6" y="1128.5" width="9.1" height="9.1"/>
      <rect class="st0" x="133.2" width="9.1" height="9.1"/>
      <rect class="st0" x="1041.6" width="9.1" height="9.1"/>
      <rect class="st0" x="133.2" y="1128.5" width="9.1" height="9.1"/>
    </g>
    <g>
      <g>
        <line class="st2" x1="556.9" y1="351.8" x2="393.5" y2="718"/>
        <line class="st2" x1="423.3" y1="730.9" x2="559.8" y2="352.7"/>
        <line class="st2" x1="363.1" y1="412.5" x2="610.9" y2="708.9"/>
        <line class="st2" x1="614.2" y1="706.4" x2="388.3" y2="392"/>
        <line class="st2" x1="682" y1="514.5" x2="296.9" y2="583.1"/>
        <line class="st2" x1="297.7" y1="587.6" x2="675.7" y2="547.4"/>
        <line class="st2" x1="367.1" y1="627.3" x2="543.1" y2="491.5"/>
        <line class="st2" x1="513.7" y1="656.5" x2="482.6" y2="436.4"/>
        <line class="st2" x1="352.4" y1="514.4" x2="610.5" y2="620.4"/>
      </g>
      <g>
        <polyline class="st3" points="481.7 562.8 476.4 1079.4 470 1089.8 470 1089.8 470 1097.5 502.6 1097.4 502.6 1089.8 502.6 1089.8 496.3 1079 491 562.8"/>
        <path class="st3" d="M478.8,550.3l-95.6,17-63.6,11.5c-1.6.3-2.7,2-2.7,3.3,0,1.1,1.6,3,3.2,2.8l117.9-12.3,13.3-10.3,28.7-5.1"/>
        <path class="st3" d="M487.9,562.2l62.5,74.2,41.7,49.3c1.1,1.3,3.1,1.4,4.2.7.9-.6,1.8-2.9.9-4.2l-69.6-96-15.6-6.4-18.8-22.3"/>
        <path class="st3" d="M490.5,545l33-91.3,21.9-60.8c.6-1.6-.4-3.4-1.5-4-1-.5-3.4-.1-4,1.3l-48.3,108.2,2.2,16.7-9.9,27.4"/>
        <circle cx="486.8" cy="552.3" r="8.4" transform="translate(-88.6 93) rotate(-10)"/>
        <path class="st6" d="M485.3,544.1c4.5-.8,8.9,2.2,9.7,6.8s-2.2,8.9-6.8,9.7-8.9-2.2-9.7-6.8,2.2-8.9,6.8-9.7ZM485.3,544.1c4.5-.8,8.9,2.2,9.7,6.8s-2.2,8.9-6.8,9.7-8.9-2.2-9.7-6.8,2.2-8.9,6.8-9.7ZM486.1,548.6c-2.1.4-3.4,2.3-3.1,4.4s2.3,3.4,4.4,3.1,3.4-2.3,3.1-4.4-2.3-3.4-4.4-3.1Z"/>
        <path d="M486.1,548.6c2.1-.4,4,1,4.4,3.1s-1,4-3.1,4.4-4-1-4.4-3.1,1-4,3.1-4.4ZM486.4,550.3c-1.1.2-1.9,1.3-1.7,2.4s1.3,1.9,2.4,1.7,1.9-1.3,1.7-2.4-1.3-1.9-2.4-1.7Z"/>
        <circle class="st5" cx="486.8" cy="552.3" r="2.1" transform="translate(-88.6 93) rotate(-10)"/>
        <circle class="st4" cx="486.7" cy="552.3" r="11.4"/>
      </g>
    </g>
    <g>
      <g>
        <line class="st2" x1="466.6" y1="772.6" x2="715.6" y2="544.6"/>
        <line class="st2" x1="696.9" y1="524.7" x2="464.7" y2="770.9"/>
        <line class="st2" x1="636.6" y1="790.7" x2="544.7" y2="478.8"/>
        <line class="st2" x1="541.3" y1="479.6" x2="610.3" y2="798.1"/>
        <line class="st2" x1="424.6" y1="605.1" x2="744.9" y2="681.2"/>
        <line class="st2" x1="745.8" y1="677.5" x2="440.5" y2="581.7"/>
        <line class="st2" x1="705.6" y1="623.5" x2="524.2" y2="669.4"/>
        <line class="st2" x1="602.2" y1="551.8" x2="552.4" y2="732.2"/>
        <line class="st2" x1="679" y1="715.7" x2="515.3" y2="547.3"/>
      </g>
      <g>
        <polyline class="st3" points="582.3 647.4 577.9 1082.3 572.5 1091 572.5 1091 572.5 1097.5 600 1097.4 600 1091 600 1091 594.6 1081.9 590.2 647.4"/>
        <path class="st3" d="M593.5,645.5l79.5,18.9,52.9,12.5c1.4.3,2.8-.6,3.2-1.6.3-.8-.2-2.9-1.5-3.3l-95.1-30.1-13.7,3.5-23.9-5.7"/>
        <path class="st3" d="M590.5,633.3l-23.4-78.3-15.7-52.1c-.4-1.3-1.9-2.1-3-1.9-.9.1-2.4,1.6-2.1,2.9l21.5,97.4,9.9,10.2,7,23.5"/>
        <path class="st3" d="M582.7,645.7l-56.1,59.4-37.3,39.6c-1,1-.8,2.7-.2,3.6.6.7,2.6,1.2,3.6.3l73.6-67.4,3.9-13.6,16.9-17.8"/>
        <circle cx="588" cy="641.3" r="7" transform="translate(-172.6329 1063.7603) rotate(-76.5295)"/>
        <path class="st6" d="M586.4,648.2c-3.8-.9-6.1-4.7-5.2-8.5s4.7-6.1,8.5-5.2,6.1,4.7,5.2,8.5-4.7,6.1-8.5,5.2ZM586.4,648.2c-3.8-.9-6.1-4.7-5.2-8.5s4.7-6.1,8.5-5.2,6.1,4.7,5.2,8.5-4.7,6.1-8.5,5.2ZM587.3,644.4c1.7.4,3.4-.6,3.8-2.4s-.6-3.4-2.4-3.8-3.4.6-3.8,2.4.6,3.4,2.4,3.8Z"/>
        <path d="M587.3,644.4c-1.7-.4-2.8-2.1-2.4-3.8s2.1-2.8,3.8-2.4,2.8,2.1,2.4,3.8-2.1,2.8-3.8,2.4ZM587.6,643c1,.2,1.9-.4,2.1-1.3s-.4-1.9-1.3-2.1-1.9.4-2.1,1.3.4,1.9,1.3,2.1Z"/>
        <circle class="st5" cx="588" cy="641.3" r="1.8" transform="translate(-172.6099 1063.7332) rotate(-76.5295)"/>
        <circle class="st4" cx="588" cy="641.3" r="9.6"/>
      </g>
    </g>
    <g>
      <g>
        <line class="st2" x1="842.2" y1="889.4" x2="711.7" y2="717.7"/>
        <line class="st2" x1="697.9" y1="728.5" x2="841" y2="890.5"/>
        <line class="st2" x1="863.6" y1="782.3" x2="659.9" y2="822.6"/>
        <line class="st2" x1="660.2" y1="824.8" x2="866.8" y2="799.5"/>
        <line class="st2" x1="733.2" y1="906.4" x2="800.3" y2="707"/>
        <line class="st2" x1="797.9" y1="706.3" x2="719.3" y2="894.9"/>
        <line class="st2" x1="761.3" y1="728.7" x2="779.9" y2="846.8"/>
        <line class="st2" x1="709.7" y1="790.3" x2="821.5" y2="832.5"/>
        <line class="st2" x1="818.3" y1="751" x2="701.7" y2="845.3"/>
      </g>
      <g>
        <polyline class="st3" points="762.9 810 760.1 1087.8 756.6 1093.3 756.6 1093.3 756.6 1097.5 774.2 1097.4 774.2 1093.4 774.2 1093.3 770.8 1087.5 767.9 810"/>
        <path class="st3" d="M768.8,801.3l16.6-49.5,11-32.9c.3-.8-.2-1.8-.9-2.1-.5-.3-1.8,0-2.2.8l-24.6,58.8,1.4,8.9-5,14.9"/>
        <path class="st3" d="M760.8,802.5l-51.2,10.3-34,6.9c-.9.2-1.5,1.1-1.4,1.8,0,.6.9,1.6,1.7,1.5l63.2-8,7-5.7,15.4-3.1"/>
        <path class="st3" d="M768.2,808.2l34.5,39.1,23,26c.6.7,1.7.7,2.3.3.5-.3.9-1.6.4-2.2l-38.6-50.7-8.4-3.2-10.4-11.8"/>
        <circle cx="765.8" cy="804.5" r="4.5" transform="translate(-241.796 1271.9511) rotate(-71.3022)"/>
        <path class="st6" d="M770,806c-.8,2.4-3.3,3.6-5.7,2.8s-3.6-3.3-2.8-5.7,3.3-3.6,5.7-2.8,3.6,3.3,2.8,5.7ZM770,806c-.8,2.4-3.3,3.6-5.7,2.8s-3.6-3.3-2.8-5.7,3.3-3.6,5.7-2.8,3.6,3.3,2.8,5.7ZM767.7,805.2c.4-1.1-.2-2.2-1.3-2.6s-2.2.2-2.6,1.3.2,2.2,1.3,2.6,2.2-.2,2.6-1.3Z"/>
        <path d="M767.7,805.2c-.4,1.1-1.5,1.6-2.6,1.3s-1.6-1.5-1.3-2.6,1.5-1.6,2.6-1.3,1.6,1.5,1.3,2.6ZM766.8,804.9c.2-.6-.1-1.2-.7-1.4s-1.2.1-1.4.7.1,1.2.7,1.4,1.2-.1,1.4-.7Z"/>
        <circle class="st5" cx="765.7" cy="804.5" r="1.1" transform="translate(-241.8102 1271.9352) rotate(-71.3022)"/>
        <circle class="st4" cx="765.8" cy="804.5" r="6.1"/>
      </g>
    </g>
    <g>
      <g>
        <line class="st2" x1="805.2" y1="793.2" x2="575.8" y2="638.1"/>
        <line class="st2" x1="563.5" y1="656.9" x2="804.3" y2="795.1"/>
        <line class="st2" x1="787.2" y1="654.1" x2="555.9" y2="787.1"/>
        <line class="st2" x1="557.2" y1="789.6" x2="798.1" y2="673.8"/>
        <line class="st2" x1="679.6" y1="858.8" x2="679.1" y2="588.7"/>
        <line class="st2" x1="676" y1="588.7" x2="658" y2="850.5"/>
        <line class="st2" x1="640.6" y1="631.1" x2="711.9" y2="767"/>
        <line class="st2" x1="603.2" y1="727.2" x2="756.6" y2="732.5"/>
        <line class="st2" x1="719.2" y1="634.7" x2="616.2" y2="797.4"/>
      </g>
      <g>
        <polyline class="st3" points="674 728.3 670.4 1085 666 1092.2 666 1092.2 666 1097.5 688.5 1097.4 688.5 1092.2 688.5 1092.2 684.1 1084.7 680.5 728.3"/>
        <path class="st3" d="M679.6,716.3v-67c-.1,0-.3-44.6-.3-44.6,0-1.1-1-2.1-1.9-2.2-.7,0-2.2.7-2.3,1.8l-5.8,81.6,5.4,10.3v20.1"/>
        <path class="st3" d="M670.4,721.1l-58,33.6-38.6,22.5c-1,.6-1.3,2-1,2.8.3.7,1.7,1.6,2.7,1.1l73.6-35.8,6.2-9.8,17.4-10.1"/>
        <path class="st3" d="M681.8,724.9l58.1,33.4,38.7,22.2c1,.6,2.3.2,2.9-.5.5-.6.5-2.3-.4-2.9l-67.8-45.8-11.6-.5-17.5-10"/>
        <circle cx="677.3" cy="721.5" r="5.8"/>
        <path class="st6" d="M683.1,721.5c0,3.2-2.6,5.8-5.8,5.8s-5.8-2.6-5.8-5.8,2.6-5.8,5.8-5.8,5.8,2.6,5.8,5.8ZM683.1,721.5c0,3.2-2.6,5.8-5.8,5.8s-5.8-2.6-5.8-5.8,2.6-5.8,5.8-5.8,5.8,2.6,5.8,5.8ZM679.9,721.5c0-1.4-1.2-2.6-2.6-2.6s-2.6,1.2-2.6,2.6,1.2,2.6,2.6,2.6,2.6-1.2,2.6-2.6Z"/>
        <path d="M679.9,721.5c0,1.4-1.2,2.6-2.6,2.6s-2.6-1.2-2.6-2.6,1.2-2.6,2.6-2.6,2.6,1.2,2.6,2.6ZM678.7,721.5c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5,1.5.7,1.5,1.5,1.5,1.5-.7,1.5-1.5Z"/>
        <circle class="st5" cx="677.3" cy="721.5" r="1.5"/>
        <circle class="st4" cx="677.3" cy="721.4" r="7.9"/>
      </g>
    </g>
    <g>
      <g>
        <line class="st2" x1="927.1" y1="962.3" x2="884.3" y2="811.3"/>
        <line class="st2" x1="872.1" y1="814.9" x2="926" y2="962.7"/>
        <line class="st2" x1="970" y1="895.4" x2="821.3" y2="868.6"/>
        <line class="st2" x1="820.9" y1="870.2" x2="967.6" y2="907.9"/>
        <line class="st2" x1="848.7" y1="944.8" x2="947.1" y2="827.6"/>
        <line class="st2" x1="945.8" y1="826.5" x2="842.3" y2="933.3"/>
        <line class="st2" x1="914.9" y1="831.9" x2="896.2" y2="916.8"/>
        <line class="st2" x1="863.6" y1="859.9" x2="928.2" y2="918.2"/>
        <line class="st2" x1="947.7" y1="862.2" x2="843.6" y2="895.1"/>
      </g>
      <g>
        <polyline class="st3" points="896 888.3 894 1090.4 891.4 1094.5 891.4 1094.5 891.4 1097.5 904.2 1097.5 904.2 1094.5 904.2 1094.5 901.7 1090.2 899.7 888.3"/>
        <path class="st3" d="M900.8,883.1l24.4-29.1,16.2-19.4c.4-.5.3-1.3,0-1.7-.3-.3-1.2-.5-1.7,0l-32.3,33.3-1.4,6.4-7.3,8.7"/>
        <path class="st3" d="M895,881.8l-37.4-6.6-24.9-4.3c-.6-.1-1.3.4-1.4.8-.1.4.2,1.3.8,1.5l45,11.4,6.3-2,11.2,2"/>
        <path class="st3" d="M898.6,887.6l13,35.7,8.7,23.7c.2.6,1,.9,1.4.8.4,0,1.1-.8.9-1.4l-12.6-44.6-4.9-4.4-3.9-10.7"/>
        <circle cx="897.8" cy="884.5" r="3.3" transform="translate(-357.0721 1001.1499) rotate(-49.882)"/>
        <path class="st6" d="M900.3,886.6c-1.2,1.4-3.2,1.6-4.6.4s-1.6-3.2-.4-4.6,3.2-1.6,4.6-.4,1.6,3.2.4,4.6ZM900.3,886.6c-1.2,1.4-3.2,1.6-4.6.4s-1.6-3.2-.4-4.6,3.2-1.6,4.6-.4,1.6,3.2.4,4.6ZM899,885.4c.5-.6.4-1.6-.2-2.1s-1.6-.4-2.1.2-.4,1.6.2,2.1,1.6.4,2.1-.2Z"/>
        <path d="M899,885.4c-.5.6-1.5.7-2.1.2s-.7-1.5-.2-2.1,1.5-.7,2.1-.2.7,1.5.2,2.1ZM898.5,885c.3-.3.2-.9,0-1.2s-.9-.2-1.2,0-.2.9,0,1.2.9.2,1.2,0Z"/>
        <circle class="st5" cx="897.8" cy="884.5" r=".8" transform="translate(-357.074 1001.1388) rotate(-49.882)"/>
        <circle class="st4" cx="897.9" cy="884.5" r="4.5"/>
      </g>
    </g>
    <g>
      <g>
        <line class="st2" x1="912.9" y1="925.1" x2="782.9" y2="837.2"/>
        <line class="st2" x1="775.9" y1="847.9" x2="912.3" y2="926.2"/>
        <line class="st2" x1="902.7" y1="846.3" x2="771.6" y2="921.6"/>
        <line class="st2" x1="772.4" y1="923.1" x2="908.9" y2="857.4"/>
        <line class="st2" x1="841.7" y1="962.2" x2="841.5" y2="809.2"/>
        <line class="st2" x1="839.7" y1="809.2" x2="829.5" y2="957.6"/>
        <line class="st2" x1="819.6" y1="833.2" x2="860" y2="910.3"/>
        <line class="st2" x1="798.4" y1="887.7" x2="885.3" y2="890.7"/>
        <line class="st2" x1="864.2" y1="835.3" x2="805.8" y2="927.5"/>
      </g>
      <g>
        <polyline class="st3" points="838.6 888.3 836.5 1090.4 834 1094.5 834 1094.5 834 1097.5 846.7 1097.5 846.7 1094.5 846.7 1094.5 844.3 1090.2 842.2 888.3"/>
        <path class="st3" d="M841.7,881.5v-38c0,0-.2-25.3-.2-25.3,0-.6-.6-1.2-1.1-1.3-.4,0-1.3.4-1.3,1l-3.3,46.3,3.1,5.8v11.4"/>
        <path class="st3" d="M836.5,884.2l-32.9,19-21.8,12.7c-.6.3-.7,1.1-.5,1.6.2.4,1,.9,1.5.6l41.7-20.3,3.5-5.6,9.9-5.7"/>
        <path class="st3" d="M843,886.4l32.9,18.9,21.9,12.6c.6.3,1.3,0,1.6-.3.3-.3.3-1.3-.2-1.6l-38.4-26-6.6-.3-9.9-5.7"/>
        <circle cx="840.4" cy="884.4" r="3.3"/>
        <path class="st6" d="M843.7,884.4c0,1.8-1.5,3.3-3.3,3.3s-3.3-1.5-3.3-3.3,1.5-3.3,3.3-3.3,3.3,1.5,3.3,3.3ZM843.7,884.4c0,1.8-1.5,3.3-3.3,3.3s-3.3-1.5-3.3-3.3,1.5-3.3,3.3-3.3,3.3,1.5,3.3,3.3ZM841.9,884.4c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5,1.5.7,1.5,1.5,1.5,1.5-.7,1.5-1.5Z"/>
        <path d="M841.9,884.4c0,.8-.7,1.5-1.5,1.5s-1.5-.7-1.5-1.5.7-1.5,1.5-1.5,1.5.7,1.5,1.5ZM841.2,884.4c0-.5-.4-.8-.8-.8s-.8.4-.8.8.4.8.8.8.8-.4.8-.8Z"/>
        <circle class="st5" cx="840.4" cy="884.4" r=".8"/>
        <circle class="st4" cx="840.4" cy="884.4" r="4.5"/>
      </g>
    </g>
    <g>
      <g>
        <line class="st2" x1="1017.9" y1="909.5" x2="940.1" y2="982.9"/>
        <line class="st2" x1="946.1" y1="989.1" x2="1018.5" y2="910"/>
        <line class="st2" x1="963.9" y1="904.6" x2="994.5" y2="1003"/>
        <line class="st2" x1="995.6" y1="1002.7" x2="972.3" y2="902.1"/>
        <line class="st2" x1="1022.9" y1="960.4" x2="930.2" y2="939.8"/>
        <line class="st2" x1="929.9" y1="941" x2="1020.7" y2="968"/>
        <line class="st2" x1="942.9" y1="957.9" x2="1000.1" y2="942.5"/>
        <line class="st2" x1="976" y1="980.1" x2="990.9" y2="922.7"/>
        <line class="st2" x1="950.9" y1="928.6" x2="1003.5" y2="981.1"/>
      </g>
      <g>
        <polyline class="st3" points="979.2 954.9 977.8 1092.6 976.1 1095.4 976.1 1095.4 976.1 1097.5 984.8 1097.5 984.8 1095.4 984.8 1095.4 983.1 1092.5 981.7 954.9"/>
        <path class="st3" d="M978.3,950.4l-25.3-5.6-16.8-3.7c-.4,0-.9.2-1,.5,0,.3,0,.9.5,1l30.3,9.1,4.3-1.2,7.6,1.7"/>
        <path class="st3" d="M979.3,954.2l7.8,24.7,5.2,16.4c.1.4.6.7,1,.6.3,0,.7-.5.6-.9l-7.3-30.8-3.2-3.2-2.3-7.4"/>
        <path class="st3" d="M981.7,950.3l17.5-19.1,11.6-12.7c.3-.3.3-.9,0-1.1-.2-.2-.8-.4-1.1,0l-23,21.7-1.2,4.3-5.3,5.7"/>
        <circle cx="980.1" cy="951.7" r="2.2" transform="translate(-162.7548 1700.1489) rotate(-77.3809)"/>
        <path class="st6" d="M980.5,949.5c1.2.3,2,1.5,1.7,2.7s-1.5,2-2.7,1.7-2-1.5-1.7-2.7,1.5-2,2.7-1.7ZM980.5,949.5c1.2.3,2,1.5,1.7,2.7s-1.5,2-2.7,1.7-2-1.5-1.7-2.7,1.5-2,2.7-1.7ZM980.3,950.7c-.5-.1-1.1.2-1.2.8s.2,1.1.8,1.2,1.1-.2,1.2-.8-.2-1.1-.8-1.2Z"/>
        <path d="M980.3,950.7c.5.1.9.7.8,1.2s-.7.9-1.2.8-.9-.7-.8-1.2.7-.9,1.2-.8ZM980.2,951.1c-.3,0-.6.1-.7.4s.1.6.4.7.6-.1.7-.4-.1-.6-.4-.7Z"/>
        <circle class="st5" cx="980.1" cy="951.7" r=".6" transform="translate(-162.7619 1700.1577) rotate(-77.3809)"/>
        <circle class="st4" cx="980" cy="951.7" r="3.1"/>
      </g>
    </g>
    <g>
      <g>
        <line class="st2" x1="488.3" y1="678.6" x2="300.1" y2="248.3"/>
        <line class="st2" x1="265.5" y1="264.1" x2="485.3" y2="680.5"/>
        <line class="st2" x1="588.6" y1="463" x2="136.6" y2="443.8"/>
        <line class="st2" x1="136.1" y1="448.6" x2="586.5" y2="501"/>
        <line class="st2" x1="248.9" y1="658.7" x2="493.1" y2="271.2"/>
        <line class="st2" x1="488.6" y1="268.3" x2="225.3" y2="627.3"/>
        <line class="st2" x1="399.4" y1="297.1" x2="378.3" y2="556.5"/>
        <line class="st2" x1="258.6" y1="400.9" x2="473.7" y2="547.5"/>
        <line class="st2" x1="508.8" y1="373.4" x2="213.6" y2="513.3"/>
      </g>
      <g>
        <polyline class="st3" points="364.3 471.3 358.2 1076.3 350.7 1088.5 350.7 1088.5 350.7 1097.5 388.8 1097.4 388.8 1088.5 388.8 1088.5 381.4 1075.8 375.3 471.3"/>
        <path class="st3" d="M378.1,454.4l60.6-96.2,40.2-64.1c1-1.6.4-4-.7-4.9-1-.8-3.9-1-4.9.5l-82.3,111.7-1.6,19.6-18.2,28.9"/>
        <path class="st3" d="M360.6,453l-113.6-4.4-75.6-2.8c-1.9,0-3.6,1.6-3.9,3.1-.2,1.2,1.1,3.8,2.9,4l137.9,15.4,17.8-8.4,34.1,1.3"/>
        <path class="st3" d="M373.4,468.8l53,100.6,35.4,66.9c.9,1.7,3.2,2.3,4.6,1.8,1.2-.4,2.8-2.8,2.1-4.5l-55.6-127.2-16.2-11.2-15.9-30.2"/>
        <circle cx="370" cy="459.8" r="9.8" transform="translate(-216.4 526.7) rotate(-57.7)"/>
        <path class="st6" d="M378.3,465c-2.9,4.6-8.9,5.9-13.5,3s-5.9-8.9-3-13.5,8.9-5.9,13.5-3,5.9,8.9,3,13.5ZM378.3,465c-2.9,4.6-8.9,5.9-13.5,3s-5.9-8.9-3-13.5,8.9-5.9,13.5-3,5.9,8.9,3,13.5ZM373.8,462.2c1.3-2.1.7-4.8-1.4-6.1s-4.8-.7-6.1,1.4-.7,4.8,1.4,6.1,4.8.7,6.1-1.4Z"/>
        <path d="M373.8,462.2c-1.3,2.1-4,2.7-6.1,1.4s-2.7-4-1.4-6.1,4-2.7,6.1-1.4,2.7,4,1.4,6.1ZM372.1,461.1c.7-1.2.4-2.7-.8-3.4s-2.7-.4-3.4.8-.4,2.7.8,3.4,2.7.4,3.4-.8Z"/>
        <circle class="st5" cx="370" cy="459.8" r="2.5" transform="translate(-216.4 526.7) rotate(-57.7)"/>
        <circle class="st4" cx="370.1" cy="459.8" r="13.4"/>
      </g>
    </g>
    <g>
      <g>
        <line class="st2" x1="505.4" y1="483.7" x2="40.4" y2="169.4"/>
        <line class="st2" x1="15.5" y1="207.4" x2="503.4" y2="487.5"/>
        <line class="st2" x1="468.9" y1="201.8" x2=".2" y2="471.3"/>
        <line class="st2" x1="2.7" y1="476.4" x2="491" y2="241.6"/>
        <line class="st2" x1="250.8" y1="616.5" x2="249.9" y2="69.1"/>
        <line class="st2" x1="243.5" y1="69.1" x2="206.9" y2="599.9"/>
        <line class="st2" x1="171.8" y1="155.1" x2="316.2" y2="430.6"/>
        <line class="st2" x1="96" y1="350" x2="406.8" y2="360.6"/>
        <line class="st2" x1="331.1" y1="162.4" x2="122.2" y2="492.2"/>
      </g>
      <g>
        <polyline class="st3" points="239.5 352 232.2 1075 223.2 1089.5 223.2 1089.5 223.2 1100.2 268.8 1100.2 268.8 1089.6 268.8 1089.5 260 1074.4 252.6 352"/>
        <path class="st3" d="M250.8,327.7l-.2-135.8-.3-90.4c0-2.3-2.1-4.3-3.9-4.5-1.5-.2-4.5,1.4-4.7,3.7l-11.7,165.4,10.9,20.8v40.8"/>
        <path class="st3" d="M232.2,337.4l-117.5,68.1-78.1,45.5c-2,1.2-2.6,4-2,5.6.6,1.4,3.5,3.2,5.5,2.2l149.1-72.5,12.6-19.9,35.3-20.5"/>
        <path class="st3" d="M255.3,345.2l117.7,67.7,78.5,44.9c2,1.1,4.7.3,5.8-1.1.9-1.2,1-4.7-.8-5.9l-137.4-92.9-23.5-1-35.4-20.3"/>
        <ellipse cx="246.1" cy="338.3" rx="11.7" ry="11.7"/>
        <path class="st6" d="M257.8,338.3c0,6.5-5.2,11.7-11.7,11.7s-11.7-5.2-11.7-11.7,5.2-11.7,11.7-11.7,11.7,5.2,11.7,11.7ZM257.8,338.3c0,6.5-5.2,11.7-11.7,11.7s-11.7-5.2-11.7-11.7,5.2-11.7,11.7-11.7,11.7,5.2,11.7,11.7ZM251.4,338.3c0-2.9-2.4-5.3-5.3-5.3s-5.3,2.4-5.3,5.3,2.4,5.3,5.3,5.3,5.3-2.4,5.3-5.3Z"/>
        <path d="M251.4,338.3c0,2.9-2.4,5.3-5.3,5.3s-5.3-2.4-5.3-5.3,2.4-5.3,5.3-5.3,5.3,2.4,5.3,5.3ZM249,338.3c0-1.6-1.3-3-2.9-3s-2.9,1.3-2.9,3,1.3,3,2.9,3,2.9-1.3,2.9-3Z"/>
        <circle class="st5" cx="246.1" cy="338.3" r="2.9"/>
        <circle class="st4" cx="246.1" cy="338.2" r="16"/>
      </g>
    </g>
  </g>
</svg>

<style>
  /* Illustrator's exported class rules, verbatim apart from the drop of an
     unused font rule. Svelte scopes them to this component, which is what keeps
     the two cuts' identically named `.stN` classes from colliding. */
  .st0 {
    fill: #dcdad2;
  }

  .st1 {
    fill: #c9c9c9;
    stroke: #c9c9c9;
  }

  .st2 {
    fill: none;
    stroke: #c3c3c3;
    stroke-width: 0.8px;
  }

  .st2,
  .st3,
  .st4 {
    stroke-miterlimit: 10;
  }

  .st3,
  .st5 {
    fill: #fff;
  }

  .st3,
  .st4 {
    stroke: #000;
  }

  .st6,
  .st4 {
    fill: #8fcb7e;
  }
</style>
