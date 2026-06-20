<script>
  import { Footer, FooterCopyright, FooterLinkGroup, FooterLink, FooterIcon } from "flowbite-svelte";
  import { GithubSolid, TwitterSolid, InstagramSolid } from "flowbite-svelte-icons";
</script>

<Footer footerType="socialmedia" class="border-t border-white/10 bg-[#080808] px-6 py-8">
  <div class="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
    <FooterCopyright
      href="#top"
      by="Dual Wave"
      class="text-gray-400"
      classes={{ link: "text-white hover:underline" }}
    />

    <FooterLinkGroup class="flex gap-6 text-sm text-gray-400">
      <FooterLink href="#top" classes={{ link: "hover:text-white" }}>Home</FooterLink>
      <FooterLink href="#work" classes={{ link: "hover:text-white" }}>Work</FooterLink>
      <FooterLink href="#about" classes={{ link: "hover:text-white" }}>About</FooterLink>
      <FooterLink href="#contact" classes={{ link: "hover:text-white" }}>Contact</FooterLink>
    </FooterLinkGroup>

    <div class="flex gap-4">
      <FooterIcon href="#" ariaLabel="GitHub" class="text-gray-400 hover:text-white">
        <GithubSolid class="h-5 w-5" />
      </FooterIcon>
      <FooterIcon href="#" ariaLabel="Twitter" class="text-gray-400 hover:text-white">
        <TwitterSolid class="h-5 w-5" />
      </FooterIcon>
      <FooterIcon href="#" ariaLabel="Instagram" class="text-gray-400 hover:text-white">
        <InstagramSolid class="h-5 w-5" />
      </FooterIcon>
    </div>
  </div>
</Footer>
