import { getChartSvgString } from "layerchart";

// Matches the report's own type ramp and ink color so the exported PNG reads
// like the on-screen figure, not a generic system-font screenshot. Figure
// text renders in Satoshi on screen (main's face, paris-demo) and
// base-content is main's ink #1F281D (see tailwind.css).
const FONT_FAMILY = "Satoshi, sans-serif";
const INK = "#1F281D";
// Alpha matches the page's quiet-text value for this ink (main's /70), so
// the exported source line is as legible as the one under the figure.
// See docs/type-rendering.md.
const MUTED = "rgba(31, 40, 29, 0.7)";
const RAIL_TRACK = "rgba(31, 40, 29, 0.1)";
// The page sets its figures on the report ground (base-200), so the PNG does too.
const BACKGROUND = "#EFF1EF";
// Tailwind's `tracking-wide`, which every caption-sized line on the page
// carries: the figure eyebrow, the source line, the wordmark. Canvas2D
// letterSpacing is recent (Chrome 99+, Safari 17.4+), so `withTracking` is a
// no-op where it is missing and the export is simply what shipped before.
//
// It affects MEASUREMENT as well as drawing, so it has to be set before the
// wrapLines pass too, or a source line wraps at a width it will not occupy.
const TRACKING_WIDE = "0.025em";
function withTracking(ctx, on) {
  if ("letterSpacing" in ctx) ctx.letterSpacing = on ? TRACKING_WIDE : "0px";
}

// Fixed export resolution, not the screen's devicePixelRatio: a 2x PNG looks
// sharp on the retina screen it was made on and soft everywhere it is likely
// to go next (a slide, a doc, zoomed in a viewer). 4x of a ~700px figure is
// ~2800px wide, well inside every browser's canvas limit.
const EXPORT_SCALE = 4;

// An SVG rasterized through `<img>` is sandboxed: it cannot reach the page's
// web fonts, so the chart's axis and value labels silently fell back to the
// system sans — a different, blurrier-looking face than the canvas-drawn
// title above them. The fix is to hand the SVG its own copy of the face:
// the same Fontshare stylesheet app.html loads, with each face's woff2
// inlined as a data URI. Fetched once per page load, then reused.
const FONT_CSS_URL = "https://api.fontshare.com/v2/css?f[]=satoshi@1,2&display=block";
let embeddedFontCss;
function getEmbeddedFontCss() {
  embeddedFontCss ??= (async () => {
    const css = await (await fetch(FONT_CSS_URL)).text();
    // Fontshare serves one @font-face per style, each listing woff2, woff
    // and ttf. Keep each block with its woff2 alone, inlined.
    const blocks = css.match(/@font-face\s*{[^}]*}/g) ?? [];
    const out = [];
    for (const b of blocks) {
      let src = b.match(/url\(['"]?([^'")]+\.woff2[^'")]*)['"]?\)/)?.[1];
      if (!src) continue;
      if (src.startsWith("//")) src = `https:${src}`;
      const buf = await (await fetch(src)).arrayBuffer();
      let bin = "";
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.length; i += 0x8000) {
        bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      }
      out.push(b.replace(/src:[^;]*;/, `src: url(data:font/woff2;base64,${btoa(bin)}) format("woff2");`));
    }
    return out.join("\n");
  })().catch(() => {
    // Offline or blocked: export with the fallback face rather than not at all.
    embeddedFontCss = undefined;
    return "";
  });
  return embeddedFontCss;
}

// Extra canvas on every side so labels that overflow the SVG's nominal
// bounds (invisible on the live page, hard-clipped when rasterized standalone)
// survive the export — see docs/download-image-overflow-clip-bug.md.
const CAPTURE_BLEED = 20;

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Captures one chart's own `.lc-root-container` as a rasterized image with
// CAPTURE_BLEED of margin. Returns null for a Canvas-only chart (none here).
async function captureChartBleed(root, pixelRatio, fontCss) {
  const svgStr = getChartSvgString(root);
  if (!svgStr) return null;

  const svg = new DOMParser().parseFromString(svgStr, "image/svg+xml").documentElement;
  if (fontCss) {
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = fontCss;
    svg.insertBefore(style, svg.firstChild);
  }
  const width = parseFloat(svg.getAttribute("width"));
  const height = parseFloat(svg.getAttribute("height"));
  const [vx, vy, vw, vh] = (svg.getAttribute("viewBox") ?? `0 0 ${width} ${height}`)
    .split(/\s+/)
    .map(Number);

  // Bleed math must derive from the viewBox (the content's own coordinate
  // space), not the width/height attributes: those come from the root
  // element's clientWidth/clientHeight, which can drift from the viewBox on
  // a figure whose `.lc-root-container` sits inside extra wrapper markup
  // (e.g. a legend row) — sizing the output canvas off the mismatched
  // attribute stretches every stroke/pattern to fit.
  const outWidth = vw + CAPTURE_BLEED * 2;
  const outHeight = vh + CAPTURE_BLEED * 2;
  svg.setAttribute(
    "viewBox",
    `${vx - CAPTURE_BLEED} ${vy - CAPTURE_BLEED} ${vw + CAPTURE_BLEED * 2} ${vh + CAPTURE_BLEED * 2}`
  );
  // Rasterize straight at export resolution: width/height carry the retina
  // multiple while the viewBox stays in CSS units, so all of user space
  // (strokes and `patternUnits="userSpaceOnUse"` hatch tiles alike) scales
  // uniformly and the `<img>` needs no resampling on the way to the canvas.
  //
  // This replaces an earlier 1:1 load + createImageBitmap resize, which was
  // adopted back when stretching width/height past the viewBox tiled the
  // projection hatch far denser than intended. That density was caused by a
  // missing viewBox, not by the stretch: a single-layer chart serializes with
  // width/height alone, so without the reconstruction above its content sat
  // at 1:1 in the corner of an oversized canvas. The reconstruction is in
  // place, so the stretch is safe.
  svg.setAttribute("width", String(Math.round(outWidth * pixelRatio)));
  svg.setAttribute("height", String(Math.round(outHeight * pixelRatio)));

  const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  try {
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }

  // The loaded `<img>` is handed back as-is, NOT decoded into an ImageBitmap
  // first. Chrome drops the alpha channel when `createImageBitmap` decodes an
  // SVG-backed image, so anything whose lightness lives in alpha rather than
  // in its color — the projection hatch above all — composites at full
  // strength. No option combination avoids it: premultiplyAlpha and
  // colorSpaceConversion make no difference, and it reproduces at scale 1 with
  // no bleed. Firefox and Safari decode correctly, so the bug reads as
  // Chrome-only.
  //
  // Returned width/height are CSS units; the caller draws the `<img>` at its
  // own (already export-scaled) pixel size. `url` stays live until the caller has drawn:
  // revoking it can let the browser evict the decoded frame out from under a
  // later `drawImage`.
  return { img, url, width: outWidth, height: outHeight };
}

// Composites a figure's chart(s) with the report's title/subtitle/source/
// wordmark text into one downloadable PNG. Chart roots are auto-discovered
// via LayerChart's `.lc-root-container` marker and redrawn at their original
// relative position, so this works unmodified for a single chart and the
// stacked double panel alike.
export async function downloadFigureImage({
  figureEl,
  number,
  progress,
  title,
  subtitle,
  legend,
  source,
  filename,
}) {
  const dpr = EXPORT_SCALE;
  const fontCssPromise = getEmbeddedFontCss();
  await Promise.all([
    document.fonts.load(`500 16px "Satoshi"`),
    document.fonts.load(`400 16px "Satoshi"`),
    document.fonts.load(`300 16px "Satoshi"`),
  ]);

  const chartRoots = Array.from(figureEl.querySelectorAll(".lc-root-container"));
  if (chartRoots.length === 0) return;

  const containerRect = figureEl.getBoundingClientRect();
  const placements = chartRoots.map((root) => {
    const rect = root.getBoundingClientRect();
    return {
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top,
      width: rect.width,
      height: rect.height,
    };
  });
  // Text the page sets in HTML between the charts — a composite figure's
  // panel names (DoubleChartPanel marks them `data-export-label`) — drawn
  // at its on-screen position with its on-screen type.
  // A hidden label (grouped bar panels write their names inside the plot,
  // where the SVG export already carries them) is skipped.
  const labels = Array.from(figureEl.querySelectorAll("[data-export-label]")).filter((el) => el.getClientRects().length > 0).map((el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return {
      text: el.textContent.trim(),
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top,
      height: rect.height,
      font: `${style.fontWeight} ${style.fontSize} ${FONT_FAMILY}`,
      lineHeight: parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.4,
      fontSize: parseFloat(style.fontSize),
    };
  });
  const blocks = [...placements, ...labels];
  const unionLeft = Math.min(...blocks.map((p) => p.x));
  const unionTop = Math.min(...blocks.map((p) => p.y));
  const unionBottom = Math.max(...blocks.map((p) => p.y + p.height));
  const unionHeight = unionBottom - unionTop;

  const fontCss = await fontCssPromise;
  const captures = await Promise.all(
    chartRoots.map((root) => captureChartBleed(root, dpr, fontCss))
  );

  const pad = 28;
  // 12px, not 11: this is ChartDisplay's eyebrow, which is `text-xs` — the
  // same size the legend below already matches with `legendSize`. It was the
  // one metric in the header that had drifted off its page value.
  const numberSize = 12;
  const railHeight = 1;
  const titleSize = 20;
  const subtitleSize = 14;
  // 11px, not 12: the source line and the wordmark are `text-[11px]` on the
  // page (FigureFooter.svelte), the one caption size that is not `text-xs`.
  const footerSize = 11;
  const wordmarkSize = 11;
  const textWidth = containerRect.width;

  const measure = document.createElement("canvas").getContext("2d");
  measure.font = `500 ${titleSize}px ${FONT_FAMILY}`;
  const titleLines = wrapLines(measure, title, textWidth);
  measure.font = `400 ${subtitleSize}px ${FONT_FAMILY}`;
  const subtitleLines = subtitle ? wrapLines(measure, subtitle, textWidth) : [];
  measure.font = `400 ${footerSize}px ${FONT_FAMILY}`;
  withTracking(measure, true);
  const sourceLines = source ? wrapLines(measure, source, textWidth) : [];
  withTracking(measure, false);

  const numberLineHeight = numberSize * 1.4;
  const titleLineHeight = titleSize * 1.3;
  const subtitleLineHeight = subtitleSize * 1.4;
  // `leading-snug` (1.375) — the class on the source <span>, not the 1.5 that
  // was standing in for it. Only shows on a source long enough to wrap.
  const footerLineHeight = footerSize * 1.375;

  // Mirrors the on-page reading-progress rail (ChartDisplay.svelte), which
  // sits above the title — the export used to start at the title, cropping
  // the figure number and progress bar shown on screen.
  const numberBlockHeight = number ? numberLineHeight + 12 + railHeight + 16 : 0;

  // The figure's legend (`legend`: [{ label, color }]), one row under the
  // subtitle as on the page: 10px dots, text-xs light labels.
  const legendSize = 12;
  const legendLineHeight = legendSize * 1.4;
  // The scale switch on the legend row (DoubleChartPanel marks it
  // `data-export-scale`): both states named, the active one on its soft
  // fill, read off the live buttons so the PNG shows the scale on screen.
  const scaleButtons = Array.from(
    figureEl.querySelectorAll("[data-export-scale] button")
  ).map((el) => ({
    text: el.textContent.trim(),
    active: el.getAttribute("aria-pressed") === "true",
  }));
  const scaleButtonHeight = 20;
  const legendRowHeight = scaleButtons.length
    ? Math.max(legendLineHeight, scaleButtonHeight)
    : legendLineHeight;
  const legendBlockHeight = legend?.length || scaleButtons.length ? 14 + legendRowHeight : 0;

  const headerHeight =
    pad +
    numberBlockHeight +
    titleLines.length * titleLineHeight +
    (subtitleLines.length ? 10 + subtitleLines.length * subtitleLineHeight : 0) +
    legendBlockHeight +
    24;
  const footerHeight = 20 + sourceLines.length * footerLineHeight + 8 + wordmarkSize * 1.4 + pad;

  const cssWidth = pad * 2 + textWidth;
  const cssHeight = headerHeight + unionHeight + footerHeight;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  ctx.textBaseline = "top";
  let y = pad;

  if (number) {
    ctx.fillStyle = MUTED;
    // Weight 400, matching the page: the eyebrow carries no weight utility in
    // ChartDisplay. At 500 the strokes of a 12px uppercase line close up, and
    // the same MUTED ink reads bolder and darker in the PNG than the light
    // tone it is on screen — it looked like a different colour.
    ctx.font = `400 ${numberSize}px ${FONT_FAMILY}`;
    withTracking(ctx, true);
    ctx.fillText(number.toUpperCase(), pad, y);
    withTracking(ctx, false);
    y += numberLineHeight + 12;

    ctx.fillStyle = RAIL_TRACK;
    ctx.fillRect(pad, y, textWidth, railHeight);
    if (progress != null) {
      ctx.fillStyle = MUTED;
      ctx.fillRect(pad, y, textWidth * Math.min(Math.max(progress, 0), 1), railHeight);
    }
    y += railHeight + 16;
  }

  ctx.fillStyle = INK;
  ctx.font = `500 ${titleSize}px ${FONT_FAMILY}`;
  for (const line of titleLines) {
    ctx.fillText(line, pad, y);
    y += titleLineHeight;
  }
  if (subtitleLines.length) {
    y += 10;
    ctx.font = `400 ${subtitleSize}px ${FONT_FAMILY}`;
    for (const line of subtitleLines) {
      ctx.fillText(line, pad, y);
      y += subtitleLineHeight;
    }
  }

  if (legend?.length || scaleButtons.length) {
    y += 14;
    let lx = pad;
    ctx.font = `300 ${legendSize}px ${FONT_FAMILY}`;
    for (const item of legend ?? []) {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(lx + 5, y + legendRowHeight / 2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = INK;
      ctx.fillText(item.label, lx + 16, y + (legendRowHeight - legendSize) / 2);
      lx += 16 + ctx.measureText(item.label).width + 16;
    }

    // Right-aligned like the page: h-5 px-1.5 buttons, 2px apart, 4px
    // corners; active = ink at 6% fill + full ink, the other at 55% ink.
    const buttonPadX = 6;
    const buttonGap = 2;
    const widths = scaleButtons.map((b) => ctx.measureText(b.text).width + buttonPadX * 2);
    let bx = pad + textWidth - widths.reduce((a, w) => a + w, 0) - buttonGap * (widths.length - 1);
    const by = y + (legendRowHeight - scaleButtonHeight) / 2;
    scaleButtons.forEach((b, k) => {
      if (b.active) {
        ctx.fillStyle = "rgba(31, 40, 29, 0.06)";
        ctx.beginPath();
        ctx.roundRect(bx, by, widths[k], scaleButtonHeight, 4);
        ctx.fill();
      }
      ctx.fillStyle = b.active ? INK : "rgba(31, 40, 29, 0.55)";
      ctx.fillText(b.text, bx + buttonPadX, by + (scaleButtonHeight - legendSize) / 2);
      bx += widths[k] + buttonGap;
    });
  }

  ctx.fillStyle = INK;
  for (const label of labels) {
    ctx.font = label.font;
    ctx.fillText(
      label.text,
      pad + (label.x - unionLeft),
      headerHeight + (label.y - unionTop) + (label.lineHeight - label.fontSize) / 2
    );
  }

  for (let i = 0; i < placements.length; i++) {
    const capture = captures[i];
    if (!capture) continue;
    const p = placements[i];
    const drawX = pad + (p.x - unionLeft) - CAPTURE_BLEED;
    const drawY = headerHeight + (p.y - unionTop) - CAPTURE_BLEED;
    // Drawn 1:1 in device pixels on a whole-pixel origin. getBoundingClientRect
    // positions are fractional, and a half-pixel offset (or a size off by the
    // rounding in captureChartBleed) makes drawImage resample the whole chart,
    // which softens every line and label in it.
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(
      capture.img,
      Math.round(drawX * dpr),
      Math.round(drawY * dpr),
      capture.img.width,
      capture.img.height
    );
    ctx.restore();
    // Safe now: drawImage is synchronous, so the frame is already committed.
    URL.revokeObjectURL(capture.url);
  }

  let fy = headerHeight + unionHeight + 20;
  ctx.fillStyle = MUTED;
  ctx.font = `400 ${footerSize}px ${FONT_FAMILY}`;
  withTracking(ctx, true);
  for (const line of sourceLines) {
    ctx.fillText(line, pad, fy);
    fy += footerLineHeight;
  }
  withTracking(ctx, false);
  fy += 8;
  // Same grey as the source line above it, matching the page: all of a
  // figure's furniture sits at one weight.
  ctx.fillStyle = MUTED;
  ctx.font = `400 ${wordmarkSize}px ${FONT_FAMILY}`;
  withTracking(ctx, true);
  ctx.fillText("sandraviz.com", pad, fy);
  withTracking(ctx, false);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
