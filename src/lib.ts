import { basename, dirname, extname } from "@std/path";
import sharp from "sharp";

/**
 * Rational angles for tiling - these are angles where tan(θ) = m/n for small integers m, n
 * These angles produce periodic tilings when used for rotation.
 */
export const RATIONAL_ANGLES = [
  { degrees: 0, m: 0, n: 1, label: "0°" },
  { degrees: 90, m: 1, n: 0, label: "90°" },
  { degrees: -90, m: -1, n: 0, label: "-90°" },
  { degrees: 45, m: 1, n: 1, label: "45°" },
  { degrees: -45, m: -1, n: 1, label: "-45°" },
  { degrees: 26.565, m: 1, n: 2, label: "26.565° (arctan 1/2)" },
  { degrees: -26.565, m: -1, n: 2, label: "-26.565° (arctan -1/2)" },
  { degrees: 63.435, m: 2, n: 1, label: "63.435° (arctan 2)" },
  { degrees: -63.435, m: -2, n: 1, label: "-63.435° (arctan -2)" },
  { degrees: 18.435, m: 1, n: 3, label: "18.435° (arctan 1/3)" },
  { degrees: -18.435, m: -1, n: 3, label: "-18.435° (arctan -1/3)" },
  { degrees: 71.565, m: 3, n: 1, label: "71.565° (arctan 3)" },
  { degrees: -71.565, m: -3, n: 1, label: "-71.565° (arctan -3)" },
  { degrees: 14.036, m: 1, n: 4, label: "14.036° (arctan 1/4)" },
  { degrees: -14.036, m: -1, n: 4, label: "-14.036° (arctan -1/4)" },
  { degrees: 75.964, m: 4, n: 1, label: "75.964° (arctan 4)" },
  { degrees: -75.964, m: -4, n: 1, label: "-75.964° (arctan -4)" },
  { degrees: 33.69, m: 2, n: 3, label: "33.690° (arctan 2/3)" },
  { degrees: -33.69, m: -2, n: 3, label: "-33.690° (arctan -2/3)" },
  { degrees: 56.31, m: 3, n: 2, label: "56.310° (arctan 3/2)" },
  { degrees: -56.31, m: -3, n: 2, label: "-56.310° (arctan -3/2)" },
  { degrees: 36.87, m: 3, n: 4, label: "36.870° (arctan 3/4)" },
  { degrees: -36.87, m: -3, n: 4, label: "-36.870° (arctan -3/4)" },
  { degrees: 53.13, m: 4, n: 3, label: "53.130° (arctan 4/3)" },
  { degrees: -53.13, m: -4, n: 3, label: "-53.130° (arctan -4/3)" },
  { degrees: 11.31, m: 1, n: 5, label: "11.310° (arctan 1/5)" },
  { degrees: -11.31, m: -1, n: 5, label: "-11.310° (arctan -1/5)" },
  { degrees: 78.69, m: 5, n: 1, label: "78.690° (arctan 5)" },
  { degrees: -78.69, m: -5, n: 1, label: "-78.690° (arctan -5)" },
];

/**
 * Find the closest rational angle to the given angle
 */
export function findClosestRationalAngle(angle: number) {
  // Normalize angle to 0-90 range for matching
  let normalizedAngle = angle % 360;
  if (normalizedAngle < 0) normalizedAngle += 360;

  let closest = RATIONAL_ANGLES[0];
  let minDiff = Math.abs(normalizedAngle - closest.degrees);

  for (const ra of RATIONAL_ANGLES) {
    const diff = Math.abs(normalizedAngle - ra.degrees);
    if (diff < minDiff) {
      minDiff = diff;
      closest = ra;
    }
  }

  return closest;
}

/**
 * Greatest Common Divisor using Euclidean algorithm
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Least Common Multiple
 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Calculate tile dimensions for a given angle
 *
 * For a rational angle with tan(θ) = m/n, when we rotate a tiling pattern,
 * the rotated pattern repeats at intervals of sqrt(m² + n²) times the original period.
 *
 * To create a seamlessly tileable output:
 * - The output dimensions must be the input dimensions × sqrt(m² + n²) / gcd(m,n)
 * - This ensures the rotated grid aligns back to integer positions
 */
export function calculateTileDimensions(
  imageWidth: number,
  imageHeight: number,
  rationalAngle: { m: number; n: number },
) {
  const { m, n } = rationalAngle;

  // Use absolute values for dimension calculations (direction doesn't affect size)
  const absM = Math.abs(m);
  const absN = Math.abs(n);

  // Handle special cases
  if (absM === 0 && absN === 1) {
    // 0 degrees - original dimensions work
    return { width: imageWidth, height: imageHeight };
  }

  if (absM === 1 && absN === 0) {
    // ±90 degrees - swap dimensions
    return { width: imageHeight, height: imageWidth };
  }

  // For arctan(m/n), the period of the rotated pattern is sqrt(m² + n²) times
  // the original tile size. We divide by gcd to get the minimal period.
  const g = gcd(absM, absN) || 1;
  const mReduced = absM / g;
  const nReduced = absN / g;

  // The hypotenuse of the reduced triangle gives us the scale factor
  const hypotenuse = Math.hypot(mReduced, nReduced);

  // Output dimensions: scale input by hypot and round to ensure
  // we have integer pixels that maintain the tiling period
  return {
    width: Math.round(imageWidth * hypotenuse),
    height: Math.round(imageHeight * hypotenuse),
  };
}

/**
 * Validate tile dimensions
 */
export function validateDimensions({
  width,
  height,
  validWidth = 2000,
  validHeight = validWidth,
}: {
  width: number;
  height: number;
  validWidth?: number;
  validHeight?: number;
}): string[] {
  const errors = [];

  if (width === 0 || height === 0) {
    errors.push("Tile dimensions cannot be zero");
  }

  if (!isFinite(width) || !isFinite(height)) {
    errors.push("Tile dimensions resulted in infinity");
  }

  if (width > validWidth) {
    errors.push(`Tile width (${width}px) exceeds maximum of ${validWidth}px`);
  }

  if (height > validHeight) {
    errors.push(
      `Tile height (${height}px) exceeds maximum of ${validHeight}px`,
    );
  }

  return errors;
}

interface ImageProperties {
  width: number;
  height: number;
  format: string;
}

// Get image properties using ImageMagick
export async function getImageProperties(
  imagePath: string,
): Promise<ImageProperties> {
  const data: Uint8Array = await Deno.readFile(imagePath);

  const properties = {
    width: 0,
    height: 0,
    format: "",
  };

  const metadata = await sharp(data).metadata();

  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
  };
}

// Get the output path.
export function getOutputPath({
  input,
  rationalAngle,
  output,
}: {
  input: string;
  rationalAngle: { degrees: number };
  output?: string;
}) {
  const inputExt = extname(input as string);
  const inputBase = basename(input as string, inputExt);
  const inputDir = dirname(input as string);
  const outputFileName = `${inputBase}-tile-${rationalAngle.degrees}${inputExt}`;
  return output ? (output as string) : `${inputDir}/${outputFileName}`;
}

// Generate the output image
export async function generateTile({
  input,
  output,
  metadata,
  tileWidth,
  tileHeight,
  angle,
  limitInputPixels = true,
  quality = 90,
  tileMargin = 1,
  verbose = false,
}: {
  input: string;
  output: string;
  metadata: ImageProperties;
  tileWidth: number;
  tileHeight: number;
  angle: number;
  limitInputPixels?: boolean;
  quality?: number;
  tileMargin?: number;
  verbose?: boolean;
}) {
  // Calculate the diagonal of the output tile to ensure full coverage during rotation
  const diagonal = Math.ceil(Math.hypot(tileWidth, tileHeight));

  // Calculate how many times the tile needs to be repeated in each direction to cover the diagonal
  // Pad with some extra tiles to ensure coverage after rotation
  const tileRepeat = {
    x: Math.ceil((diagonal * 2) / metadata.width) + tileMargin,
    y: Math.ceil((diagonal * 2) / metadata.height) + tileMargin,
  };

  // The dimensions of the tiled canvas
  const tiledDimensions = {
    x: metadata.width * tileRepeat.x,
    y: metadata.height * tileRepeat.y,
  };

  if (verbose)
    console.log(
      "Tiled dimensions and repeat counts:",
      tiledDimensions,
      tileRepeat,
    );

  const image = sharp(input);
  const srcBuffer = await image.png().toBuffer();

  // Build the composite operations to tile the image
  const compositeOps = [];
  for (let y = 0; y < tileRepeat.y; y++) {
    for (let x = 0; x < tileRepeat.x; x++) {
      compositeOps.push({
        input: srcBuffer,
        left: x * metadata.width,
        top: y * metadata.height,
      });
    }
  }

  // Create the tiled canvas - this is the canvas that covers the whole area and can be very large
  // Compose the operations, and output a png buffer
  const tiledCanvas = await sharp({
    limitInputPixels,
    create: {
      width: tiledDimensions.x,
      height: tiledDimensions.y,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(compositeOps)
    .png()
    .toBuffer();

  // Rotate the canvas, this will inevitably result in a larger image still and may cause mem issues?
  // This requires the tile canvas buffer because Sharp does not apply rotations in-place
  const rotatedCanvas = await sharp(tiledCanvas, { limitInputPixels }).rotate(
    angle,
  );

  const rotatedMetadata = await rotatedCanvas.metadata();

  // Generate the bounds for the cropped image
  const B = {
    left: Math.max(0, Math.floor(rotatedMetadata.width / 2 - tileWidth / 2)),
    top: Math.max(0, Math.floor(rotatedMetadata.height / 2 - tileHeight / 2)),
    width: tileWidth,
    height: tileHeight,
  };
  B.width = Math.min(B.width, rotatedMetadata.width - B.left);
  B.height = Math.min(B.height, rotatedMetadata.height - B.top);

  await rotatedCanvas.extract(B).png({ quality: quality }).toFile(output);
}
