import { getChartSvgString } from "layerchart";

// Matches the report's own type ramp and ink color so the exported PNG reads
// like the on-screen figure, not a generic system-font screenshot. Source
// Sans Pro is IW's body/chart-label face (Acherus Grotesque is heading-only
// and only ships in bold/black weights — see src/styles/fonts.css) and
// #1b4160 is the report's own ink (--color-base-content in tailwind.css).
const FONT_FAMILY = "Source Sans Pro, helvetica, arial, sans-serif";
const INK = "#1b4160";
const MUTED = "rgba(27, 65, 96, 0.5)";
const MUTED_FAINT = "rgba(27, 65, 96, 0.3)";
const RAIL_TRACK = "rgba(27, 65, 96, 0.1)";
const BACKGROUND = "#ffffff";

// Extra canvas on every side so labels that overflow the SVG's nominal bounds
// survive the export. On the live page they spill past the chart box and stay
// visible; rasterized standalone, that same overflow is hard-clipped at the
// viewBox edge, beheading end-of-line labels and annotation text.
// Must stay smaller than `pad` below: charts are composited at
// `pad - CAPTURE_BLEED`, so a bleed wider than the page margin would push them
// off the left edge of the canvas instead of giving their labels room.
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

// Captures one chart's own `.lc-root-container` as a bitmap with
// CAPTURE_BLEED of margin. Returns null for a Canvas-only chart (none here) or
// one whose SVG reports no usable dimensions at all; the caller skips those.
async function captureChartBleed(root, scale) {
  const svgStr = getChartSvgString(root);
  if (!svgStr) return null;

  const svg = new DOMParser().parseFromString(svgStr, "image/svg+xml").documentElement;

  // When a viewBox is present the bleed math must derive from it (the
  // content's own coordinate space) rather than the width/height attributes:
  // those come from the root element's clientWidth/clientHeight, which can
  // drift from the viewBox on a figure whose `.lc-root-container` sits inside
  // extra wrapper markup — sizing the output canvas off the mismatched
  // attribute stretches every stroke/pattern to fit.
  //
  // But a viewBox is not guaranteed. LayerChart only adds one when it has to
  // wrap several SVG layers; a chart that serializes to a single layer comes
  // back with width/height alone (see layerchart/utils/download.js). Its
  // content then sits in raw pixel coordinates, so those attributes *are* its
  // coordinate space — which is exactly what this fallback reconstructs.
  // Removing it blanks the chart area of every single-layer figure.
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
  // Rasterize at the final export resolution: width/height carry the retina
  // multiple while the viewBox above stays in CSS units, so the whole user
  // space (strokes and `patternUnits="userSpaceOnUse"` hatch tiles alike)
  // scales uniformly. The `<img>` is then already at output size and needs no
  // resampling on the way to the canvas.
  //
  // The alternative — loading at 1:1 and letting `createImageBitmap`'s
  // resizeWidth/resizeHeight do the upscale — is what turned every
  // translucent stroke opaque in Chrome: its resampler mishandles alpha, so
  // faint gridlines and hatch fills rasterized as solid ink. Safari and
  // Firefox largely ignore those resize options, which is why the bug only
  // ever showed up in Chrome.
  //
  // Stretching width/height past the viewBox is only unsafe when there is no
  // viewBox at all — a single-layer chart serializes with width/height alone,
  // and without the reconstruction above its content would stay at 1:1 in the
  // corner of an oversized canvas, which is what made the hatch look "far
  // denser than intended" before.
  svg.setAttribute("width", String(Math.round(outWidth * scale)));
  svg.setAttribute("height", String(Math.round(outHeight * scale)));

  const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      // `onerror` hands back an Event, not an Error, which surfaces as an
      // unreadable rejection further up — throw something legible instead.
      img.onerror = () => reject(new Error("Chart SVG could not be rasterized"));
      img.src = url;
    });
    // No resize options: the image is already at export resolution, so this
    // just decodes it. `width`/`height` come back in CSS units — the caller
    // composites onto a context already scaled by `exportScale`.
    const bitmap = await createImageBitmap(img);
    return { bitmap, width: outWidth, height: outHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Composites a figure's chart(s) with the report's title/subtitle/source/
// wordmark text into one downloadable PNG. Chart roots are auto-discovered
// via LayerChart's `.lc-root-container` marker and redrawn at their original
// relative position, so this works unmodified for a single chart, the
// stacked double panel, and the line-multiples grid alike.
export async function downloadFigureImage({
  figureEl,
  number,
  progress,
  title,
  subtitle,
  source,
  filename,
}) {
  // Export scale, not the device's own ratio: the floor of 2 keeps the PNG
  // retina-sharp even when downloaded from a 1x display, since the file
  // outlives the screen it was made on.
  const exportScale = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
  await Promise.all([
    document.fonts.load(`600 16px "Source Sans Pro"`),
    document.fonts.load(`400 16px "Source Sans Pro"`),
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
  const numberSize = 11;
  const railHeight = 1;
  const titleSize = 20;
  const subtitleSize = 14;
  const footerSize = 12;
  const wordmarkSize = 12;
  const textWidth = containerRect.width;

  // The output canvas doubles as the measuring surface — line counts decide
  // its height, so it stays unsized until they are known. Sizing it below
  // resets every context property, hence all drawing state is set after that.
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  ctx.font = `600 ${titleSize}px ${FONT_FAMILY}`;
  const titleLines = title ? wrapLines(ctx, title, textWidth) : [];
  ctx.font = `400 ${subtitleSize}px ${FONT_FAMILY}`;
  const subtitleLines = subtitle ? wrapLines(ctx, subtitle, textWidth) : [];
  ctx.font = `400 ${footerSize}px ${FONT_FAMILY}`;
  const sourceLines = source ? wrapLines(ctx, source, textWidth) : [];

  const numberLineHeight = numberSize * 1.4;
  const titleLineHeight = titleSize * 1.3;
  const subtitleLineHeight = subtitleSize * 1.4;
  const footerLineHeight = footerSize * 1.5;

  // Mirrors the on-page reading-progress rail (ChartDisplay.svelte), which
  // sits above the title — the export used to start at the title, cropping
  // the figure number and progress bar shown on screen.
  const numberBlockHeight = number ? numberLineHeight + 12 + railHeight + 16 : 0;

  const headerHeight =
    pad +
    numberBlockHeight +
    titleLines.length * titleLineHeight +
    (subtitleLines.length ? 10 + subtitleLines.length * subtitleLineHeight : 0) +
    24;
  const footerHeight = 20 + sourceLines.length * footerLineHeight + 8 + wordmarkSize * 1.4 + pad;

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
    ctx.font = `600 ${numberSize}px ${FONT_FAMILY}`;
    ctx.fillText(number.toUpperCase(), pad, y);
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
  ctx.font = `600 ${titleSize}px ${FONT_FAMILY}`;
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

  for (let i = 0; i < placements.length; i++) {
    const capture = captures[i];
    if (!capture) continue;
    const p = placements[i];
    const drawX = pad + (p.x - unionLeft) - CAPTURE_BLEED;
    const drawY = headerHeight + (p.y - unionTop) - CAPTURE_BLEED;
    ctx.drawImage(capture.bitmap, drawX, drawY, capture.width, capture.height);
    // A decoded ImageBitmap holds memory (often GPU-side) until it is closed
    // or collected; release each one as soon as it has been composited.
    capture.bitmap.close();
  }

  let fy = headerHeight + unionHeight + 20;
  ctx.fillStyle = MUTED;
  ctx.font = `400 ${footerSize}px ${FONT_FAMILY}`;
  for (const line of sourceLines) {
    ctx.fillText(line, pad, fy);
    fy += footerLineHeight;
  }
  fy += 8;
  ctx.fillStyle = MUTED_FAINT;
  ctx.font = `400 ${wordmarkSize}px ${FONT_FAMILY}`;
  ctx.fillText("sandraviz.com", pad, fy);

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
