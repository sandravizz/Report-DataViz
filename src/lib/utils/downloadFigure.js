import { getChartSvgString } from "layerchart";

// Matches the report's own type ramp and ink color so the exported PNG reads
// like the on-screen figure, not a generic system-font screenshot.
const FONT_FAMILY = "Satoshi, sans-serif";
const INK = "#000000";
const MUTED = "rgba(0, 0, 0, 0.5)";
const MUTED_FAINT = "rgba(0, 0, 0, 0.3)";
const RAIL_TRACK = "rgba(0, 0, 0, 0.1)";
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
// TEMPORARY DIAGNOSTIC — remove once the figure 2 export artifact is fixed.
// Prints what the serialized SVG actually says about the two things that come
// out solid black in the PNG (grid lines, projection hatch), next to what the
// live DOM computes for the same elements. Also stashes the full SVG string on
// `window.__lastFigureSvg` for follow-up inspection.
function debugExport(root, svg, svgStr) {
  const q = (sel) => svg.querySelector(sel);
  const qa = (sel) => Array.from(svg.querySelectorAll(sel));

  window.__lastFigureSvg = svgStr;
  console.group("figure export debug");
  console.log("svg layers:", root.querySelectorAll(".lc-layout-svg").length);
  console.log("svg attrs:", {
    width: svg.getAttribute("width"),
    height: svg.getAttribute("height"),
    viewBox: svg.getAttribute("viewBox"),
    length: svgStr.length,
  });

  const liveGrid = root.querySelector("[class*='lc-grid-y-rule']");
  if (liveGrid) {
    const cs = getComputedStyle(liveGrid);
    console.log("live grid — stroke:", cs.stroke, "| opacity:", cs.opacity);
  }
  const gridLines = qa("[class*='lc-grid-y-rule']");
  console.log("serialized grid lines:", gridLines.length);
  console.log("first grid line:", gridLines[0]?.outerHTML);

  console.log("pattern:", q("pattern")?.outerHTML);
  console.log(
    "pattern-filled rects:",
    qa("rect")
      .filter((r) => (r.getAttribute("fill") ?? "").includes("url("))
      .map((r) => r.outerHTML)
  );
  console.groupEnd();
}

async function captureChartBleed(root, scale) {
  const svgStr = getChartSvgString(root);
  if (!svgStr) return null;

  const svg = new DOMParser().parseFromString(svgStr, "image/svg+xml").documentElement;
  try {
    debugExport(root, svg, svgStr);
  } catch (error) {
    console.warn("figure export debug failed", error);
  }

  // When a viewBox is present the bleed math must derive from it (the
  // content's own coordinate space) rather than the width/height attributes:
  // those come from the root element's clientWidth/clientHeight, which can
  // drift from the viewBox on a figure whose `.lc-root-container` sits inside
  // extra wrapper markup (e.g. figure 2's legend row) — sizing the output
  // canvas off the mismatched attribute stretches every stroke/pattern to fit.
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
  // Load the SVG at its native 1:1 size (width/height attrs matching the
  // viewBox exactly) and let createImageBitmap's own resize do the retina
  // upscale, rather than asking the SVG rasterizer to stretch width/height
  // attributes past the viewBox itself: a `patternUnits="userSpaceOnUse"`
  // tile (the projection-band hatch) doesn't reliably scale with that trick
  // across browsers and was tiling far denser than intended — plain
  // geometry (e.g. the grid lines) scaled fine, only the pattern didn't.
  svg.setAttribute("width", String(outWidth));
  svg.setAttribute("height", String(outHeight));

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
    const bitmap = await createImageBitmap(img, {
      resizeWidth: Math.round(outWidth * scale),
      resizeHeight: Math.round(outHeight * scale),
      resizeQuality: "high",
    });
    return { bitmap, width: outWidth, height: outHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
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
  filename,
}) {
  // Export scale, not the device's own ratio: the floor of 2 keeps the PNG
  // retina-sharp even when downloaded from a 1x display, since the file
  // outlives the screen it was made on.
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

  ctx.font = `500 ${titleSize}px ${FONT_FAMILY}`;
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
    ctx.font = `500 ${numberSize}px ${FONT_FAMILY}`;
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
