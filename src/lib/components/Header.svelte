<script>
  import { Navbar, NavBrand, NavHamburger, NavUl, NavLi } from "flowbite-svelte";
</script>

<Navbar
  fluid
  class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080808]/80 px-6 py-3 backdrop-blur-sm"
>
  <NavBrand href="#top">
    <span class="self-center whitespace-nowrap font-mono text-lg font-semibold text-white">
      Dual Wave
    </span>
  </NavBrand>
  <NavHamburger class="text-white hover:bg-white/10 focus:ring-white/20" />
  <NavUl
    classes={{
      ul: "flex flex-col gap-1 bg-[#080808] p-4 font-mono text-sm md:flex-row md:items-center md:gap-8 md:bg-transparent md:p-0",
      active: "text-white",
      nonActive: "text-gray-400 hover:text-white"
    }}
  >
    <NavLi href="#top">Home</NavLi>
    <NavLi href="#work">Work</NavLi>
    <NavLi href="#about">About</NavLi>
    <NavLi href="#contact">Contact</NavLi>
  </NavUl>
</Navbar>
