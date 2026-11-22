const MAX_DIMENSION = 800;
const MAX_OUTPUT_CHARS = 110_000;
const HARD_LIMIT_CHARS = 400_000;

export const MAX_IMAGE_FILE_BYTES = 10 * 1024 * 1024;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('read'));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('decode'));
    image.src = src;
  });

const renderToCanvas = (image, maxDimension) => {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('canvas');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, width, height);
  return canvas;
};

const encode = (canvas, quality) => {
  const webp = canvas.toDataURL('image/webp', quality);
  if (webp.startsWith('data:image/webp')) return webp;
  return canvas.toDataURL('image/jpeg', quality);
};

/**
 * Reads an image picked from the device and returns a compressed data URL
 * that is small enough to live inside the store's localStorage data.
 */
export async function fileToOptimizedDataUrl(file) {
  if (!file || !file.type?.startsWith('image/')) throw new Error('type');
  if (file.size > MAX_IMAGE_FILE_BYTES) throw new Error('size');

  const raw = await readFileAsDataUrl(file);

  if (file.type === 'image/svg+xml') {
    if (raw.length > 250_000) throw new Error('large');
    return raw;
  }

  const image = await loadImage(raw);
  let maxDimension = MAX_DIMENSION;
  let quality = 0.78;
  let dataUrl = encode(renderToCanvas(image, maxDimension), quality);

  while (
    dataUrl.length > MAX_OUTPUT_CHARS &&
    (maxDimension > 420 || quality > 0.5)
  ) {
    maxDimension = Math.max(420, Math.round(maxDimension * 0.82));
    quality = Math.max(0.5, quality - 0.1);
    dataUrl = encode(renderToCanvas(image, maxDimension), quality);
  }

  if (dataUrl.length > HARD_LIMIT_CHARS) throw new Error('large');
  return dataUrl;
}
