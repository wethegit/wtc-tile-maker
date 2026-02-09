import { basename, dirname, extname } from "@std/path";
import sharp from "sharp";

export interface angleEntry {
  degrees: number;
  m: number;
  n: number;
  label: string;
}

/**
 * Rational angles for tiling - these are angles where tan(θ) = m/n for small integers m, n
 * These angles produce periodic tilings when used for rotation.
 */
export const RATIONAL_ANGLES: angleEntry[] = [
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
export function findClosestRationalAngle(angle: number): angleEntry {
  // Normalize angle to 0-360 range for matching
  let normalizedAngle = angle % 360;
  if (normalizedAngle < 0) normalizedAngle += 360;

  return RATIONAL_ANGLES.reduce((closest, ra) =>
    Math.abs(normalizedAngle - ra.degrees) <
    Math.abs(normalizedAngle - closest.degrees)
      ? ra
      : closest,
  );
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
 * the rotated lattice must align back to itself for seamless tiling.
 *
 * The rotated tile centers form a lattice with basis vectors:
 *   v1 = (w·n, w·m) / √(m²+n²)
 *   v2 = (-h·m, h·n) / √(m²+n²)
 *
 * For the output rectangle to tile seamlessly, its dimensions must equal
 * the periods of this rotated lattice in x and y directions:
 *   width  = w·h·(m² + n²) / gcd(w·m, h·n)
 *   height = w·h·(m² + n²) / gcd(w·n, h·m)
 *
 * Divided by √(m²+n²) to convert back to pixel coordinates.
 */
export function calculateTileDimensions(
  imageWidth: number,
  imageHeight: number,
  rationalAngle: { m: number; n: number },
) {
  // Use absolute values for dimension calculations (direction doesn't affect size)
  const m = Math.abs(rationalAngle.m);
  const n = Math.abs(rationalAngle.n);

  // special cases
  if (m === 0 && n === 1) return { width: imageWidth, height: imageHeight }; // 0 degrees - original dimensions work
  if (m === 1 && n === 0) return { width: imageHeight, height: imageWidth }; // 90 degrees - swap dimensions

  // Reduce m and n by their GCD to get the minimal angle representation
  const g = gcd(m, n) || 1;
  const mR = m / g;
  const nR = n / g;

  // Calculate the hypotenuse (scaling factor from rotation)
  const hypotSquared = mR * mR + nR * nR;
  const hypot = Math.sqrt(hypotSquared);

  // For a rotated rectangular lattice, the periods in x and y are:
  // Period_x = w·h·(m² + n²) / gcd(w·m, h·n) (in scaled coords)
  // Period_y = w·h·(m² + n²) / gcd(w·n, h·m) (in scaled coords)
  // Divide by hypot to get actual pixel dimensions
  const gcds = {
    x: gcd(imageWidth * mR, imageHeight * nR),
    y: gcd(imageWidth * nR, imageHeight * mR),
  };

  const width = Math.round(
    (imageWidth * imageHeight * hypotSquared) / (gcds.x * hypot),
  );
  const height = Math.round(
    (imageWidth * imageHeight * hypotSquared) / (gcds.y * hypot),
  );

  return { width, height };
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

export interface ImageProperties {
  width: number;
  height: number;
  format: string;
}

// Get image properties using ImageMagick
export async function getImageProperties(
  imagePath: string,
): Promise<ImageProperties> {
  const data: Uint8Array = await Deno.readFile(imagePath);

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

export interface GenerateTileOptions {
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
}: GenerateTileOptions) {
  const diagonal = Math.ceil(Math.hypot(tileWidth, tileHeight));

  const tileRepeat = {
    x: Math.ceil((diagonal * 2) / metadata.width) + tileMargin,
    y: Math.ceil((diagonal * 2) / metadata.height) + tileMargin,
  };

  const tiledDimensions = {
    width: metadata.width * tileRepeat.x,
    height: metadata.height * tileRepeat.y,
  };

  if (verbose)
    console.log(
      "Tiled dimensions and repeat counts:",
      tiledDimensions,
      tileRepeat,
    );

  console.log("Starting tile generation, this may take a moment.");

  // Create the tiled pattern and "bake" it into a raw buffer.
  // Using 'raw' is significantly faster than 'png' or 'jpeg'.
  const { data, info } = await sharp({
    limitInputPixels,
    create: {
      width: tiledDimensions.width,
      height: tiledDimensions.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input,
        tile: true,
      },
    ])
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Rotate the baked raw buffer.
  const rotatedCanvas = sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
    limitInputPixels,
  }).rotate(angle);

  const rotatedMetadata = await rotatedCanvas.metadata();

  // Extract the seamless tile from the center.
  const B = {
    left: Math.max(0, Math.floor(rotatedMetadata.width! / 2 - tileWidth / 2)),
    top: Math.max(0, Math.floor(rotatedMetadata.height! / 2 - tileHeight / 2)),
    width: tileWidth,
    height: tileHeight,
  };

  await rotatedCanvas.extract(B).png({ quality }).toFile(output);
}
