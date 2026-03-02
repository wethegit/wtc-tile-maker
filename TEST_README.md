# Tests for findClosestRationalAngle

This directory contains comprehensive tests for the `findClosestRationalAngle` function.

## Running the Tests

To run all tests:
```bash
deno test --allow-read
```

Or using the task defined in `deno.json`:
```bash
deno task test
```

To run just the lib tests:
```bash
deno test src/lib_test.ts --allow-read
```

## Test Coverage

The test suite for `findClosestRationalAngle` covers:

### Exact Matches
- Tests for angles that exactly match rational angles in the RATIONAL_ANGLES array
- Examples: 0°, 45°, 90°, -45°, -90°, 26.565°

### Closest Angle Finding
- Tests for angles that are close to but not exactly matching rational angles
- Examples: 44° → 45°, 46° → 45°, 25° → 26.565°, 30° → 26.565°

### Angle Normalization
- Tests for angles > 360° (e.g., 405° → 45°, 720° → 0°)
- Tests for negative angles (e.g., -45°, -90°, -30°)
- Tests for very large angles (e.g., 1440°, -1440°)
- Tests for edge cases around 0° (e.g., 359°, 1°, -1°, -359°)

### Fractional Angles
- Tests for non-integer angles (e.g., 44.5° → 45°)

### Edge Cases
- Tests for angles near boundaries (e.g., 89° → 90°, 91° → 90°)
- Tests that verify the result always comes from RATIONAL_ANGLES array
- Tests that verify all required fields are present in the returned angleEntry object

## Test Count

The test suite includes **27 comprehensive test cases** covering all aspects of the `findClosestRationalAngle` function.

## Function Behavior

The `findClosestRationalAngle` function:
1. Normalizes input angles to the 0-360° range
2. Finds the rational angle with the smallest absolute difference from the normalized angle
3. Returns an `angleEntry` object containing:
   - `degrees`: The angle in degrees
   - `m`: The numerator of the rational angle (tan(θ) = m/n)
   - `n`: The denominator of the rational angle (tan(θ) = m/n)
   - `label`: A human-readable label for the angle
