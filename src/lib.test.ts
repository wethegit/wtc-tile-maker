import { assert, assertEquals, assertRejects } from "@std/assert";
import { getImageProperties } from "./lib.ts";

Deno.test("getImageProperties - should return correct properties for valid PNG image", async () => {
  const imagePath = "test.png";
  const properties = await getImageProperties(imagePath);

  assertEquals(properties.width, 512);
  assertEquals(properties.height, 512);
  assertEquals(properties.format, "png");
});

Deno.test("getImageProperties - should throw error for non-existent file", async () => {
  const imagePath = "non-existent-file.png";
  
  await assertRejects(
    async () => {
      await getImageProperties(imagePath);
    },
    Deno.errors.NotFound,
  );
});

Deno.test("getImageProperties - should return correct properties for 3x2 checker image", async () => {
  const imagePath = "3x2-checker.png";
  const properties = await getImageProperties(imagePath);

  // Verify we get valid properties
  assertEquals(typeof properties.width, "number");
  assertEquals(typeof properties.height, "number");
  assertEquals(properties.format, "png");
  
  // Verify it has correct aspect ratio (3:2)
  const aspectRatio = properties.width / properties.height;
  assertEquals(aspectRatio, 1.5);
});

Deno.test("getImageProperties - should return properties with valid types", async () => {
  const imagePath = "test.png";
  const properties = await getImageProperties(imagePath);

  // Verify property types
  assertEquals(typeof properties.width, "number");
  assertEquals(typeof properties.height, "number");
  assertEquals(typeof properties.format, "string");
  
  // Verify positive dimensions
  assert(properties.width > 0);
  assert(properties.height > 0);
});
