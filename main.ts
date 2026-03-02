import { parseArgs } from "@std/cli/parse-args";
import { relative } from "@std/path";
import { existsSync } from "@std/fs/exists";

import {
  findClosestRationalAngle,
  getImageProperties,
  calculateTileDimensions,
  getOutputPath,
  generateTile,
  RATIONAL_ANGLES,
  validateDimensions,
  GenerateTileOptions,
} from "./src/lib.ts";

// Define a proper interface for parsed arguments
interface ParsedArgs {
  _: (string | number)[];
  angleOption?: number;
  degrees?: number;
  output?: string;
  maxValidSize?: number;
  allowLargeBuffers?: boolean;
  quality?: number;
  tileMargin?: number;
  verbose?: boolean;
  a?: number;
  d?: number;
  o?: string;
  s?: number;
  l?: boolean;
  q?: number;
  m?: number;
  v?: boolean;
}

const args: ParsedArgs = parseArgs(Deno.args, {
  alias: {
    angleOption: "a",
    degrees: "d",
    output: "o",
    maxValidSize: "s",
    allowLargeBuffers: "l",
    quality: "q",
    tileMargin: "m",
    verbose: "v",
  },
  string: ["output"],
  default: {
    angleOption: 0,
    maxValidSize: 2000,
    allowLargeBuffers: false,
    quality: 90,
    tileMargin: 1,
  },
});

if (args.verbose) console.log(args);

function help() {
  const commandList = {
    help: { description: "Display this help message" },
    list: { description: "List available rational angles" },
    generate: {
      description: "Generate a tile pattern from the input image",
    },
    version: { description: "Show version information" },
  };
  const generateOptions = {
    angleOption: {
      option: "-a, --angleOption",
      description: "Index of rational angle to use (default: 0)",
    },
    degrees: {
      option: "-d, --degrees",
      description: "Desired angle in degrees (overrides angleOption)",
    },
    output: {
      option: "-o, --output",
      description: "Output file name (default: derived from input)",
    },
    maxValidSize: {
      option: "-s, --maxValidSize",
      description: "Maximum valid dimension for output tiles (default: 2000)",
    },
    allowLargeBuffers: {
      option: "-l, --allowLargeBuffers",
      description: "Allow processing of large image buffers (default: false)",
    },
    quality: {
      option: "-q, --quality",
      description: "Quality of the output image (default: 90)",
    },
    tileMargin: {
      option: "-m, --tileMargin",
      description: "Margin around tiles (default: 1)",
    },
    verbose: {
      option: "-v, --verbose",
      description: "Enable verbose output (default: false)",
    },
  };

  console.log(`Usage: tile-maker <command> [options] <input>`);
  console.log("Commands:");
  console.table(commandList, ["description"]);
  console.log("\nOptions for 'generate' command:");
  console.table(generateOptions, ["option", "description"]);
  console.info(`
## Common issues ##`);
  console.log(
    `%callowLargeBuffers%c: If you receive an error of "allowLargeBuffers" use the -l flag. Warning, this will have an affect on performance, but will enable the creation of some narrow rotation / large image combinations. `,
    "font-weight: bold",
    "font-weight: normal",
  );
  console.log(
    `%cMissing pieces%c: If the output of your transformation appears to be missing pieces around the outside, try setting the -m flag, ie \`wtc-tile-maker generate -m 3 -a 27 Checker.png\`. This will add additional tiles around the rotated image to try to compensate for the rotated image size.`,
    "font-weight: bold",
    "font-weight: normal",
  );
  console.log(`
## Examples ##
1. Generate a tile with a specific angle index and margin:
   wtc-tile-maker generate -a 27 -m 3 Checker.png

2. Generate a tile with a desired angle in degrees:
   wtc-tile-maker generate -d 45 Checker.png

3. List available rational angles:
   wtc-tile-maker list
`);
}

function list() {
  console.log("Available Rational Angles:");
  const tableData = RATIONAL_ANGLES.map((ra) => ({
    Label: ra.label,
    m: ra.m,
    n: ra.n,
  }));
  console.table(tableData);
}

export interface GenerateOptions {
  angleOption?: number;
  degrees?: number;
  maxValidSize?: number;
  output?: string;
  allowLargeBuffers?: boolean;
  quality?: number;
  tileMargin?: number;
  verbose?: boolean;
  input?: string;
}

async function generate({
  angleOption = 0,
  degrees,
  output,
  maxValidSize,
  allowLargeBuffers,
  quality,
  tileMargin,
  verbose,
  input,
}: GenerateOptions) {
  // Check if we have an input file
  if (!input) throw new Error("Input file is required for generation.");
  const inputPath = relative(Deno.cwd(), input);
  if (!existsSync(inputPath)) throw new Error(`Input file not found: ${input}`);

  // Determine which rational angle to use
  let rationalAngle;
  if (degrees !== undefined) {
    rationalAngle = findClosestRationalAngle(degrees);
    console.log(
      `Requested ${degrees}°, using closest rational angle: ${rationalAngle.label}`,
    );
  } else {
    if (angleOption < 0 || angleOption >= RATIONAL_ANGLES.length) {
      throw new Error(
        "Invalid angle index. Use 0-${RATIONAL_ANGLES.length - 1}. Run 'tile-maker list' to see options.",
      );
    }
    rationalAngle = RATIONAL_ANGLES[angleOption ?? 0];
    console.log(`Using rational angle: ${rationalAngle.label}`);
  }

  // Calculate tile dimensions
  const metadata = await getImageProperties(inputPath);
  if (args.verbose) console.log("Input image metadata: ", metadata);
  const tileDims = calculateTileDimensions(
    metadata.width,
    metadata.height,
    rationalAngle,
  );
  if (args.verbose) console.log("Selected angle detail: ", rationalAngle);
  console.log(
    `Calculated tile dimensions: ${tileDims.width}x${tileDims.height}px`,
  );

  // Validate dimensions against maxValidSize etc.
  const validationErrors = validateDimensions({
    width: tileDims.width,
    height: tileDims.height,
    validWidth: maxValidSize ? maxValidSize : 2000,
  });
  if (validationErrors.length > 0) {
    throw new Error(`
Error: image output dimensions exceed maximum valid size of ${maxValidSize}px or are inclaculable (zero or infinity).
${validationErrors.join("\n")}
Suggested fix: choose a different rational angle or increase the maximum valid size with the -s option.
    `);
  }

  const outputPath = getOutputPath({
    input: inputPath,
    rationalAngle,
    output,
  });

  await generateTile({
    input: inputPath,
    output: outputPath,
    metadata,
    tileWidth: tileDims.width,
    tileHeight: tileDims.height,
    angle: rationalAngle.degrees,
    limitInputPixels: !allowLargeBuffers,
    quality,
    tileMargin,
    verbose,
  });

  console.log(`Output saved to: ${outputPath}`);
}

// Type guard for valid commands
function isValidCommand(cmd: unknown): cmd is "help" | "list" | "generate" | "version" {
  return typeof cmd === "string" && 
    ["help", "list", "generate", "version"].includes(cmd);
}

async function main() {
  const commandInput = args._[0] ?? "help";
  
  if (!isValidCommand(commandInput)) {
    throw new Error("Unknown command" + (args._[0] ? `: ${args._[0]}` : "."));
  }
  
  const command = commandInput;
  
  switch (command) {
    case "help":
      help();
      break;
    case "list":
      list();
      break;
    case "generate": {
      const input = args._[1];
      if (typeof input !== "string") {
        throw new Error("Input file must be a string");
      }
      
      await generate({
        angleOption: args.angleOption,
        degrees: args.degrees,
        output: args.output,
        maxValidSize: args.maxValidSize,
        allowLargeBuffers: args.allowLargeBuffers,
        quality: args.quality,
        tileMargin: args.tileMargin,
        verbose: args.verbose,
        input: input,
      });
      break;
    }
    case "version":
      console.log("Version 0.0.1");
      break;
  }
}

try {
  await main();
} catch (error) {
  if (error instanceof Error) {
    if (error.message == "Input image exceeds pixel limit")
      console.log(`Error: ${error.message}. Try setting the -l flag.`);
    else console.error(`Error: ${error.message}`);
  } else {
    console.error(error);
  }
  Deno.exit(1);
}
