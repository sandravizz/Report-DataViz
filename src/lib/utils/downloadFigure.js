import { getChartSvgString } from "layerchart";

// Matches the report's own type ramp and ink color so the exported PNG reads
// like the on-screen figure, not a generic system-font screenshot.
const FONT_FAMILY = "Satoshi, sans-serif";
const INK = "#103900";
// Alpha matches the page's quiet-text value for this branch's ink, so the
// exported source line is as legible as the one under the figure.
// Computed to clear 4.5:1, not copied. See docs/type-rendering.md.
const MUTED = "rgba(16, 57, 0, 0.7)";
const RAIL_TRACK = "rgba(16, 57, 0, 0.1)";
// The reserved accent (--color-accent). In the export it is spent on exactly
// one thing, as on the page: the rule under the sandraviz.com wordmark.
const ACCENT = "#0FFF95";
const BACKGROUND = "#ffffff";

// Extra canvas on every side, so labels that overflow the SVG's nominal
// bounds survive the export — on screen they simply spill past the chart box,
// but rasterized standalone they get hard-clipped at the viewBox edge.
// Must stay smaller than `pad` below: charts composite at `pad -
// CAPTURE_BLEED`, so a wider bleed pushes them off the canvas' left edge.
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
// CAPTURE_BLEED of margin. Returns null for a Canvas-only chart (none here) or
// one whose SVG reports no usable dimensions at all; the caller skips those.
async function captureChartBleed(root, scale) {
  const svgStr = getChartSvgString(root);
  if (!svgStr) return null;

  const svg = new DOMParser().parseFromString(svgStr, "image/svg+xml").documentElement;

  // Bleed math must use the viewBox, not width/height: those come from
  // clientWidth/clientHeight and can drift from it when `.lc-root-container`
  // sits inside extra wrapper markup (e.g. figure 2's legend row), which
  // stretches every stroke and pattern to fit the mismatch.
  //
  // The fallback is not optional. LayerChart emits a viewBox only when it
  // wraps several SVG layers; a single-layer chart serializes with
  // width/height alone (layerchart/utils/download.js), those attributes being
  // its coordinate space. Drop the fallback and every such figure exports blank.
  const width = parseFloat(svg.getAttribute("width"));
  const height = parseFloat(svg.getAttribute("height"));
  const [vx, vy, vw, vh] = (svg.getAttribute("viewBox") ?? `0 0 ${width} ${height}`)
    .split(/[\s,]+/)
    .map(Number);
  if (![vx, vy, vw, vh].every(Number.isFinite)) return null;

  const outWidth = vw + CAPTURE_BLEED * 2;
  const outHeight = vh + CAPTURE_BLEED * 2;
  svg.setAttribute(
    "viewBox",
    `${vx - CAPTURE_BLEED} ${vy - CAPTURE_BLEED} ${outWidth} ${outHeight}`
  );
  // Rasterize straight at export resolution: width/height carry the retina
  // multiple while the viewBox stays in CSS units, so all of user space
  // (strokes and `patternUnits="userSpaceOnUse"` hatch tiles alike) scales
  // uniformly and the `<img>` needs no resampling on the way to the canvas.
  svg.setAttribute("width", String(Math.round(outWidth * scale)));
  svg.setAttribute("height", String(Math.round(outHeight * scale)));

  const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  try {
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      // `onerror` hands back an Event, not an Error, which surfaces as an
      // unreadable rejection further up — throw something legible instead.
      img.onerror = () => reject(new Error("Chart SVG could not be rasterized"));
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
  // Returned width/height are CSS units; the caller composites onto a context
  // already scaled by `exportScale`. `url` stays live until the caller has
  // drawn: revoking it can let the browser evict the decoded frame out from
  // under a later `drawImage`.
  return { img, url, width: outWidth, height: outHeight };
}

// Composites a figure's chart(s) with the report's title/subtitle/source/
// wordmark text into one downloadable PNG. Chart roots are auto-discovered
// via LayerChart's `.lc-root-container` marker and redrawn at their original
// relative position, so this works unmodified for a single chart, a stacked
// double panel, or a line-multiples grid alike.
export async function downloadFigureImage({
  figureEl,
  number,
  progress,
  title,
  subtitle,
  source,
  legendItems,
  filename,
}) {
  // Floored at 2 rather than tracking devicePixelRatio: the file outlives the
  // screen it was made on, so it stays retina-sharp off a 1x display too.
  const exportScale = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
  await Promise.all([
    document.fonts.load(`500 16px "Satoshi"`),
    document.fonts.load(`400 16px "Satoshi"`),
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
  const unionLeft = Math.min(...placements.map((p) => p.x));
  const unionTop = Math.min(...placements.map((p) => p.y));
  const unionBottom = Math.max(...placements.map((p) => p.y + p.height));
  const unionHeight = unionBottom - unionTop;

  const captures = await Promise.all(
    chartRoots.map((root) => captureChartBleed(root, exportScale))
  );

  const pad = 28;
  // 12px, not 11: this is ChartDisplay's eyebrow, which is `text-xs` — the
  // same size the legend below already matches with `legendSize`. It was the
  // one metric in the header that had drifted off its page value.
  const numberSize = 12;
  // `tracking-wide`, the eyebrow's letter-spacing on the page. Canvas2D
  // letterSpacing is recent (Chrome 99+, Safari 17.4+), so it is applied only
  // where supported and reset straight after — without it the glyphs sit
  // tighter than on the page, which is part of why the exported eyebrow read
  // as a denser, more saturated tone than the one on screen.
  const numberTracking = "0.025em";
  const railHeight = 1;
  const titleSize = 20;
  const subtitleSize = 14;
  const footerSize = 12;
  const wordmarkSize = 12;
  // Legend metrics, matching LineChartPanel's `text-xs` row: a 10px dot, a
  // 6px gap to its label, and 14px between items.
  const legendSize = 12;
  const legendDotSize = 10;
  const legendDotGap = 6;
  const legendItemGap = 14;
  // Air around the plot, standing in for the page's mb-20/mt-20 between the
  // subtitle, the chart and the footer.
  //
  // CAPTURE_BLEED is added on top rather than being decoration: the chart is
  // composited with that much transparent margin on every side, so a bare 24
  // above and 20 below left about 4px and 0px of real air — which is why the
  // title and the source both sat right against the image.
  const chartGap = 56 + CAPTURE_BLEED;
  // The page's rule is decoration-2; the export goes one thicker because the
  // accent is only 1.3:1 on white, and a 2px mint line under 12px grey text
  // vanishes once the PNG is scaled down in a viewer or a slide.
  const wordmarkRule = 3;
  const wordmarkRuleOffset = 3;
  const textWidth = containerRect.width;

  // The output canvas doubles as the measuring surface, so it stays unsized
  // until the wrapped line counts give it a height. Sizing a canvas resets
  // every context property, hence all drawing state is set after that point.
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  ctx.font = `500 ${titleSize}px ${FONT_FAMILY}`;
  const titleLines = title ? wrapLines(ctx, title, textWidth) : [];
  ctx.font = `400 ${subtitleSize}px ${FONT_FAMILY}`;
  const subtitleLines = subtitle ? wrapLines(ctx, subtitle, textWidth) : [];
  ctx.font = `400 ${footerSize}px ${FONT_FAMILY}`;
  const sourceLines = source ? wrapLines(ctx, source, textWidth) : [];

  // A figure's legend (LineChartPanel's `pair.legendItems` row) is plain DOM
  // sitting above `.lc-root-container`, not part of any chart SVG, so
  // getChartSvgString never sees it — without this it is simply missing from
  // the export. Redrawn here from the same {label, color} entries the page
  // renders, wrapped into rows like the on-screen flex row does.
  ctx.font = `400 ${legendSize}px ${FONT_FAMILY}`;
  const legendRows = [];
  for (const item of legendItems ?? []) {
    if (!item?.label) continue;
    const width = legendDotSize + legendDotGap + ctx.measureText(item.label).width;
    const row = legendRows[legendRows.length - 1];
    const rowWidth = row?.reduce((sum, it) => sum + it.width + legendItemGap, 0) ?? 0;
    if (row && rowWidth + width <= textWidth) row.push({ ...item, width });
    else legendRows.push([{ ...item, width }]);
  }

  const numberLineHeight = numberSize * 1.4;
  const titleLineHeight = titleSize * 1.3;
  const subtitleLineHeight = subtitleSize * 1.4;
  const footerLineHeight = footerSize * 1.5;
  const legendLineHeight = legendSize * 1.6;
  // Sits in the air under the subtitle, the same place the on-page legend is
  // absolutely positioned into.
  const legendBlockHeight = legendRows.length ? 14 + legendRows.length * legendLineHeight : 0;

  // Mirrors the on-page reading-progress rail (ChartDisplay.svelte), which
  // sits above the title — the export used to start at the title, cropping
  // the figure number and progress bar shown on screen.
  const numberBlockHeight = number ? numberLineHeight + 12 + railHeight + 16 : 0;

  const headerHeight =
    pad +
    numberBlockHeight +
    titleLines.length * titleLineHeight +
    (subtitleLines.length ? 10 + subtitleLines.length * subtitleLineHeight : 0) +
    legendBlockHeight +
    chartGap;
  const footerHeight =
    chartGap +
    sourceLines.length * footerLineHeight +
    8 +
    wordmarkSize * 1.4 +
    wordmarkRuleOffset +
    wordmarkRule +
    pad;

  const cssWidth = pad * 2 + textWidth;
  const cssHeight = headerHeight + unionHeight + footerHeight;

  canvas.width = Math.round(cssWidth * exportScale);
  canvas.height = Math.round(cssHeight * exportScale);
  ctx.scale(exportScale, exportScale);

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
    const canTrack = "letterSpacing" in ctx;
    if (canTrack) ctx.letterSpacing = numberTracking;
    ctx.fillText(number.toUpperCase(), pad, y);
    if (canTrack) ctx.letterSpacing = "0px";
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

  if (legendRows.length) {
    y += 14;
    ctx.font = `400 ${legendSize}px ${FONT_FAMILY}`;
    for (const row of legendRows) {
      let x = pad;
      for (const item of row) {
        ctx.fillStyle = item.color ?? INK;
        ctx.beginPath();
        // textBaseline is "top", so the dot is centred against the label's
        // own middle rather than against the line box.
        ctx.arc(x + legendDotSize / 2, y + legendSize * 0.55, legendDotSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = INK;
        ctx.fillText(item.label, x + legendDotSize + legendDotGap, y);
        x += item.width + legendItemGap;
      }
      y += legendLineHeight;
    }
  }

  for (let i = 0; i < placements.length; i++) {
    const capture = captures[i];
    if (!capture) continue;
    const p = placements[i];
    const drawX = pad + (p.x - unionLeft) - CAPTURE_BLEED;
    const drawY = headerHeight + (p.y - unionTop) - CAPTURE_BLEED;
    ctx.drawImage(capture.img, drawX, drawY, capture.width, capture.height);
    // Safe now: drawImage is synchronous, so the frame is already committed.
    URL.revokeObjectURL(capture.url);
  }

  let fy = headerHeight + unionHeight + chartGap;
  ctx.fillStyle = MUTED;
  ctx.font = `400 ${footerSize}px ${FONT_FAMILY}`;
  for (const line of sourceLines) {
    ctx.fillText(line, pad, fy);
    fy += footerLineHeight;
  }
  fy += 8;
  // Same grey as the source line above it, matching the page: all of a
  // figure's furniture sits at one weight.
  ctx.fillStyle = MUTED;
  ctx.font = `400 ${wordmarkSize}px ${FONT_FAMILY}`;
  const wordmark = "sandraviz.com";
  ctx.fillText(wordmark, pad, fy);
  // Canvas text has no text-decoration, so the accent rule the page draws
  // under the wordmark has to be a filled rect. Baseline is approximated at
  // 0.8em below the "top" baseline rather than read off TextMetrics, whose
  // actualBoundingBox* fields are unreliable for webfonts across browsers.
  ctx.fillStyle = ACCENT;
  ctx.fillRect(
    pad,
    fy + wordmarkSize * 0.8 + wordmarkRuleOffset,
    ctx.measureText(wordmark).width,
    wordmarkRule
  );

  // toBlob yields null rather than throwing when encoding fails; without this
  // the failure surfaces as a confusing error inside createObjectURL.
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Figure canvas could not be encoded as PNG");

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
