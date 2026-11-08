/**
 * Turns a photo into particle targets. The background colour is estimated
 * from the top corners; anything that differs enough from it is "subject".
 * Brighter subject pixels get more (and brighter) particles.
 */
export type Sampled = { positions: Float32Array; lum: Float32Array; aspect: number };

export async function samplePortrait(src: string, count: number, cropBottom = 0.78): Promise<Sampled> {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();

  const W = 200;
  const fullH = Math.round((W * img.naturalHeight) / img.naturalWidth);
  const H = Math.round(fullH * cropBottom); // keep head → waist
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight * cropBottom, 0, 0, W, H);
  const data = ctx.getImageData(0, 0, W, H).data;

  // Background colour from the two top corners.
  let br = 0, bg = 0, bb = 0, n = 0;
  for (const x0 of [0, W - 10]) {
    for (let y = 0; y < 10; y++)
      for (let x = x0; x < x0 + 10; x++) {
        const i = (y * W + x) * 4;
        br += data[i]; bg += data[i + 1]; bb += data[i + 2]; n++;
      }
  }
  br /= n; bg /= n; bb /= n;

  // Per-pixel subject mask and luminance.
  const maskArr = new Float32Array(W * H);
  const lumArr = new Float32Array(W * H);
  for (let p = 0; p < W * H; p++) {
    const r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2];
    const dist = Math.sqrt((r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2);
    maskArr[p] = Math.min(1, Math.max(0, (dist - 60) / 70));
    lumArr[p] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  const cx: number[] = [], cy: number[] = [], cl: number[] = [], cw: number[] = [];
  let total = 0;
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const p = y * W + x;
      const mask = maskArr[p];
      if (mask < 0.25) continue;
      const lum = lumArr[p];
      // Edges (silhouette + facial/clothing detail) get extra particles so the shape reads.
      const edge =
        Math.abs(maskArr[p + 1] - maskArr[p - 1]) + Math.abs(maskArr[p + W] - maskArr[p - W]) +
        (Math.abs(lumArr[p + 1] - lumArr[p - 1]) + Math.abs(lumArr[p + W] - lumArr[p - W])) * 2;
      const w = mask * (0.55 + lum * 0.7) + Math.min(edge, 1.2) * 1.4;
      cx.push(x); cy.push(y); cl.push(lum); cw.push(w);
      total += w;
    }
  }
  if (!cx.length) throw new Error("no subject found");

  // Weighted sampling via cumulative distribution.
  const cdf = new Float32Array(cw.length);
  let acc = 0;
  for (let i = 0; i < cw.length; i++) cdf[i] = acc += cw[i] / total;

  const positions = new Float32Array(count * 3);
  const lum = new Float32Array(count);
  const scale = 1 / H; // normalise to height 1
  for (let k = 0; k < count; k++) {
    const r = Math.random();
    let lo = 0, hi = cdf.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < r) lo = mid + 1; else hi = mid;
    }
    const px = cx[lo] + Math.random() - 0.5;
    const py = cy[lo] + Math.random() - 0.5;
    positions[k * 3] = (px - W / 2) * scale;
    positions[k * 3 + 1] = (H / 2 - py) * scale;
    positions[k * 3 + 2] = (cl[lo] - 0.5) * 0.12 + (Math.random() - 0.5) * 0.02;
    lum[k] = cl[lo];
  }
  return { positions, lum, aspect: W / H };
}

/** Fallback if the photo can't be read: a soft glowing disc. */
export function sampleDisc(count: number): Sampled {
  const positions = new Float32Array(count * 3);
  const lum = new Float32Array(count);
  for (let k = 0; k < count; k++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 0.42;
    positions[k * 3] = Math.cos(a) * r;
    positions[k * 3 + 1] = Math.sin(a) * r;
    positions[k * 3 + 2] = (Math.random() - 0.5) * 0.1;
    lum[k] = 1 - r;
  }
  return { positions, lum, aspect: 1 };
}
