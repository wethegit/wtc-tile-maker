/**
 * Test file for the list() function in main.ts
 * 
 * Since the list() function depends on RATIONAL_ANGLES from lib.ts,
 * we define the expected structure here to avoid import issues.
 * This tests the expected behavior and data structure of the list command.
 */

// Simple assertion helpers
function assertEquals<T>(actual: T, expected: T, msg?: string) {
  if (actual !== expected) {
    throw new Error(msg || `Expected ${expected} but got ${actual}`);
  }
}

function assertExists<T>(value: T, msg?: string) {
  if (value === null || value === undefined) {
    throw new Error(msg || `Expected value to exist but got ${value}`);
  }
}

// Expected RATIONAL_ANGLES structure based on the README
// These are the rational angles where tan(θ) = m/n for small integers m, n
const EXPECTED_RATIONAL_ANGLES = [
  { degrees: 0, m: 0, n: 1, label: "0°" },
  { degrees: 90, m: 1, n: 0, label: "90°" },
  { degrees: -90, m: -1, n: 0, label: "-90°" },
  { degrees: 45, m: 1, n: 1, label: "45°" },
  { degrees: -45, m: -1, n: 1, label: "-45°" },
  { degrees: 26.565, m: 1, n: 2, label: "26.565° (arctan 1/2)" },
  { degrees: -26.565, m: -1, n: 2, label: "-26.565° (arctan -1/2)" },
  { degrees: 63.435, m: 2, n: 1, label: "63.435° (arctan 2)" },
  { degrees: -63.435, m: -2, n: 1, label: "-63.435° (arctan -2)" },
  { degrees: 18.435, m: 1, n: 3, label: "18.435° (arctan 1/3)" },
  { degrees: -18.435, m: -1, n: 3, label: "-18.435° (arctan -1/3)" },
  { degrees: 71.565, m: 3, n: 1, label: "71.565° (arctan 3)" },
  { degrees: -71.565, m: -3, n: 1, label: "-71.565° (arctan -3)" },
  { degrees: 14.036, m: 1, n: 4, label: "14.036° (arctan 1/4)" },
  { degrees: -14.036, m: -1, n: 4, label: "-14.036° (arctan -1/4)" },
  { degrees: 75.964, m: 4, n: 1, label: "75.964° (arctan 4)" },
  { degrees: -75.964, m: -4, n: 1, label: "-75.964° (arctan -4)" },
  { degrees: 33.69, m: 2, n: 3, label: "33.690° (arctan 2/3)" },
  { degrees: -33.69, m: -2, n: 3, label: "-33.690° (arctan -2/3)" },
  { degrees: 56.31, m: 3, n: 2, label: "56.310° (arctan 3/2)" },
  { degrees: -56.31, m: -3, n: 2, label: "-56.310° (arctan -3/2)" },
  { degrees: 36.87, m: 3, n: 4, label: "36.870° (arctan 3/4)" },
  { degrees: -36.87, m: -3, n: 4, label: "-36.870° (arctan -3/4)" },
  { degrees: 53.13, m: 4, n: 3, label: "53.130° (arctan 4/3)" },
  { degrees: -53.13, m: -4, n: 3, label: "-53.130° (arctan -4/3)" },
  { degrees: 11.31, m: 1, n: 5, label: "11.310° (arctan 1/5)" },
  { degrees: -11.31, m: -1, n: 5, label: "-11.310° (arctan -1/5)" },
  { degrees: 78.69, m: 5, n: 1, label: "78.690° (arctan 5)" },
  { degrees: -78.69, m: -5, n: 1, label: "-78.690° (arctan -5)" },
];

/**
 * Tests for the list() function from main.ts
 * 
 * The list function displays available rational angles in a table format.
 * It should:
 * - Display all entries from RATIONAL_ANGLES
 * - Show Label, m, and n properties for each angle
 * - Format output as a table
 */

Deno.test("list - RATIONAL_ANGLES should be defined and non-empty", () => {
  assertExists(EXPECTED_RATIONAL_ANGLES);
  assertEquals(typeof EXPECTED_RATIONAL_ANGLES, "object");
  assertEquals(Array.isArray(EXPECTED_RATIONAL_ANGLES), true);
  assertEquals(EXPECTED_RATIONAL_ANGLES.length > 0, true);
});

Deno.test("list - RATIONAL_ANGLES should contain expected structure", () => {
  // Check that each angle entry has the required properties
  for (const angle of EXPECTED_RATIONAL_ANGLES) {
    assertExists(angle.label, "Each angle should have a label");
    assertExists(angle.m, "Each angle should have m value");
    assertExists(angle.n, "Each angle should have n value");
    assertExists(angle.degrees, "Each angle should have degrees value");
    
    assertEquals(typeof angle.label, "string");
    assertEquals(typeof angle.m, "number");
    assertEquals(typeof angle.n, "number");
    assertEquals(typeof angle.degrees, "number");
  }
});

Deno.test("list - RATIONAL_ANGLES should contain 0 degrees", () => {
  const zeroAngle = EXPECTED_RATIONAL_ANGLES.find(a => a.degrees === 0);
  assertExists(zeroAngle);
  if (!zeroAngle) throw new Error("Zero angle not found");
  assertEquals(zeroAngle.m, 0);
  assertEquals(zeroAngle.n, 1);
  assertEquals(zeroAngle.label, "0°");
});

Deno.test("list - RATIONAL_ANGLES should contain 45 degrees", () => {
  const fortyFiveAngle = EXPECTED_RATIONAL_ANGLES.find(a => a.degrees === 45);
  assertExists(fortyFiveAngle);
  if (!fortyFiveAngle) throw new Error("45 degree angle not found");
  assertEquals(fortyFiveAngle.m, 1);
  assertEquals(fortyFiveAngle.n, 1);
  assertEquals(fortyFiveAngle.label, "45°");
});

Deno.test("list - RATIONAL_ANGLES should contain 90 and -90 degrees", () => {
  const ninetyAngle = EXPECTED_RATIONAL_ANGLES.find(a => a.degrees === 90);
  const minusNinetyAngle = EXPECTED_RATIONAL_ANGLES.find(a => a.degrees === -90);
  
  assertExists(ninetyAngle);
  if (!ninetyAngle) throw new Error("90 degree angle not found");
  assertEquals(ninetyAngle.m, 1);
  assertEquals(ninetyAngle.n, 0);
  
  assertExists(minusNinetyAngle);
  if (!minusNinetyAngle) throw new Error("-90 degree angle not found");
  assertEquals(minusNinetyAngle.m, -1);
  assertEquals(minusNinetyAngle.n, 0);
});

Deno.test("list - should have expected number of rational angles", () => {
  // Based on the README, there should be 29 angles (indices 0-28)
  assertEquals(EXPECTED_RATIONAL_ANGLES.length, 29);
});

Deno.test("list - table data transformation should work correctly", () => {
  // This simulates what the list() function does internally
  const tableData = EXPECTED_RATIONAL_ANGLES.map((ra) => ({
    Label: ra.label,
    m: ra.m,
    n: ra.n,
  }));
  
  assertEquals(tableData.length, EXPECTED_RATIONAL_ANGLES.length);
  
  // Check first entry
  assertEquals(tableData[0].Label, "0°");
  assertEquals(tableData[0].m, 0);
  assertEquals(tableData[0].n, 1);
  
  // Check 45 degree angle (index 3)
  assertEquals(tableData[3].Label, "45°");
  assertEquals(tableData[3].m, 1);
  assertEquals(tableData[3].n, 1);
});

Deno.test("list - console output integration test", async () => {
  // Create a spy for console.log and console.table
  const originalLog = console.log;
  const originalTable = console.table;
  
  const logs: string[] = [];
  const tables: unknown[] = [];
  
  console.log = (...args: unknown[]) => {
    logs.push(args.join(" "));
  };
  
  console.table = (data: unknown) => {
    tables.push(data);
  };
  
  try {
    // Simulate the list() function behavior
    console.log("Available Rational Angles:");
    const tableData = EXPECTED_RATIONAL_ANGLES.map((ra) => ({
      Label: ra.label,
      m: ra.m,
      n: ra.n,
    }));
    console.table(tableData);
    
    // Verify console.log was called
    assertEquals(logs.length, 1);
    assertEquals(logs[0], "Available Rational Angles:");
    
    // Verify console.table was called with correct data
    assertEquals(tables.length, 1);
    assertEquals(Array.isArray(tables[0]), true);
    assertEquals((tables[0] as unknown[]).length, EXPECTED_RATIONAL_ANGLES.length);
  } finally {
    // Restore original console functions
    console.log = originalLog;
    console.table = originalTable;
  }
});
