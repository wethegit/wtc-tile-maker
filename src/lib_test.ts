import { findClosestRationalAngle, RATIONAL_ANGLES, type angleEntry } from "./lib.ts";

Deno.test("findClosestRationalAngle - exact match for 0 degrees", () => {
  const result = findClosestRationalAngle(0);
  if (result.degrees !== 0) throw new Error(`Expected 0, got ${result.degrees}`);
  if (result.m !== 0) throw new Error(`Expected m=0, got ${result.m}`);
  if (result.n !== 1) throw new Error(`Expected n=1, got ${result.n}`);
  if (result.label !== "0°") throw new Error(`Expected label "0°", got ${result.label}`);
});

Deno.test("findClosestRationalAngle - exact match for 45 degrees", () => {
  const result = findClosestRationalAngle(45);
  if (result.degrees !== 45) throw new Error(`Expected 45, got ${result.degrees}`);
  if (result.m !== 1) throw new Error(`Expected m=1, got ${result.m}`);
  if (result.n !== 1) throw new Error(`Expected n=1, got ${result.n}`);
  if (result.label !== "45°") throw new Error(`Expected label "45°", got ${result.label}`);
});

Deno.test("findClosestRationalAngle - exact match for 90 degrees", () => {
  const result = findClosestRationalAngle(90);
  if (result.degrees !== 90) throw new Error(`Expected 90, got ${result.degrees}`);
  if (result.m !== 1) throw new Error(`Expected m=1, got ${result.m}`);
  if (result.n !== 0) throw new Error(`Expected n=0, got ${result.n}`);
  if (result.label !== "90°") throw new Error(`Expected label "90°", got ${result.label}`);
});

Deno.test("findClosestRationalAngle - exact match for -45 degrees", () => {
  const result = findClosestRationalAngle(-45);
  if (result.degrees !== -45) throw new Error(`Expected -45, got ${result.degrees}`);
  if (result.m !== -1) throw new Error(`Expected m=-1, got ${result.m}`);
  if (result.n !== 1) throw new Error(`Expected n=1, got ${result.n}`);
  if (result.label !== "-45°") throw new Error(`Expected label "-45°", got ${result.label}`);
});

Deno.test("findClosestRationalAngle - exact match for -90 degrees", () => {
  const result = findClosestRationalAngle(-90);
  if (result.degrees !== -90) throw new Error(`Expected -90, got ${result.degrees}`);
  if (result.m !== -1) throw new Error(`Expected m=-1, got ${result.m}`);
  if (result.n !== 0) throw new Error(`Expected n=0, got ${result.n}`);
  if (result.label !== "-90°") throw new Error(`Expected label "-90°", got ${result.label}`);
});

Deno.test("findClosestRationalAngle - exact match for 26.565 degrees", () => {
  const result = findClosestRationalAngle(26.565);
  if (result.degrees !== 26.565) throw new Error(`Expected 26.565, got ${result.degrees}`);
  if (result.m !== 1) throw new Error(`Expected m=1, got ${result.m}`);
  if (result.n !== 2) throw new Error(`Expected n=2, got ${result.n}`);
  if (result.label !== "26.565° (arctan 1/2)") throw new Error(`Expected label "26.565° (arctan 1/2)", got ${result.label}`);
});

Deno.test("findClosestRationalAngle - finds closest angle for 44 degrees", () => {
  const result = findClosestRationalAngle(44);
  if (result.degrees !== 45) throw new Error(`Expected 45, got ${result.degrees}`);
  if (result.label !== "45°") throw new Error(`Expected label "45°", got ${result.label}`);
});

Deno.test("findClosestRationalAngle - finds closest angle for 46 degrees", () => {
  const result = findClosestRationalAngle(46);
  if (result.degrees !== 45) throw new Error(`Expected 45, got ${result.degrees}`);
  if (result.label !== "45°") throw new Error(`Expected label "45°", got ${result.label}`);
});

Deno.test("findClosestRationalAngle - finds closest angle for 25 degrees", () => {
  const result = findClosestRationalAngle(25);
  if (result.degrees !== 26.565) throw new Error(`Expected 26.565, got ${result.degrees}`);
  if (result.label !== "26.565° (arctan 1/2)") throw new Error(`Expected label "26.565° (arctan 1/2)", got ${result.label}`);
});

Deno.test("findClosestRationalAngle - finds closest angle for 30 degrees", () => {
  const result = findClosestRationalAngle(30);
  // 30 is closer to 26.565 (diff: 3.435) than to 33.69 (diff: 3.69)
  if (result.degrees !== 26.565) throw new Error(`Expected 26.565, got ${result.degrees}`);
});

Deno.test("findClosestRationalAngle - handles angle > 360 degrees (405)", () => {
  const result = findClosestRationalAngle(405);
  // 405 % 360 = 45
  if (result.degrees !== 45) throw new Error(`Expected 45, got ${result.degrees}`);
  if (result.label !== "45°") throw new Error(`Expected label "45°", got ${result.label}`);
});

Deno.test("findClosestRationalAngle - handles angle > 360 degrees (370)", () => {
  const result = findClosestRationalAngle(370);
  // 370 % 360 = 10, closest to 11.31° (arctan 1/5)
  if (result.degrees !== 11.31) throw new Error(`Expected 11.31, got ${result.degrees}`);
  if (result.label !== "11.310° (arctan 1/5)") throw new Error(`Expected label "11.310° (arctan 1/5)", got ${result.label}`);
});

Deno.test("findClosestRationalAngle - handles large positive angle (720)", () => {
  const result = findClosestRationalAngle(720);
  // 720 % 360 = 0
  if (result.degrees !== 0) throw new Error(`Expected 0, got ${result.degrees}`);
  if (result.label !== "0°") throw new Error(`Expected label "0°", got ${result.label}`);
});

Deno.test("findClosestRationalAngle - handles negative angle (-45)", () => {
  const result = findClosestRationalAngle(-45);
  if (result.degrees !== -45) throw new Error(`Expected -45, got ${result.degrees}`);
  if (result.label !== "-45°") throw new Error(`Expected label "-45°", got ${result.label}`);
});

Deno.test("findClosestRationalAngle - handles negative angle (-90)", () => {
  const result = findClosestRationalAngle(-90);
  if (result.degrees !== -90) throw new Error(`Expected -90, got ${result.degrees}`);
  if (result.label !== "-90°") throw new Error(`Expected label "-90°", got ${result.label}`);
});

Deno.test("findClosestRationalAngle - handles negative angle (-30)", () => {
  const result = findClosestRationalAngle(-30);
  // -30 % 360 = -30, then +360 = 330
  const result2 = findClosestRationalAngle(330);
  if (result.degrees !== result2.degrees) throw new Error(`Expected ${result2.degrees}, got ${result.degrees}`);
  if (result.label !== result2.label) throw new Error(`Expected ${result2.label}, got ${result.label}`);
});

Deno.test("findClosestRationalAngle - handles angle close to 0 from negative side (-1)", () => {
  const result = findClosestRationalAngle(-1);
  // -1 % 360 = -1, then +360 = 359, closest to 0°
  if (result.degrees !== 0) throw new Error(`Expected 0, got ${result.degrees}`);
});

Deno.test("findClosestRationalAngle - handles angle 359 degrees", () => {
  const result = findClosestRationalAngle(359);
  // 359 is closest to 0° (1 degree away)
  if (result.degrees !== 0) throw new Error(`Expected 0, got ${result.degrees}`);
});

Deno.test("findClosestRationalAngle - handles angle 1 degree", () => {
  const result = findClosestRationalAngle(1);
  // 1 is closest to 0°
  if (result.degrees !== 0) throw new Error(`Expected 0, got ${result.degrees}`);
});

Deno.test("findClosestRationalAngle - handles negative angle close to -360 (-359)", () => {
  const result = findClosestRationalAngle(-359);
  // -359 % 360 = -359, then +360 = 1, closest to 0°
  if (result.degrees !== 0) throw new Error(`Expected 0, got ${result.degrees}`);
});

Deno.test("findClosestRationalAngle - handles very large positive angle (1440)", () => {
  const result = findClosestRationalAngle(1440); // 4 full rotations
  // 1440 % 360 = 0
  if (result.degrees !== 0) throw new Error(`Expected 0, got ${result.degrees}`);
});

Deno.test("findClosestRationalAngle - handles very large negative angle (-1440)", () => {
  const result = findClosestRationalAngle(-1440); // -4 full rotations
  // -1440 % 360 = 0
  if (result.degrees !== 0) throw new Error(`Expected 0, got ${result.degrees}`);
});

Deno.test("findClosestRationalAngle - handles fractional angle 44.5", () => {
  const result = findClosestRationalAngle(44.5);
  // 44.5 is closest to 45° (0.5 away)
  if (result.degrees !== 45) throw new Error(`Expected 45, got ${result.degrees}`);
});

Deno.test("findClosestRationalAngle - handles angle 89", () => {
  const result = findClosestRationalAngle(89);
  // 89 is closest to 90° (1 away) vs 78.69° (10.31 away)
  if (result.degrees !== 90) throw new Error(`Expected 90, got ${result.degrees}`);
});

Deno.test("findClosestRationalAngle - handles angle 91", () => {
  const result = findClosestRationalAngle(91);
  // 91 is closest to 90° (1 away)
  if (result.degrees !== 90) throw new Error(`Expected 90, got ${result.degrees}`);
});

Deno.test("findClosestRationalAngle - returns an angleEntry object with all required fields", () => {
  const result = findClosestRationalAngle(45);
  if (typeof result.degrees !== "number") throw new Error("degrees should be number");
  if (typeof result.m !== "number") throw new Error("m should be number");
  if (typeof result.n !== "number") throw new Error("n should be number");
  if (typeof result.label !== "string") throw new Error("label should be string");
});

Deno.test("findClosestRationalAngle - always returns one of the predefined RATIONAL_ANGLES", () => {
  const testAngles = [0, 15, 30, 45, 60, 75, 90, 180, 270, -45, -90, 360, 400];
  
  for (const angle of testAngles) {
    const result = findClosestRationalAngle(angle);
    const isInArray = RATIONAL_ANGLES.some(
      (ra) => ra.degrees === result.degrees && ra.label === result.label
    );
    if (!isInArray) {
      throw new Error(`Result for angle ${angle} should be in RATIONAL_ANGLES`);
    }
  }
});
