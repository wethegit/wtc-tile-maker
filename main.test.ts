import {
  assertEquals,
  assertRejects,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { stub } from "https://deno.land/std@0.224.0/testing/mock.ts";
import { help, list, generate, main } from "./main.ts";

Deno.test("help function - displays usage information", () => {
  const logs: string[] = [];
  const consoleLogStub = stub(console, "log", (...args: any[]) => {
    logs.push(args.map(String).join(" "));
  });
  const consoleTableStub = stub(console, "table", () => {});
  const consoleInfoStub = stub(console, "info", (...args: any[]) => {
    logs.push(args.map(String).join(" "));
  });

  try {
    help();

    const allOutput = logs.join(" ");
    assertStringIncludes(allOutput, "Usage: tile-maker");
    assertStringIncludes(allOutput, "Commands:");
    assertStringIncludes(allOutput, "generate");
  } finally {
    consoleLogStub.restore();
    consoleTableStub.restore();
    consoleInfoStub.restore();
  }
});

Deno.test("list function - displays available rational angles", () => {
  const logs: string[] = [];
  const consoleLogStub = stub(console, "log", (...args: any[]) => {
    logs.push(args.map(String).join(" "));
  });
  const consoleTableStub = stub(console, "table", () => {});

  try {
    list();

    const allOutput = logs.join(" ");
    assertStringIncludes(allOutput, "Available Rational Angles");
  } finally {
    consoleLogStub.restore();
    consoleTableStub.restore();
  }
});

Deno.test("generate function - throws error when input is missing", async () => {
  await assertRejects(
    async () => {
      await generate({});
    },
    Error,
    "Input file is required for generation",
  );
});

Deno.test("generate function - throws error when input file doesn't exist", async () => {
  await assertRejects(
    async () => {
      await generate({ input: "nonexistent-file.png" });
    },
    Error,
    "Input file not found",
  );
});

Deno.test("generate function - validates angle option range", async () => {
  // Create a simple test image
  const testImagePath = "/tmp/test-image-for-main-test.png";
  const pngData = new Uint8Array([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1,
    0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222, 0, 0, 0, 12, 73, 68, 65, 84,
    8, 215, 99, 248, 207, 192, 0, 0, 3, 1, 1, 0, 24, 221, 141, 176, 0, 0, 0, 0,
    73, 69, 78, 68, 174, 66, 96, 130,
  ]);
  await Deno.writeFile(testImagePath, pngData);

  try {
    await assertRejects(
      async () => {
        await generate({ input: testImagePath, angleOption: 999 });
      },
      Error,
      "Invalid angle index",
    );
  } finally {
    try {
      await Deno.remove(testImagePath);
    } catch {
      // ignore
    }
  }
});

Deno.test("main function - handles help command", async () => {
  const logs: string[] = [];
  const consoleLogStub = stub(console, "log", (...args: any[]) => {
    logs.push(args.map(String).join(" "));
  });
  const consoleTableStub = stub(console, "table", () => {});
  const consoleInfoStub = stub(console, "info", (...args: any[]) => {
    logs.push(args.map(String).join(" "));
  });

  try {
    await main(["help"]);

    const allOutput = logs.join(" ");
    assertStringIncludes(allOutput, "Usage: tile-maker");
  } finally {
    consoleLogStub.restore();
    consoleTableStub.restore();
    consoleInfoStub.restore();
  }
});

Deno.test("main function - handles list command", async () => {
  const logs: string[] = [];
  const consoleLogStub = stub(console, "log", (...args: any[]) => {
    logs.push(args.map(String).join(" "));
  });
  const consoleTableStub = stub(console, "table", () => {});

  try {
    await main(["list"]);

    const allOutput = logs.join(" ");
    assertStringIncludes(allOutput, "Available Rational Angles");
  } finally {
    consoleLogStub.restore();
    consoleTableStub.restore();
  }
});

Deno.test("main function - handles version command", async () => {
  const logs: string[] = [];
  const consoleLogStub = stub(console, "log", (...args: any[]) => {
    logs.push(args.map(String).join(" "));
  });

  try {
    await main(["version"]);

    const allOutput = logs.join(" ");
    assertStringIncludes(allOutput, "Version");
  } finally {
    consoleLogStub.restore();
  }
});

Deno.test("main function - throws error for unknown command", async () => {
  await assertRejects(
    async () => {
      await main(["unknown-command"]);
    },
    Error,
    "Unknown command: unknown-command",
  );
});

Deno.test("main function - defaults to help when no command provided", async () => {
  const logs: string[] = [];
  const consoleLogStub = stub(console, "log", (...args: any[]) => {
    logs.push(args.map(String).join(" "));
  });
  const consoleTableStub = stub(console, "table", () => {});
  const consoleInfoStub = stub(console, "info", (...args: any[]) => {
    logs.push(args.map(String).join(" "));
  });

  try {
    await main([]);

    const allOutput = logs.join(" ");
    assertStringIncludes(allOutput, "Usage: tile-maker");
  } finally {
    consoleLogStub.restore();
    consoleTableStub.restore();
    consoleInfoStub.restore();
  }
});

