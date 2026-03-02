import { assertEquals, assertThrows } from "jsr:@std/assert";
import {
  findClosestRationalAngle,
  gcd,
  lcm,
  calculateTileDimensions,
  validateDimensions,
  getOutputPath,
  RATIONAL_ANGLES,
} from "./lib.ts";

// Test findClosestRationalAngle
Deno.test("findClosestRationalAngle - finds exact match for 45 degrees", () => {
  const result = findClosestRationalAngle(45);
  assertEquals(result.degrees, 45);
  assertEquals(result.m, 1);
  assertEquals(result.n, 1);
  assertEquals(result.label, "45°");
});

Deno.test("findClosestRationalAngle - finds closest angle for 44 degrees", () => {
  const result = findClosestRationalAngle(44);
  assertEquals(result.degrees, 45);
  assertEquals(result.m, 1);
  assertEquals(result.n, 1);
});

Deno.test("findClosestRationalAngle - finds closest angle for 46 degrees", () => {
  const result = findClosestRationalAngle(46);
  assertEquals(result.degrees, 45);
  assertEquals(result.m, 1);
  assertEquals(result.n, 1);
});

Deno.test("findClosestRationalAngle - finds exact match for 0 degrees", () => {
  const result = findClosestRationalAngle(0);
  assertEquals(result.degrees, 0);
  assertEquals(result.m, 0);
  assertEquals(result.n, 1);
});

Deno.test("findClosestRationalAngle - finds exact match for 90 degrees", () => {
  const result = findClosestRationalAngle(90);
  assertEquals(result.degrees, 90);
  assertEquals(result.m, 1);
  assertEquals(result.n, 0);
});

Deno.test("findClosestRationalAngle - normalizes negative angles", () => {
  const result = findClosestRationalAngle(-45);
  assertEquals(result.degrees, -45);
  assertEquals(result.m, -1);
  assertEquals(result.n, 1);
});

Deno.test("findClosestRationalAngle - normalizes angles > 360", () => {
  const result = findClosestRationalAngle(405); // 405 - 360 = 45
  assertEquals(result.degrees, 45);
  assertEquals(result.m, 1);
  assertEquals(result.n, 1);
});

// Test gcd function
Deno.test("gcd - calculates GCD of 12 and 8", () => {
  const result = gcd(12, 8);
  assertEquals(result, 4);
});

Deno.test("gcd - calculates GCD of 100 and 50", () => {
  const result = gcd(100, 50);
  assertEquals(result, 50);
});

Deno.test("gcd - calculates GCD of coprime numbers", () => {
  const result = gcd(17, 19);
  assertEquals(result, 1);
});

Deno.test("gcd - handles zero", () => {
  const result = gcd(0, 5);
  assertEquals(result, 5);
});

Deno.test("gcd - handles both zeros", () => {
  const result = gcd(0, 0);
  assertEquals(result, 0);
});

Deno.test("gcd - handles negative numbers", () => {
  const result = gcd(-12, 8);
  assertEquals(result, 4);
});

Deno.test("gcd - handles both negative numbers", () => {
  const result = gcd(-12, -8);
  assertEquals(result, 4);
});

// Test lcm function
Deno.test("lcm - calculates LCM of 12 and 8", () => {
  const result = lcm(12, 8);
  assertEquals(result, 24);
});

Deno.test("lcm - calculates LCM of 4 and 6", () => {
  const result = lcm(4, 6);
  assertEquals(result, 12);
});

Deno.test("lcm - handles zero", () => {
  const result = lcm(0, 5);
  assertEquals(result, 0);
});

Deno.test("lcm - handles coprime numbers", () => {
  const result = lcm(7, 13);
  assertEquals(result, 91);
});

Deno.test("lcm - handles negative numbers", () => {
  const result = lcm(-12, 8);
  assertEquals(result, 24);
});

// Test calculateTileDimensions
Deno.test("calculateTileDimensions - 0 degrees returns original dimensions", () => {
  const result = calculateTileDimensions(100, 100, { m: 0, n: 1 });
  assertEquals(result.width, 100);
  assertEquals(result.height, 100);
});

Deno.test("calculateTileDimensions - 90 degrees swaps dimensions", () => {
  const result = calculateTileDimensions(100, 200, { m: 1, n: 0 });
  assertEquals(result.width, 200);
  assertEquals(result.height, 100);
});

Deno.test("calculateTileDimensions - 45 degrees on square image", () => {
  const result = calculateTileDimensions(100, 100, { m: 1, n: 1 });
  // For 45 degrees with square input, output should be larger
  assertEquals(result.width > 0, true);
  assertEquals(result.height > 0, true);
});

Deno.test("calculateTileDimensions - handles 26.565 degrees (1:2 ratio)", () => {
  const result = calculateTileDimensions(100, 200, { m: 1, n: 2 });
  assertEquals(result.width > 0, true);
  assertEquals(result.height > 0, true);
});

Deno.test("calculateTileDimensions - negative m produces same dimensions as positive m", () => {
  const result = calculateTileDimensions(100, 100, { m: -1, n: 1 });
  // Negative m should give same dimensions as positive (absolute value used)
  const positive = calculateTileDimensions(100, 100, { m: 1, n: 1 });
  assertEquals(result.width, positive.width);
  assertEquals(result.height, positive.height);
});

// Test validateDimensions
Deno.test("validateDimensions - accepts valid dimensions", () => {
  const errors = validateDimensions({
    width: 500,
    height: 500,
    validWidth: 2000,
  });
  assertEquals(errors.length, 0);
});

Deno.test("validateDimensions - rejects width exceeding limit", () => {
  const errors = validateDimensions({
    width: 3000,
    height: 500,
    validWidth: 2000,
  });
  assertEquals(errors.length, 1);
  assertEquals(errors[0].includes("width"), true);
  assertEquals(errors[0].includes("3000"), true);
});

Deno.test("validateDimensions - rejects height exceeding limit", () => {
  const errors = validateDimensions({
    width: 500,
    height: 3000,
    validWidth: 2000,
    validHeight: 2000,
  });
  assertEquals(errors.length, 1);
  assertEquals(errors[0].includes("height"), true);
  assertEquals(errors[0].includes("3000"), true);
});

Deno.test("validateDimensions - rejects zero width", () => {
  const errors = validateDimensions({
    width: 0,
    height: 500,
    validWidth: 2000,
  });
  assertEquals(errors.length, 1);
  assertEquals(errors[0].includes("zero"), true);
});

Deno.test("validateDimensions - rejects zero height", () => {
  const errors = validateDimensions({
    width: 500,
    height: 0,
    validWidth: 2000,
  });
  assertEquals(errors.length, 1);
  assertEquals(errors[0].includes("zero"), true);
});

Deno.test("validateDimensions - rejects infinite width", () => {
  const errors = validateDimensions({
    width: Infinity,
    height: 500,
    validWidth: 2000,
  });
  assertEquals(errors.length, 1);
  assertEquals(errors[0].includes("infinity"), true);
});

Deno.test("validateDimensions - rejects infinite height", () => {
  const errors = validateDimensions({
    width: 500,
    height: Infinity,
    validWidth: 2000,
  });
  assertEquals(errors.length, 1);
  assertEquals(errors[0].includes("infinity"), true);
});

Deno.test("validateDimensions - reports multiple errors", () => {
  const errors = validateDimensions({
    width: 3000,
    height: 4000,
    validWidth: 2000,
    validHeight: 2000,
  });
  assertEquals(errors.length, 2);
});

// Test getOutputPath
Deno.test("getOutputPath - generates default output path", () => {
  const result = getOutputPath({
    input: "/path/to/image.png",
    rationalAngle: { degrees: 45 },
  });
  assertEquals(result, "/path/to/image-tile-45.png");
});

Deno.test("getOutputPath - handles custom output path", () => {
  const result = getOutputPath({
    input: "/path/to/image.png",
    rationalAngle: { degrees: 45 },
    output: "/custom/output.png",
  });
  assertEquals(result, "/custom/output.png");
});

Deno.test("getOutputPath - handles different extensions", () => {
  const result = getOutputPath({
    input: "/path/to/image.jpg",
    rationalAngle: { degrees: 26.565 },
  });
  assertEquals(result, "/path/to/image-tile-26.565.jpg");
});

Deno.test("getOutputPath - handles files in current directory", () => {
  const result = getOutputPath({
    input: "image.png",
    rationalAngle: { degrees: 90 },
  });
  assertEquals(result, "./image-tile-90.png");
});

Deno.test("getOutputPath - handles negative angles with double dash", () => {
  const result = getOutputPath({
    input: "/path/to/image.png",
    rationalAngle: { degrees: -45 },
  });
  // Note: negative angles result in double dash in filename (e.g., -tile--45)
  assertEquals(result, "/path/to/image-tile--45.png");
});

// Test RATIONAL_ANGLES constant
Deno.test("RATIONAL_ANGLES - contains expected number of angles", () => {
  assertEquals(RATIONAL_ANGLES.length, 29);
});

Deno.test("RATIONAL_ANGLES - first angle is 0 degrees", () => {
  assertEquals(RATIONAL_ANGLES[0].degrees, 0);
  assertEquals(RATIONAL_ANGLES[0].m, 0);
  assertEquals(RATIONAL_ANGLES[0].n, 1);
});

Deno.test("RATIONAL_ANGLES - contains 45 degree angle", () => {
  const angle45 = RATIONAL_ANGLES.find((a) => a.degrees === 45);
  assertEquals(angle45?.m, 1);
  assertEquals(angle45?.n, 1);
});

Deno.test("RATIONAL_ANGLES - contains 90 degree angle", () => {
  const angle90 = RATIONAL_ANGLES.find((a) => a.degrees === 90);
  assertEquals(angle90?.m, 1);
  assertEquals(angle90?.n, 0);
});

Deno.test("RATIONAL_ANGLES - all angles have required properties", () => {
  RATIONAL_ANGLES.forEach((angle) => {
    assertEquals(typeof angle.degrees, "number");
    assertEquals(typeof angle.m, "number");
    assertEquals(typeof angle.n, "number");
    assertEquals(typeof angle.label, "string");
  });
});
