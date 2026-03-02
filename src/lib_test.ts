import { assertEquals } from "jsr:@std/assert";
import { getOutputPath } from "./lib.ts";

Deno.test("getOutputPath - default output without custom path", () => {
  const result = getOutputPath({
    input: "Checker.png",
    rationalAngle: { degrees: 45 },
  });
  assertEquals(result, "./Checker-tile-45.png");
});

Deno.test("getOutputPath - with full path", () => {
  const result = getOutputPath({
    input: "/path/to/Checker.png",
    rationalAngle: { degrees: 45 },
  });
  assertEquals(result, "/path/to/Checker-tile-45.png");
});

Deno.test("getOutputPath - with relative path", () => {
  const result = getOutputPath({
    input: "./images/test.jpg",
    rationalAngle: { degrees: 90 },
  });
  assertEquals(result, "./images/test-tile-90.jpg");
});

Deno.test("getOutputPath - with custom output path", () => {
  const result = getOutputPath({
    input: "Checker.png",
    rationalAngle: { degrees: 45 },
    output: "custom-output.png",
  });
  assertEquals(result, "custom-output.png");
});

Deno.test("getOutputPath - with negative degrees", () => {
  const result = getOutputPath({
    input: "test.png",
    rationalAngle: { degrees: -45 },
  });
  assertEquals(result, "./test-tile--45.png");
});

Deno.test("getOutputPath - with decimal degrees", () => {
  const result = getOutputPath({
    input: "/home/user/image.png",
    rationalAngle: { degrees: 26.565 },
  });
  assertEquals(result, "/home/user/image-tile-26.565.png");
});

Deno.test("getOutputPath - with different file extension", () => {
  const result = getOutputPath({
    input: "photo.jpeg",
    rationalAngle: { degrees: 90 },
  });
  assertEquals(result, "./photo-tile-90.jpeg");
});

Deno.test("getOutputPath - zero degrees", () => {
  const result = getOutputPath({
    input: "./assets/background.png",
    rationalAngle: { degrees: 0 },
  });
  assertEquals(result, "./assets/background-tile-0.png");
});

Deno.test("getOutputPath - preserves directory structure", () => {
  const result = getOutputPath({
    input: "../../parent/child/file.png",
    rationalAngle: { degrees: 45 },
  });
  assertEquals(result, "../../parent/child/file-tile-45.png");
});

Deno.test("getOutputPath - custom output ignores input path structure", () => {
  const result = getOutputPath({
    input: "/some/long/path/to/image.png",
    rationalAngle: { degrees: 63.435 },
    output: "./output.png",
  });
  assertEquals(result, "./output.png");
});
