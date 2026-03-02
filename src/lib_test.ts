import { assertEquals } from "jsr:@std/assert";
import { gcd } from "./lib.ts";

Deno.test("gcd - basic calculations", () => {
  assertEquals(gcd(12, 8), 4);
  assertEquals(gcd(54, 24), 6);
  assertEquals(gcd(48, 18), 6);
  assertEquals(gcd(100, 50), 50);
});

Deno.test("gcd - zero values", () => {
  assertEquals(gcd(0, 5), 5);
  assertEquals(gcd(5, 0), 5);
  assertEquals(gcd(0, 0), 0);
});

Deno.test("gcd - negative numbers", () => {
  // gcd should handle negative numbers by converting to absolute values
  assertEquals(gcd(-12, 8), 4);
  assertEquals(gcd(12, -8), 4);
  assertEquals(gcd(-12, -8), 4);
  assertEquals(gcd(-54, 24), 6);
});

Deno.test("gcd - same numbers", () => {
  assertEquals(gcd(7, 7), 7);
  assertEquals(gcd(1, 1), 1);
  assertEquals(gcd(100, 100), 100);
});

Deno.test("gcd - coprime numbers", () => {
  // Numbers with no common divisor except 1
  assertEquals(gcd(13, 17), 1);
  assertEquals(gcd(7, 11), 1);
  assertEquals(gcd(25, 49), 1);
});

Deno.test("gcd - one is 1", () => {
  assertEquals(gcd(1, 5), 1);
  assertEquals(gcd(5, 1), 1);
  assertEquals(gcd(1, 1), 1);
});

Deno.test("gcd - large numbers", () => {
  assertEquals(gcd(1000, 500), 500);
  assertEquals(gcd(1071, 462), 21);
  assertEquals(gcd(270, 192), 6);
});

Deno.test("gcd - decimal numbers (should be rounded)", () => {
  // The function rounds inputs, so decimals should work
  // 12.7 rounds to 13, 8.3 rounds to 8 -> gcd(13, 8) = 1
  assertEquals(gcd(12.7, 8.3), 1);
  // 54.9 rounds to 55, 24.1 rounds to 24 -> gcd(55, 24) = 1
  assertEquals(gcd(54.9, 24.1), 1);
  // 10.5 rounds to 11, 5.5 rounds to 6 -> gcd(11, 6) = 1
  assertEquals(gcd(10.5, 5.5), 1);
  // 12.4 rounds to 12, 8.4 rounds to 8 -> gcd(12, 8) = 4
  assertEquals(gcd(12.4, 8.4), 4);
});

Deno.test("gcd - prime numbers", () => {
  assertEquals(gcd(17, 19), 1);
  assertEquals(gcd(23, 29), 1);
  assertEquals(gcd(11, 13), 1);
});

Deno.test("gcd - powers of 2", () => {
  assertEquals(gcd(16, 8), 8);
  assertEquals(gcd(32, 16), 16);
  assertEquals(gcd(64, 32), 32);
  assertEquals(gcd(128, 256), 128);
});


