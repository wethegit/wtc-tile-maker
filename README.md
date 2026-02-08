# WTC Tile Maker (Deno + Sharp)

## Problem Statement

When generating tiles for websites, designers and developers often encounter issues when rotating tiles. Common solutions involve less-than-ideal hacks, such as adding pseudoelements, scaling, and rotating them to achieve the desired effect. These workarounds can complicate code, reduce performance, and make maintenance harder.

WTC Tile Maker aims to solve this by providing a robust, programmatic solution for generating and manipulating tiles, including rotation, without relying on CSS hacks.

---

## Quick Start

Generate a seamlessly tileable rotated version of your image:

```sh
# Rotate an image to 45 degrees
deno run -A main.ts generate -d 45 input.png

# Or use a preset angle index (run 'list' to see all options)
deno run -A main.ts generate -a 3 input.png

# List all available rational angles
deno run -A main.ts list

# Help
deno run -A main.ts help

```

The output file will be saved in the same directory as the input with the angle appended to the filename (e.g., `input-tile-45.png`).

---

## Development

### Prerequisites

- [Deno](https://deno.com/) installed
- [Sharp](https://deno.land/x/sharp) module available

### Running the Project

1. Clone the repository:
   ```sh
   git clone https://github.com/wethegit/wtc-tile-maker-deno-sharp.git
   cd wtc-tile-maker-deno-sharp
   ```
2. Run the main script:
   ```sh
   deno run -A main.ts
   ```

---

## CLI Usage

### Commands

| Command    | Description                                 |
| ---------- | ------------------------------------------- |
| `help`     | Display the help message                    |
| `list`     | List available rational angles              |
| `generate` | Generate a tile pattern from an input image |
| `version`  | Show version information                    |

### Options for `generate`

| Option                    | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| `-a, --angleOption`       | Index of rational angle to use (default: 0)              |
| `-d, --degrees`           | Desired angle in degrees (overrides angleOption)         |
| `-o, --output`            | Output file name (default: derived from input)           |
| `-s, --maxValidSize`      | Maximum valid dimension for output tiles (default: 2000) |
| `-l, --allowLargeBuffers` | Allow processing of large image buffers (default: false) |
| `-q, --quality`           | Quality of the output image (default: 90)                |
| `-m, --tileMargin`        | Margin around tiles (default: 1)                         |
| `-v, --verbose`           | Enable verbose output (default: false)                   |

---

## Available Rational Angles

These are the angles where `tan(θ) = m/n` for small integers m, n. These angles produce periodic tilings when used for rotation.

| Index | Label                  | m   | n   |
| ----- | ---------------------- | --- | --- |
| 0     | 0°                     | 0   | 1   |
| 1     | 90°                    | 1   | 0   |
| 2     | -90°                   | -1  | 0   |
| 3     | 45°                    | 1   | 1   |
| 4     | -45°                   | -1  | 1   |
| 5     | 26.565° (arctan 1/2)   | 1   | 2   |
| 6     | -26.565° (arctan -1/2) | -1  | 2   |
| 7     | 63.435° (arctan 2)     | 2   | 1   |
| 8     | -63.435° (arctan -2)   | -2  | 1   |
| 9     | 18.435° (arctan 1/3)   | 1   | 3   |
| 10    | -18.435° (arctan -1/3) | -1  | 3   |
| 11    | 71.565° (arctan 3)     | 3   | 1   |
| 12    | -71.565° (arctan -3)   | -3  | 1   |
| 13    | 14.036° (arctan 1/4)   | 1   | 4   |
| 14    | -14.036° (arctan -1/4) | -1  | 4   |
| 15    | 75.964° (arctan 4)     | 4   | 1   |
| 16    | -75.964° (arctan -4)   | -4  | 1   |
| 17    | 33.690° (arctan 2/3)   | 2   | 3   |
| 18    | -33.690° (arctan -2/3) | -2  | 3   |
| 19    | 56.310° (arctan 3/2)   | 3   | 2   |
| 20    | -56.310° (arctan -3/2) | -3  | 2   |
| 21    | 36.870° (arctan 3/4)   | 3   | 4   |
| 22    | -36.870° (arctan -3/4) | -3  | 4   |
| 23    | 53.130° (arctan 4/3)   | 4   | 3   |
| 24    | -53.130° (arctan -4/3) | -4  | 3   |
| 25    | 11.310° (arctan 1/5)   | 1   | 5   |
| 26    | -11.310° (arctan -1/5) | -1  | 5   |
| 27    | 78.690° (arctan 5)     | 5   | 1   |
| 28    | -78.690° (arctan -5)   | -5  | 1   |

You can also run `deno -A main.ts list` to see these angles.

---

## Usage Examples

### Show Help

```sh
deno -A main.ts help
```

### List Available Rational Angles

```sh
deno -A main.ts list
```

### Generate a Tile

Generate a rotated tile from `Checker.png` using angle index 27, margin 3, and max size 6000:

| Step    | Description                                                                           | Example / Output Image                                                 |
| ------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Input   | Source image to be tiled and rotated.                                                 | ![Checker.png](Checker.png)                                            |
| Command | Command to generate a rotated tile using angle index 27, margin 3, and max size 6000. | <pre>deno -A main.ts generate -lv -a 27 -m 3 -s 6000 Checker.png</pre> |
| Output  | Resulting seamlessly tileable image after processing.                                 | ![Checker-tile-63.435.png](Checker-tile-63.435.png)                    |

This will output a file like `Checker-tile-63.435.png`.

### Generate with a Specific Degree

If you want to specify an angle in degrees instead of an index:

```sh
deno -A main.ts generate -d 45 Checker.png
```

The tool will find the closest rational angle and generate the tile accordingly.

---

## Common Issues

- **allowLargeBuffers**: If you receive an error about `allowLargeBuffers`, use the `-l` flag. Warning: this may affect performance, but enables processing of narrow rotation / large image combinations.
- **Missing pieces**: If the output appears to be missing pieces around the edges, try increasing the `-m` (tileMargin) value, e.g., `-m 3`.

---

## How This Works

### The Problem with Rotating Tiles

When you rotate a regular tiling pattern (like a checkerboard) by an arbitrary angle, the result doesn't tile seamlessly in the x and y direction anymore.

### Rational Angles

The key insight is that **rational angles**—angles where `tan(θ) = m/n` for small integers m and n—produce periodic tilings when used for rotation. At these specific angles, the rotated grid aligns back to integer positions, allowing seamless repetition.

For example:

- `tan(45°) = 1/1` → m=1, n=1
- `tan(26.565°) = 1/2` → m=1, n=2
- `tan(63.435°) = 2/1` → m=2, n=1

### Tile Dimension Calculation

For a rational angle with `tan(θ) = m/n`, the rotated pattern repeats at intervals of `√(m² + n²)` times the original period.

To create a seamlessly tileable output:

- The output dimensions are calculated as: `input dimensions × √(m² + n²) / gcd(m, n)`
- This ensures the rotated grid aligns back to integer positions

### The Process

1. **Input**: A tileable source image (e.g., a checkerboard pattern)
2. **Tile**: The source image is tiled into a larger canvas to provide enough material for the rotation
3. **Rotate**: The tiled canvas is rotated by the selected rational angle
4. **Crop**: A precisely calculated region is extracted that will tile seamlessly
5. **Output**: The resulting image can be used as a CSS background and will tile perfectly at the rotated angle

This approach eliminates the need for CSS hacks like pseudoelements with `transform: rotate()` and `scale()`, resulting in cleaner code, better performance, and more predictable rendering across browsers.

---
