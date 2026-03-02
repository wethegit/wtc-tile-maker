import { assertEquals, assertRejects } from "jsr:@std/assert";
import { existsSync } from "@std/fs/exists";
import { generate, GenerateOptions } from "./main.ts";

// Create a temporary test image for testing
async function createTestImage(path: string) {
  // Create a simple 100x100 PNG for testing
  const sharp = (await import("sharp")).default;
  await sharp({
    create: {
      width: 100,
      height: 100,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 1 },
    },
  })
    .png()
    .toFile(path);
}

// Clean up test files
async function cleanupTestFiles(paths: string[]) {
  for (const path of paths) {
    try {
      if (existsSync(path)) {
        await Deno.remove(path);
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}

Deno.test("generate - successful generation with default angleOption", async () => {
  const testInput = "/tmp/test-input-default.png";
  const expectedOutput = "/tmp/test-input-default-tile-0.png";

  try {
    // Create test input image
    await createTestImage(testInput);

    // Generate tile with default options
    await generate({
      input: testInput,
      angleOption: 0,
      maxValidSize: 2000,
    } as GenerateOptions);

    // Verify output file was created
    assertEquals(existsSync(expectedOutput), true);
  } finally {
    await cleanupTestFiles([testInput, expectedOutput]);
  }
});

Deno.test("generate - successful generation with degrees parameter", async () => {
  const testInput = "/tmp/test-input-degrees.png";
  const expectedOutput = "/tmp/test-input-degrees-tile-45.png";

  try {
    // Create test input image
    await createTestImage(testInput);

    // Generate tile with degrees parameter
    await generate({
      input: testInput,
      degrees: 45,
      maxValidSize: 2000,
    } as GenerateOptions);

    // Verify output file was created
    assertEquals(existsSync(expectedOutput), true);
  } finally {
    await cleanupTestFiles([testInput, expectedOutput]);
  }
});

Deno.test("generate - error when input file is missing", async () => {
  await assertRejects(
    async () => {
      await generate({
        maxValidSize: 2000,
      } as GenerateOptions);
    },
    Error,
    "Input file is required for generation.",
  );
});

Deno.test("generate - error when input file doesn't exist", async () => {
  await assertRejects(
    async () => {
      await generate({
        input: "/tmp/nonexistent-file.png",
        maxValidSize: 2000,
      } as GenerateOptions);
    },
    Error,
    "Input file not found:",
  );
});

Deno.test("generate - error when angleOption is out of range (negative)", async () => {
  const testInput = "/tmp/test-input-negative-angle.png";

  try {
    await createTestImage(testInput);

    await assertRejects(
      async () => {
        await generate({
          input: testInput,
          angleOption: -1,
          maxValidSize: 2000,
        } as GenerateOptions);
      },
      Error,
      "Invalid angle index",
    );
  } finally {
    await cleanupTestFiles([testInput]);
  }
});

Deno.test("generate - error when angleOption is out of range (too large)", async () => {
  const testInput = "/tmp/test-input-large-angle.png";

  try {
    await createTestImage(testInput);

    await assertRejects(
      async () => {
        await generate({
          input: testInput,
          angleOption: 999,
          maxValidSize: 2000,
        } as GenerateOptions);
      },
      Error,
      "Invalid angle index",
    );
  } finally {
    await cleanupTestFiles([testInput]);
  }
});

Deno.test("generate - error when dimensions exceed maxValidSize", async () => {
  const testInput = "/tmp/test-input-exceed-size.png";

  try {
    // Create a larger test image
    const sharp = (await import("sharp")).default;
    await sharp({
      create: {
        width: 500,
        height: 500,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 },
      },
    })
      .png()
      .toFile(testInput);

    await assertRejects(
      async () => {
        await generate({
          input: testInput,
          angleOption: 7, // 63.435° - will produce larger dimensions
          maxValidSize: 100, // Very small max size to trigger error
        } as GenerateOptions);
      },
      Error,
      "exceed maximum valid size",
    );
  } finally {
    await cleanupTestFiles([testInput]);
  }
});

Deno.test("generate - successful generation with custom output path", async () => {
  const testInput = "/tmp/test-input-custom-output.png";
  const customOutput = "/tmp/custom-output-name.png";

  try {
    // Create test input image
    await createTestImage(testInput);

    // Generate tile with custom output path
    await generate({
      input: testInput,
      angleOption: 3, // 45 degrees
      output: customOutput,
      maxValidSize: 2000,
    } as GenerateOptions);

    // Verify custom output file was created
    assertEquals(existsSync(customOutput), true);
  } finally {
    await cleanupTestFiles([testInput, customOutput]);
  }
});

Deno.test("generate - generation with specific angle options", async () => {
  const testInput = "/tmp/test-input-angle-option.png";
  const expectedOutput = "/tmp/test-input-angle-option-tile-26.565.png";

  try {
    // Create test input image
    await createTestImage(testInput);

    // Generate tile with angle option 5 (26.565°)
    await generate({
      input: testInput,
      angleOption: 5,
      maxValidSize: 2000,
    } as GenerateOptions);

    // Verify output file was created
    assertEquals(existsSync(expectedOutput), true);
  } finally {
    await cleanupTestFiles([testInput, expectedOutput]);
  }
});
