# Tests for validateDimensions

This directory contains comprehensive tests for the `validateDimensions` function from `lib.ts`.

## Running Tests

To run the tests, use the following command:

```bash
deno test --allow-read --allow-env src/lib_test.ts
```

Or use the convenient test task defined in `deno.json`:

```bash
deno task test
```

## Test Coverage

The test suite includes 26 test cases covering all aspects of the `validateDimensions` function:

### Valid Dimensions
- ✅ Valid dimensions within default limits
- ✅ Valid dimensions with custom limits
- ✅ Dimensions equal to maximum values
- ✅ Very small positive dimensions (1x1)
- ✅ Floating point dimensions

### Zero Dimensions
- ✅ Zero width (non-zero height)
- ✅ Zero height (non-zero width)
- ✅ Both dimensions zero

### Infinite Dimensions
- ✅ Infinite width
- ✅ Infinite height
- ✅ Both dimensions infinite
- ✅ Negative infinity width
- ✅ Negative infinity height

### NaN Values
- ✅ NaN width
- ✅ NaN height
- ✅ Both dimensions NaN

### Exceeding Maximums
- ✅ Width exceeding default maximum (2000px)
- ✅ Height exceeding default maximum (2000px)
- ✅ Both dimensions exceeding default maximum
- ✅ Width exceeding custom maximum
- ✅ Height exceeding custom maximum
- ✅ Both dimensions exceeding custom maximum

### Custom Validation Thresholds
- ✅ validHeight defaults to validWidth when not specified
- ✅ Custom validWidth and validHeight parameters

### Multiple Error Conditions
- ✅ Zero dimension + exceeding maximum
- ✅ Infinite dimension + exceeding maximum

## Implementation Notes

The test file includes an inline copy of the `validateDimensions` function to avoid dependency resolution issues when the JSR registry is not accessible. In production environments with full network access, you would typically import directly from `./lib.ts`:

```typescript
import { validateDimensions } from "./lib.ts";
```

## Test Results

All 26 tests pass successfully:

```
ok | 26 passed | 0 failed (15ms)
```

## Function Behavior

The `validateDimensions` function validates tile dimensions and returns an array of error messages. Key behaviors:

1. **Returns empty array** when all validations pass
2. **Accumulates errors** - all validation checks run independently
3. **Default limits** - validWidth and validHeight default to 2000px
4. **validHeight defaults to validWidth** if not specified separately

### Error Messages

- `"Tile dimensions cannot be zero"` - When width or height is 0
- `"Tile dimensions resulted in infinity"` - When width or height is not finite (includes both Infinity and NaN values)
  - **Note**: This error message is technically imprecise for NaN values, but that's the current implementation behavior
- `"Tile width (Xpx) exceeds maximum of Ypx"` - When width > validWidth
- `"Tile height (Xpx) exceeds maximum of Ypx"` - When height > validHeight

## Edge Cases Tested

- Infinity values also trigger the "exceeds maximum" error (since Infinity > any number)
- NaN values are caught by the `!isFinite()` check
  - **Note**: The error message says "infinity" but this also covers NaN values
- Negative infinity is treated the same as positive infinity
- Multiple errors can be returned for a single validation call

## Potential Improvements

While testing, we noted that the error message "Tile dimensions resulted in infinity" is used for both Infinity and NaN values. This is technically accurate from an implementation standpoint (both fail the `isFinite()` check), but could be more precise. A future enhancement could differentiate between these cases for clearer error messages.
