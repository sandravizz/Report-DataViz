<script>
  import { Footer, FooterCopyright, FooterLinkGroup, FooterLink, FooterIcon } from "flowbite-svelte";
  import { GithubSolid, TwitterSolid, InstagramSolid } from "flowbite-svelte-icons";
</script>

<Footer
  footerType="socialmedia"
  class="fixed inset-x-0 bottom-0 z-50 border-t border-[#2A2659]/10 bg-[#F4DDD6]/80 px-6 py-8 backdrop-blur-sm"
>
  <div class="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
    <FooterCopyright
      href="#top"
      by="Dual Wave"
      class="text-[#2A2659]/50"
      classes={{ link: "text-[#2A2659] hover:underline" }}
    />

    <FooterLinkGroup class="flex gap-6 text-sm text-[#2A2659]/50">
      <FooterLink href="#top" classes={{ link: "hover:text-[#2A2659]" }}>Home</FooterLink>
      <FooterLink href="#work" classes={{ link: "hover:text-[#2A2659]" }}>Work</FooterLink>
      <FooterLink href="#about" classes={{ link: "hover:text-[#2A2659]" }}>About</FooterLink>
      <FooterLink href="#contact" classes={{ link: "hover:text-[#2A2659]" }}>Contact</FooterLink>
    </FooterLinkGroup>

    <div class="flex gap-4">
      <FooterIcon href="#" ariaLabel="GitHub" class="text-[#2A2659]/50 hover:text-[#2A2659]">
        <GithubSolid class="h-5 w-5" />
      </FooterIcon>
      <FooterIcon href="#" ariaLabel="Twitter" class="text-[#2A2659]/50 hover:text-[#2A2659]">
        <TwitterSolid class="h-5 w-5" />
      </FooterIcon>
      <FooterIcon href="#" ariaLabel="Instagram" class="text-[#2A2659]/50 hover:text-[#2A2659]">
        <InstagramSolid class="h-5 w-5" />
      </FooterIcon>
    </div>
  </div>
</Footer>
