# Report Viz

Scroll-driven interactive reports (SvelteKit, Tailwind v4, daisyUI,
LayerChart), by Sandra Becker / SandraViz. One repository, one branch per
report.

## Branches

- Each report is its own branch (`findevlab`, `carta-demo`, `paris-demo`,
  `iw`, `kiel-institute`, `template`), with its own brand and data.
- `iea` is retired: never port changes to it.
- `main` has not changed since 2026-08-27. The most complete branch is the
  one with the most ticks in `docs/improvements.md` (today `paris-demo`).
- Other Claude sessions may be open in this same folder. Check for them
  before switching branches, and read another branch with
  `git show <branch>:<path>` instead of checking it out.

## Improvements register

`docs/improvements.md` lists every improvement that could apply to all
reports, and which branches have it.

- When a change looks reusable beyond this report, ask Sandra: "general, or
  only this report?" Then add or update its row the same day.
- When porting a general improvement to another branch, tick that branch.
- Before starting a new report, read the register.

## Rules that always apply

- **Do not verify.** No dev server, no browser, no `npm run build`. Finish
  the edits, say what changed, and Sandra checks on her own localhost.
- **LayerChart first.** Look for a LayerChart prop (`props.<key>`) before
  writing custom chart markup or CSS. If there is none, tell Sandra before
  writing custom code.
- **Breakpoints in rem,** never px, in Tailwind v4.
- **Text is as tall as its text; a figure is one sticky screen.** No
  `min-h-screen` on text sections.
- **Never hide content on phones.** Make it smaller or reflow it.
- **A report ends on text,** never on a pinned figure.
- **Never move the y axis** to the other side unless Sandra names the axis
  and the side.
- **Dictated messages can end mid-sentence.** Do the clear part and ask
  about the rest.
- **Design choices are shown, not described:** build a rendered comparison
  for fonts, colours, images and chart options.

## Where the knowledge is

- Writing figure text: the `report-copy` skill.
- Making or changing a chart: the `dataviz` skill.
- Reusable mechanisms, explained: `docs/*.md` (sticky scroll, figure
  controls, type rendering, chapter navigation, the map-to-chart morph).
