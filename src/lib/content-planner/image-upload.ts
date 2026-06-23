const MAX_IMAGE_EDGE = 2048;
const WEBP_QUALITY = 0.84;

export type ConvertedImage = {
  file: File;
  originalName: string;
  originalSize: number;
  convertedSize: number;
  width: number;
  height: number;
};

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Cannot read this image file."));
    };
    image.src = url;
  });
}

function canvasToWebp(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("This browser cannot convert the image to WebP."));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      WEBP_QUALITY
    );
  });
}

function webpName(name: string) {
  const base = name.replace(/\.[^.]+$/, "").trim() || "asset";
  return `${base}.webp`;
}

export async function convertImageToWebp(file: File): Promise<ConvertedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload image files only.");
  }

  const image = await loadImage(file);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot prepare image conversion.");

  ctx.drawImage(image, 0, 0, width, height);
  const blob = await canvasToWebp(canvas);
  const converted = new File([blob], webpName(file.name), {
    type: "image/webp",
    lastModified: Date.now(),
  });

  return {
    file: converted,
    originalName: file.name,
    originalSize: file.size,
    convertedSize: converted.size,
    width,
    height,
  };
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
