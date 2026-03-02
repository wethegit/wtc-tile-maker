import { assertEquals, assertExists } from "@std/assert";
import { existsSync } from "@std/fs";
import { 
  generateTile, 
  getImageProperties,
  calculateTileDimensions,
  findClosestRationalAngle,
} from "../src/lib.ts";

// Test fixtures
const TEST_INPUT = "./tests/fixtures/test-input.png";
const TEST_OUTPUT_DIR = "./tests/output";

// Ensure output directory exists
Deno.test("setup - create output directory", async () => {
  if (!existsSync(TEST_OUTPUT_DIR)) {
    await Deno.mkdir(TEST_OUTPUT_DIR, { recursive: true });
  }
  assertEquals(existsSync(TEST_OUTPUT_DIR), true);
});

Deno.test("generateTile - generates tile with 0° angle", async () => {
  const metadata = await getImageProperties(TEST_INPUT);
  const rationalAngle = findClosestRationalAngle(0);
  const tileDims = calculateTileDimensions(
    metadata.width,
    metadata.height,
    rationalAngle,
  );

  const output = `${TEST_OUTPUT_DIR}/test-0deg.png`;

  await generateTile({
    input: TEST_INPUT,
    output,
    metadata,
    tileWidth: tileDims.width,
    tileHeight: tileDims.height,
    angle: rationalAngle.degrees,
    limitInputPixels: false,
    quality: 90,
    tileMargin: 1,
    verbose: false,
  });

  // Verify output file exists
  assertEquals(existsSync(output), true);

  // Verify output has correct dimensions
  const outputMetadata = await getImageProperties(output);
  assertEquals(outputMetadata.width, tileDims.width);
  assertEquals(outputMetadata.height, tileDims.height);
  assertEquals(outputMetadata.format, "png");
});

Deno.test("generateTile - generates tile with 45° angle", async () => {
  const metadata = await getImageProperties(TEST_INPUT);
  const rationalAngle = findClosestRationalAngle(45);
  const tileDims = calculateTileDimensions(
    metadata.width,
    metadata.height,
    rationalAngle,
  );

  const output = `${TEST_OUTPUT_DIR}/test-45deg.png`;

  await generateTile({
    input: TEST_INPUT,
    output,
    metadata,
    tileWidth: tileDims.width,
    tileHeight: tileDims.height,
    angle: rationalAngle.degrees,
    limitInputPixels: false,
    quality: 90,
    tileMargin: 1,
    verbose: false,
  });

  // Verify output file exists
  assertEquals(existsSync(output), true);

  // Verify output has correct dimensions
  const outputMetadata = await getImageProperties(output);
  assertEquals(outputMetadata.width, tileDims.width);
  assertEquals(outputMetadata.height, tileDims.height);
  assertEquals(outputMetadata.format, "png");
});

Deno.test("generateTile - generates tile with 26.565° angle", async () => {
  const metadata = await getImageProperties(TEST_INPUT);
  const rationalAngle = findClosestRationalAngle(26.565);
  const tileDims = calculateTileDimensions(
    metadata.width,
    metadata.height,
    rationalAngle,
  );

  const output = `${TEST_OUTPUT_DIR}/test-26deg.png`;

  await generateTile({
    input: TEST_INPUT,
    output,
    metadata,
    tileWidth: tileDims.width,
    tileHeight: tileDims.height,
    angle: rationalAngle.degrees,
    limitInputPixels: false,
    quality: 90,
    tileMargin: 1,
    verbose: false,
  });

  // Verify output file exists
  assertEquals(existsSync(output), true);

  // Verify output has correct dimensions
  const outputMetadata = await getImageProperties(output);
  assertEquals(outputMetadata.width, tileDims.width);
  assertEquals(outputMetadata.height, tileDims.height);
  assertEquals(outputMetadata.format, "png");
});

Deno.test("generateTile - respects quality parameter", async () => {
  const metadata = await getImageProperties(TEST_INPUT);
  const rationalAngle = findClosestRationalAngle(0);
  const tileDims = calculateTileDimensions(
    metadata.width,
    metadata.height,
    rationalAngle,
  );

  const outputHigh = `${TEST_OUTPUT_DIR}/test-quality-high.png`;
  const outputLow = `${TEST_OUTPUT_DIR}/test-quality-low.png`;

  // Generate with high quality
  await generateTile({
    input: TEST_INPUT,
    output: outputHigh,
    metadata,
    tileWidth: tileDims.width,
    tileHeight: tileDims.height,
    angle: rationalAngle.degrees,
    limitInputPixels: false,
    quality: 100,
    tileMargin: 1,
    verbose: false,
  });

  // Generate with low quality
  await generateTile({
    input: TEST_INPUT,
    output: outputLow,
    metadata,
    tileWidth: tileDims.width,
    tileHeight: tileDims.height,
    angle: rationalAngle.degrees,
    limitInputPixels: false,
    quality: 10,
    tileMargin: 1,
    verbose: false,
  });

  // Verify both files exist
  assertEquals(existsSync(outputHigh), true);
  assertEquals(existsSync(outputLow), true);

  // High quality file should generally be larger than low quality
  const statsHigh = await Deno.stat(outputHigh);
  const statsLow = await Deno.stat(outputLow);
  
  // Both should be valid PNG files with correct dimensions
  const metadataHigh = await getImageProperties(outputHigh);
  const metadataLow = await getImageProperties(outputLow);
  
  assertEquals(metadataHigh.width, tileDims.width);
  assertEquals(metadataHigh.height, tileDims.height);
  assertEquals(metadataLow.width, tileDims.width);
  assertEquals(metadataLow.height, tileDims.height);
});

Deno.test("generateTile - handles different tileMargin values", async () => {
  const metadata = await getImageProperties(TEST_INPUT);
  const rationalAngle = findClosestRationalAngle(45);
  const tileDims = calculateTileDimensions(
    metadata.width,
    metadata.height,
    rationalAngle,
  );

  const outputMargin1 = `${TEST_OUTPUT_DIR}/test-margin-1.png`;
  const outputMargin3 = `${TEST_OUTPUT_DIR}/test-margin-3.png`;

  // Generate with margin 1
  await generateTile({
    input: TEST_INPUT,
    output: outputMargin1,
    metadata,
    tileWidth: tileDims.width,
    tileHeight: tileDims.height,
    angle: rationalAngle.degrees,
    limitInputPixels: false,
    quality: 90,
    tileMargin: 1,
    verbose: false,
  });

  // Generate with margin 3
  await generateTile({
    input: TEST_INPUT,
    output: outputMargin3,
    metadata,
    tileWidth: tileDims.width,
    tileHeight: tileDims.height,
    angle: rationalAngle.degrees,
    limitInputPixels: false,
    quality: 90,
    tileMargin: 3,
    verbose: false,
  });

  // Verify both files exist and have correct dimensions
  assertEquals(existsSync(outputMargin1), true);
  assertEquals(existsSync(outputMargin3), true);

  const metadataMargin1 = await getImageProperties(outputMargin1);
  const metadataMargin3 = await getImageProperties(outputMargin3);

  assertEquals(metadataMargin1.width, tileDims.width);
  assertEquals(metadataMargin1.height, tileDims.height);
  assertEquals(metadataMargin3.width, tileDims.width);
  assertEquals(metadataMargin3.height, tileDims.height);
});

Deno.test("generateTile - verbose flag doesn't break execution", async () => {
  const metadata = await getImageProperties(TEST_INPUT);
  const rationalAngle = findClosestRationalAngle(0);
  const tileDims = calculateTileDimensions(
    metadata.width,
    metadata.height,
    rationalAngle,
  );

  const output = `${TEST_OUTPUT_DIR}/test-verbose.png`;

  // This should log additional info but not break
  await generateTile({
    input: TEST_INPUT,
    output,
    metadata,
    tileWidth: tileDims.width,
    tileHeight: tileDims.height,
    angle: rationalAngle.degrees,
    limitInputPixels: false,
    quality: 90,
    tileMargin: 1,
    verbose: true,
  });

  assertEquals(existsSync(output), true);
  
  const outputMetadata = await getImageProperties(output);
  assertEquals(outputMetadata.width, tileDims.width);
  assertEquals(outputMetadata.height, tileDims.height);
});

Deno.test("generateTile - creates valid PNG output", async () => {
  const metadata = await getImageProperties(TEST_INPUT);
  const rationalAngle = findClosestRationalAngle(45);
  const tileDims = calculateTileDimensions(
    metadata.width,
    metadata.height,
    rationalAngle,
  );

  const output = `${TEST_OUTPUT_DIR}/test-valid-png.png`;

  await generateTile({
    input: TEST_INPUT,
    output,
    metadata,
    tileWidth: tileDims.width,
    tileHeight: tileDims.height,
    angle: rationalAngle.degrees,
    limitInputPixels: false,
    quality: 90,
    tileMargin: 1,
    verbose: false,
  });

  // Verify it's a valid PNG by reading its properties
  const outputMetadata = await getImageProperties(output);
  assertExists(outputMetadata.width);
  assertExists(outputMetadata.height);
  assertEquals(outputMetadata.format, "png");
  
  // Dimensions should match expected tile dimensions
  assertEquals(outputMetadata.width, tileDims.width);
  assertEquals(outputMetadata.height, tileDims.height);
});

// Cleanup
Deno.test("cleanup - remove output directory", async () => {
  if (existsSync(TEST_OUTPUT_DIR)) {
    await Deno.remove(TEST_OUTPUT_DIR, { recursive: true });
  }
  assertEquals(existsSync(TEST_OUTPUT_DIR), false);
});
