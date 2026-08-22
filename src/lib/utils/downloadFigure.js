import { getChartSvgString } from "layerchart";

// The report's own type ramp and ink, so the PNG reads like the on-screen
// figure rather than a system-font screenshot. Source Sans Pro is the
// body/chart-label face; #1b4160 is --color-base-content.
const FONT_FAMILY = "Source Sans Pro, helvetica, arial, sans-serif";
const INK = "#1b4160";
const MUTED = "rgba(27, 65, 96, 0.5)";
const MUTED_FAINT = "rgba(27, 65, 96, 0.3)";
const RAIL_TRACK = "rgba(27, 65, 96, 0.1)";
const BACKGROUND = "#ffffff";

// Extra canvas on every side, so labels that spill past the chart box on the
// page aren't hard-clipped at the viewBox edge when rasterized. Must stay
// smaller than `pad` below — charts composite at `pad - CAPTURE_BLEED`, and a
// wider bleed would push them off the canvas instead of giving them room.
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

// Captures one chart's `.lc-root-container` as a rasterized image with CAPTURE_BLEED of
// margin. Returns null when the SVG reports no usable dimensions; the caller
// skips those.
async function captureChartBleed(root, scale) {
  const svgStr = getChartSvgString(root);
  if (!svgStr) return null;

  const svg = new DOMParser().parseFromString(svgStr, "image/svg+xml").documentElement;

  // With a viewBox present the bleed math must derive from it, not from
  // width/height: those come from clientWidth/clientHeight and can drift from
  // the viewBox inside extra wrapper markup, stretching every stroke to fit.
  // But LayerChart only emits a viewBox when it wraps several SVG layers — a
  // single-layer chart comes back with width/height alone, which then IS its
  // coordinate space. Dropping this fallback blanks those figures.
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
  // Rasterize at final export resolution: width/height carry the retina
  // multiple while the viewBox stays in CSS units, so the whole user space
  // scales uniformly and the <img> needs no resampling.
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
      // unreadable rejection further up.
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
  // already scaled for export. `url` stays live until the caller has drawn:
  // revoking it can let the browser evict the decoded frame out from under a
  // later `drawImage`.
  return { img, url, width: outWidth, height: outHeight };
}

// Composites a figure's chart(s) plus its title/subtitle/source/wordmark into
// one PNG. Chart roots are found via LayerChart's `.lc-root-container` marker
// and redrawn at their original relative positions, so this works unchanged
// for a single chart, the double panel and the multiples grid alike.
export async function downloadFigureImage({
  figureEl,
  number,
  progress,
  title,
  subtitle,
  source,
  filename,
}) {
  // Floor of 2, not the device ratio: the file outlives the screen it was made
  // on, so it stays retina-sharp even when downloaded from a 1x display.
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

  // The canvas doubles as the measuring surface, so it stays unsized until the
  // line counts are known. Sizing it resets every context property, so all
  // drawing state is set after that.
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

  // Mirrors ChartDisplay's reading-progress rail, which sits above the title.
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
    ctx.drawImage(capture.img, drawX, drawY, capture.width, capture.height);
    // Safe now: drawImage is synchronous, so the frame is already committed.
    URL.revokeObjectURL(capture.url);
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

  // toBlob yields null rather than throwing, which would otherwise surface as
  // a confusing error inside createObjectURL.
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Figure canvas could not be encoded as PNG");

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
