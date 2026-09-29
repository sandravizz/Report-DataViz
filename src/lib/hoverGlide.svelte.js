// HOVER GLIDE (after bleibtgleich'26's recognitions list): ONE soft ink block
// sits behind a list and glides from row to row as the pointer moves down it,
// instead of each row lighting up on its own. Used by the Index sheet and the
// chapter rail, so both navigations hover the same way.
//
// It appears in place on the first row touched (no glide in from the top),
// follows keyboard focus too, and fades out when the pointer leaves the list.
// Touch is ignored: there is no hover on a phone.
//
// Usage:
//   const glide = new HoverGlide(4);
//   <div {@attach glide.attach} class="relative isolate">
//     <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 -z-10 bg-base-content/6" style={glide.style}></div>
//     ...rows, each an element with `data-row`...
//   </div>
// `isolate` keeps the block's -z-10 behind the rows but above the ground.
// `pad` grows the block that many px above and below each row.
export class HoverGlide {
  y = $state(0);
  h = $state(0);
  visible = $state(false);
  // False for the first placement, so only the fade runs.
  glide = $state(false);

  constructor(pad = 0) {
    this.pad = pad;
  }

  hide = () => {
    this.visible = false;
  };

  attach = (list) => {
    const track = (event) => {
      if (event.pointerType === "touch") return;
      const row = event.target.closest?.("[data-row]");
      if (!row || !list.contains(row)) return;
      const box = list.getBoundingClientRect();
      const r = row.getBoundingClientRect();
      this.glide = this.visible;
      this.y = r.top - box.top - this.pad;
      this.h = r.height + this.pad * 2;
      this.visible = true;
    };
    const untrack = (event) => {
      if (list.contains(event.relatedTarget)) return;
      this.visible = false;
    };

    list.addEventListener("pointerover", track);
    list.addEventListener("focusin", track);
    list.addEventListener("pointerleave", untrack);
    list.addEventListener("focusout", untrack);
    return () => {
      list.removeEventListener("pointerover", track);
      list.removeEventListener("focusin", track);
      list.removeEventListener("pointerleave", untrack);
      list.removeEventListener("focusout", untrack);
    };
  };

  // Fast out, soft landing, ~0.2s a move. Reduced motion: it jumps.
  get style() {
    const ease = "220ms cubic-bezier(0.22, 1, 0.36, 1)";
    const still =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const move = this.glide && !still ? `, transform ${ease}, height ${ease}` : "";
    return `height: ${this.h}px; transform: translateY(${this.y}px); opacity: ${this.visible ? 1 : 0}; transition: opacity 150ms ease-out${move};`;
  }
}
