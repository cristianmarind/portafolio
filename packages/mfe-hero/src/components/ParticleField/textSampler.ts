/**
 * Samples pixel positions from canvas text and returns
 * a Float32Array of [x, y, z] triplets for Three.js geometry.
 */
export function sampleTextPositions(
  text: string,
  count: number,
  canvasWidth = 1400,
  canvasHeight = 300,
): Float32Array {
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.floor(canvasHeight * 0.55)}px "Space Grotesk", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
  const candidates: [number, number][] = [];

  const step = 4;
  for (let y = 0; y < canvasHeight; y += step) {
    for (let x = 0; x < canvasWidth; x += step) {
      const alpha = imageData[(y * canvasWidth + x) * 4 + 3];
      if (alpha > 128) candidates.push([x, y]);
    }
  }

  // Randomly sample `count` positions from candidates
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * candidates.length);
    const [cx, cy] = candidates[idx] ?? [canvasWidth / 2, canvasHeight / 2];

    // Normalize to [-1, 1] range, then scale to world units
    positions[i * 3 + 0] = ((cx / canvasWidth) - 0.5) * 14;
    positions[i * 3 + 1] = -((cy / canvasHeight) - 0.5) * 3;
    positions[i * 3 + 2] = 0;
  }

  return positions;
}
