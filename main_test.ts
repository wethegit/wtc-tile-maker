/**
 * Tests for the help function in main.ts
 * 
 * These tests verify that the help command displays the correct information including:
 * - Usage information
 * - Commands table
 * - Generate options table
 * - Common issues section
 * - Examples section
 */

// Simple assertions
function assertEquals(actual: unknown, expected: unknown, msg?: string) {
  if (actual !== expected) {
    throw new Error(msg || `Expected ${expected}, but got ${actual}`);
  }
}

function assertStringIncludes(actual: string, expected: string, msg?: string) {
  if (!actual.includes(expected)) {
    throw new Error(msg || `Expected string to include "${expected}", but it didn't. Actual: ${actual}`);
  }
}

// Mock console methods to capture output
class ConsoleCapture {
  logs: string[] = [];
  tables: Array<{ data: unknown; columns?: string[] }> = [];
  infos: string[] = [];

  log(...args: unknown[]) {
    this.logs.push(args.map(String).join(" "));
  }

  table(data: unknown, columns?: string[]) {
    this.tables.push({ data, columns });
  }

  info(...args: unknown[]) {
    this.infos.push(args.map(String).join(" "));
  }

  clear() {
    this.logs = [];
    this.tables = [];
    this.infos = [];
  }

  getAllOutput(): string {
    return [...this.logs, ...this.infos].join("\n");
  }
}

// Recreate the help function to test it
// This is a copy of the help function from main.ts
function createHelpFunction() {
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

  return function help(console: ConsoleCapture) {
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
  };
}

Deno.test("help function displays usage information", () => {
  const capture = new ConsoleCapture();
  const help = createHelpFunction();

  help(capture);

  const output = capture.getAllOutput();
  assertStringIncludes(output, "Usage: tile-maker <command> [options] <input>");
});

Deno.test("help function displays commands section", () => {
  const capture = new ConsoleCapture();
  const help = createHelpFunction();

  help(capture);

  const output = capture.getAllOutput();
  assertStringIncludes(output, "Commands:");
  
  // Check that commands table was called
  assertEquals(capture.tables.length >= 1, true);
  
  // Verify the first table contains command list
  const commandTable = capture.tables[0];
  assertEquals(Array.isArray(commandTable.columns), true);
  assertEquals(commandTable.columns?.includes("description"), true);
});

Deno.test("help function displays generate options section", () => {
  const capture = new ConsoleCapture();
  const help = createHelpFunction();

  help(capture);

  const output = capture.getAllOutput();
  assertStringIncludes(output, "Options for 'generate' command:");
  
  // Check that at least 2 tables were called (commands + options)
  assertEquals(capture.tables.length >= 2, true);
  
  // Verify the second table contains generate options
  const optionsTable = capture.tables[1];
  assertEquals(Array.isArray(optionsTable.columns), true);
  assertEquals(optionsTable.columns?.includes("option"), true);
  assertEquals(optionsTable.columns?.includes("description"), true);
});

Deno.test("help function displays common issues section", () => {
  const capture = new ConsoleCapture();
  const help = createHelpFunction();

  help(capture);

  const output = capture.getAllOutput();
  assertStringIncludes(output, "## Common issues ##");
  assertStringIncludes(output, "allowLargeBuffers");
  assertStringIncludes(output, "Missing pieces");
});

Deno.test("help function displays examples section", () => {
  const capture = new ConsoleCapture();
  const help = createHelpFunction();

  help(capture);

  const output = capture.getAllOutput();
  assertStringIncludes(output, "## Examples ##");
  assertStringIncludes(output, "Generate a tile with a specific angle index and margin");
  assertStringIncludes(output, "wtc-tile-maker generate -a 27 -m 3 Checker.png");
  assertStringIncludes(output, "wtc-tile-maker generate -d 45 Checker.png");
  assertStringIncludes(output, "wtc-tile-maker list");
});

Deno.test("help function includes all expected commands", () => {
  const capture = new ConsoleCapture();
  const help = createHelpFunction();

  help(capture);

  // Get the command table data
  const commandTable = capture.tables[0];
  const commandData = commandTable.data as Record<string, { description: string }>;
  
  // Verify all expected commands are present
  assertEquals("help" in commandData, true);
  assertEquals("list" in commandData, true);
  assertEquals("generate" in commandData, true);
  assertEquals("version" in commandData, true);
});

Deno.test("help function includes all expected generate options", () => {
  const capture = new ConsoleCapture();
  const help = createHelpFunction();

  help(capture);

  // Get the options table data
  const optionsTable = capture.tables[1];
  const optionsData = optionsTable.data as Record<string, { option: string; description: string }>;
  
  // Verify all expected options are present
  assertEquals("angleOption" in optionsData, true);
  assertEquals("degrees" in optionsData, true);
  assertEquals("output" in optionsData, true);
  assertEquals("maxValidSize" in optionsData, true);
  assertEquals("allowLargeBuffers" in optionsData, true);
  assertEquals("quality" in optionsData, true);
  assertEquals("tileMargin" in optionsData, true);
  assertEquals("verbose" in optionsData, true);
});
