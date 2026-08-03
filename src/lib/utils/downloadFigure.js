import { getChartSvgString } from "layerchart";

// Matches the report's own type ramp and ink color so the exported PNG reads
// like the on-screen figure, not a generic system-font screenshot.
const FONT_FAMILY = "Satoshi, sans-serif";
const INK = "#000000";
const MUTED = "rgba(0, 0, 0, 0.5)";
const MUTED_FAINT = "rgba(0, 0, 0, 0.3)";
const RAIL_TRACK = "rgba(0, 0, 0, 0.1)";
const BACKGROUND = "#ffffff";

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

// Captures one chart's own `.lc-root-container` as a bitmap with
// CAPTURE_BLEED of margin. Returns null for a Canvas-only chart (none here).
async function captureChartBleed(root, pixelRatio) {
  const svgStr = getChartSvgString(root);
  if (!svgStr) return null;

  const svg = new DOMParser().parseFromString(svgStr, "image/svg+xml").documentElement;
  const width = parseFloat(svg.getAttribute("width"));
  const height = parseFloat(svg.getAttribute("height"));
  const [vx, vy, vw, vh] = (svg.getAttribute("viewBox") ?? `0 0 ${width} ${height}`)
    .split(/\s+/)
    .map(Number);

  const outWidth = width + CAPTURE_BLEED * 2;
  const outHeight = height + CAPTURE_BLEED * 2;
  svg.setAttribute(
    "viewBox",
    `${vx - CAPTURE_BLEED} ${vy - CAPTURE_BLEED} ${vw + CAPTURE_BLEED * 2} ${vh + CAPTURE_BLEED * 2}`
  );
  svg.setAttribute("width", String(Math.round(outWidth * pixelRatio)));
  svg.setAttribute("height", String(Math.round(outHeight * pixelRatio)));

  const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    const bitmap = await createImageBitmap(img);
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
  const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
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
    chartRoots.map((root) => captureChartBleed(root, dpr))
  );

  const pad = 28;
  const numberSize = 11;
  const railHeight = 1;
  const titleSize = 20;
  const subtitleSize = 14;
  const footerSize = 12;
  const wordmarkSize = 12;
  const textWidth = containerRect.width;

  const measure = document.createElement("canvas").getContext("2d");
  measure.font = `500 ${titleSize}px ${FONT_FAMILY}`;
  const titleLines = wrapLines(measure, title, textWidth);
  measure.font = `400 ${subtitleSize}px ${FONT_FAMILY}`;
  const subtitleLines = subtitle ? wrapLines(measure, subtitle, textWidth) : [];
  measure.font = `400 ${footerSize}px ${FONT_FAMILY}`;
  const sourceLines = source ? wrapLines(measure, source, textWidth) : [];

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

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
