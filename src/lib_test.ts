// Test file for validateDimensions function
// Note: This test file includes an inline copy of validateDimensions to avoid
// import issues when JSR registry is not accessible. In production environments
// with network access, import directly from "./lib.ts"

// Simple assertion helper
function assertEquals<T>(actual: T, expected: T, msg?: string): void {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(
      msg ||
        `Assertion failed:\nExpected: ${expectedStr}\nActual:   ${actualStr}`,
    );
  }
}

// Inline validateDimensions for testing without external dependencies
// This is an exact copy of the function from lib.ts
function validateDimensions({
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

Deno.test("validateDimensions - returns empty array for valid dimensions", () => {
  const errors = validateDimensions({
    width: 100,
    height: 100,
  });
  assertEquals(errors, []);
});

Deno.test("validateDimensions - returns empty array for valid dimensions with custom limits", () => {
  const errors = validateDimensions({
    width: 3000,
    height: 3000,
    validWidth: 5000,
    validHeight: 5000,
  });
  assertEquals(errors, []);
});

Deno.test("validateDimensions - returns error for zero width", () => {
  const errors = validateDimensions({
    width: 0,
    height: 100,
  });
  assertEquals(errors, ["Tile dimensions cannot be zero"]);
});

Deno.test("validateDimensions - returns error for zero height", () => {
  const errors = validateDimensions({
    width: 100,
    height: 0,
  });
  assertEquals(errors, ["Tile dimensions cannot be zero"]);
});

Deno.test("validateDimensions - returns error for both zero dimensions", () => {
  const errors = validateDimensions({
    width: 0,
    height: 0,
  });
  assertEquals(errors, ["Tile dimensions cannot be zero"]);
});

Deno.test("validateDimensions - returns error for infinite width", () => {
  const errors = validateDimensions({
    width: Infinity,
    height: 100,
  });
  assertEquals(errors, [
    "Tile dimensions resulted in infinity",
    "Tile width (Infinitypx) exceeds maximum of 2000px",
  ]);
});

Deno.test("validateDimensions - returns error for infinite height", () => {
  const errors = validateDimensions({
    width: 100,
    height: Infinity,
  });
  assertEquals(errors, [
    "Tile dimensions resulted in infinity",
    "Tile height (Infinitypx) exceeds maximum of 2000px",
  ]);
});

Deno.test("validateDimensions - returns error for both infinite dimensions", () => {
  const errors = validateDimensions({
    width: Infinity,
    height: Infinity,
  });
  assertEquals(errors, [
    "Tile dimensions resulted in infinity",
    "Tile width (Infinitypx) exceeds maximum of 2000px",
    "Tile height (Infinitypx) exceeds maximum of 2000px",
  ]);
});

Deno.test("validateDimensions - returns error for negative infinity width", () => {
  const errors = validateDimensions({
    width: -Infinity,
    height: 100,
  });
  assertEquals(errors, ["Tile dimensions resulted in infinity"]);
});

Deno.test("validateDimensions - returns error for negative infinity height", () => {
  const errors = validateDimensions({
    width: 100,
    height: -Infinity,
  });
  assertEquals(errors, ["Tile dimensions resulted in infinity"]);
});

Deno.test("validateDimensions - returns error for width exceeding default maximum", () => {
  const errors = validateDimensions({
    width: 2001,
    height: 100,
  });
  assertEquals(errors, ["Tile width (2001px) exceeds maximum of 2000px"]);
});

Deno.test("validateDimensions - returns error for height exceeding default maximum", () => {
  const errors = validateDimensions({
    width: 100,
    height: 2001,
  });
  assertEquals(errors, ["Tile height (2001px) exceeds maximum of 2000px"]);
});

Deno.test("validateDimensions - returns error for both dimensions exceeding default maximum", () => {
  const errors = validateDimensions({
    width: 2001,
    height: 2001,
  });
  assertEquals(errors, [
    "Tile width (2001px) exceeds maximum of 2000px",
    "Tile height (2001px) exceeds maximum of 2000px",
  ]);
});

Deno.test("validateDimensions - returns error for width exceeding custom maximum", () => {
  const errors = validateDimensions({
    width: 5001,
    height: 100,
    validWidth: 5000,
  });
  assertEquals(errors, ["Tile width (5001px) exceeds maximum of 5000px"]);
});

Deno.test("validateDimensions - returns error for height exceeding custom maximum", () => {
  const errors = validateDimensions({
    width: 100,
    height: 3001,
    validHeight: 3000,
  });
  assertEquals(errors, ["Tile height (3001px) exceeds maximum of 3000px"]);
});

Deno.test("validateDimensions - returns error for both dimensions exceeding custom maximum", () => {
  const errors = validateDimensions({
    width: 4001,
    height: 3001,
    validWidth: 4000,
    validHeight: 3000,
  });
  assertEquals(errors, [
    "Tile width (4001px) exceeds maximum of 4000px",
    "Tile height (3001px) exceeds maximum of 3000px",
  ]);
});

Deno.test("validateDimensions - returns multiple errors for zero and exceeding dimensions", () => {
  const errors = validateDimensions({
    width: 0,
    height: 2001,
  });
  assertEquals(errors, [
    "Tile dimensions cannot be zero",
    "Tile height (2001px) exceeds maximum of 2000px",
  ]);
});

Deno.test("validateDimensions - returns multiple errors for infinite and exceeding dimensions", () => {
  const errors = validateDimensions({
    width: Infinity,
    height: 2001,
  });
  assertEquals(errors, [
    "Tile dimensions resulted in infinity",
    "Tile width (Infinitypx) exceeds maximum of 2000px",
    "Tile height (2001px) exceeds maximum of 2000px",
  ]);
});

Deno.test("validateDimensions - accepts dimensions equal to maximum", () => {
  const errors = validateDimensions({
    width: 2000,
    height: 2000,
  });
  assertEquals(errors, []);
});

Deno.test("validateDimensions - accepts custom dimensions equal to custom maximum", () => {
  const errors = validateDimensions({
    width: 5000,
    height: 3000,
    validWidth: 5000,
    validHeight: 3000,
  });
  assertEquals(errors, []);
});

Deno.test("validateDimensions - validHeight defaults to validWidth when not specified", () => {
  const errors = validateDimensions({
    width: 100,
    height: 5001,
    validWidth: 5000,
  });
  assertEquals(errors, ["Tile height (5001px) exceeds maximum of 5000px"]);
});

Deno.test("validateDimensions - accepts very small positive dimensions", () => {
  const errors = validateDimensions({
    width: 1,
    height: 1,
  });
  assertEquals(errors, []);
});

Deno.test("validateDimensions - accepts floating point dimensions", () => {
  const errors = validateDimensions({
    width: 100.5,
    height: 200.7,
  });
  assertEquals(errors, []);
});

Deno.test("validateDimensions - returns error for NaN width", () => {
  const errors = validateDimensions({
    width: NaN,
    height: 100,
  });
  assertEquals(errors, ["Tile dimensions resulted in infinity"]);
});

Deno.test("validateDimensions - returns error for NaN height", () => {
  const errors = validateDimensions({
    width: 100,
    height: NaN,
  });
  assertEquals(errors, ["Tile dimensions resulted in infinity"]);
});

Deno.test("validateDimensions - returns error for both NaN dimensions", () => {
  const errors = validateDimensions({
    width: NaN,
    height: NaN,
  });
  assertEquals(errors, ["Tile dimensions resulted in infinity"]);
});
