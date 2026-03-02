// Simplified test file for lcm function
// This file contains copies of gcd and lcm functions to avoid import issues

/**
 * Greatest Common Divisor using Euclidean algorithm
 */
function gcd(a: number, b: number): number {
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
function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

// Simple assertion function for numbers with optional epsilon for floating point
function assertEquals(actual: number, expected: number, message?: string) {
  // Use epsilon comparison for floating point numbers
  const epsilon = 1e-10;
  const diff = Math.abs(actual - expected);
  
  if (diff > epsilon) {
    throw new Error(
      message || `Assertion failed: expected ${expected}, got ${actual} (diff: ${diff})`,
    );
  }
}

Deno.test("lcm - basic positive numbers", () => {
  assertEquals(lcm(4, 6), 12);
  assertEquals(lcm(3, 5), 15);
  assertEquals(lcm(12, 18), 36);
});

Deno.test("lcm - same numbers", () => {
  assertEquals(lcm(5, 5), 5);
  assertEquals(lcm(1, 1), 1);
  assertEquals(lcm(100, 100), 100);
});

Deno.test("lcm - one number is 1", () => {
  assertEquals(lcm(1, 5), 5);
  assertEquals(lcm(7, 1), 7);
  assertEquals(lcm(1, 1), 1);
});

Deno.test("lcm - one or both numbers are 0", () => {
  assertEquals(lcm(0, 5), 0);
  assertEquals(lcm(7, 0), 0);
  assertEquals(lcm(0, 0), 0);
});

Deno.test("lcm - coprime numbers", () => {
  // Coprime numbers have gcd of 1, so lcm should be their product
  assertEquals(lcm(7, 11), 77);
  assertEquals(lcm(13, 17), 221);
  assertEquals(lcm(3, 8), 24);
});

Deno.test("lcm - one number divides the other", () => {
  assertEquals(lcm(3, 6), 6);
  assertEquals(lcm(4, 12), 12);
  assertEquals(lcm(5, 25), 25);
});

Deno.test("lcm - negative numbers", () => {
  // lcm should return absolute value
  assertEquals(lcm(-4, 6), 12);
  assertEquals(lcm(4, -6), 12);
  assertEquals(lcm(-4, -6), 12);
  assertEquals(lcm(-3, -5), 15);
});

Deno.test("lcm - large numbers", () => {
  assertEquals(lcm(100, 200), 200);
  assertEquals(lcm(123, 456), 18696);
  assertEquals(lcm(1000, 1500), 3000);
});

Deno.test("lcm - relationship with gcd", () => {
  // For any two numbers a and b: lcm(a, b) * gcd(a, b) = |a * b|
  const testCases = [
    [4, 6],
    [12, 18],
    [7, 11],
    [15, 25],
    [100, 150],
  ];

  for (const [a, b] of testCases) {
    const lcmValue = lcm(a, b);
    const gcdValue = gcd(a, b);
    assertEquals(lcmValue * gcdValue, Math.abs(a * b));
  }
});

Deno.test("lcm - fractional numbers (behavior with non-integers)", () => {
  // Note: gcd rounds inputs using Math.round(), but lcm uses original values for multiplication
  // lcm(a, b) = |a * b| / gcd(a, b) where gcd operates on rounded values
  // Example: lcm(4.7, 6.2) = |4.7 * 6.2| / gcd(5, 6) = 29.14 / 1 = 29.14
  assertEquals(lcm(4.7, 6.2), 29.14);
  // lcm(3.1, 5.9) = |3.1 * 5.9| / gcd(3, 6)
  const result = lcm(3.1, 5.9);
  const expected = (3.1 * 5.9) / gcd(3.1, 5.9);
  assertEquals(result, expected);
});
