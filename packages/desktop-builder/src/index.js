const fs = require("node:fs");
const v8 = require("node:v8");
const vm = require("node:vm");
const process = require("node:process");
const pathUtil = require("node:path");
const { pathToFileURL } = require("node:url");
const electron = require("electron");

const { protocol, app, net } = electron;

v8.setFlagsFromString("--no-lazy");
v8.setFlagsFromString("--no-flush-bytecode");

const MAGIC_NUMBER = Buffer.from([0xde, 0xc0]);
const ZERO_LENGTH_EXTERNAL_REFERENCE_TABLE = Buffer.alloc(2);

const compileCode = function (javascriptCode) {
  if (typeof javascriptCode !== "string") {
    throw new Error(
      `javascriptCode must be string. ${typeof javascriptCode} was given.`,
    );
  }

  const script = new vm.Script(javascriptCode, {
    produceCachedData: true,
  });

  let bytecodeBuffer =
    script.createCachedData && script.createCachedData.call
      ? script.createCachedData()
      : script.cachedData;

  // if (compress) bytecodeBuffer = brotliCompressSync(bytecodeBuffer);

  return bytecodeBuffer;
};

const fixBytecode = function (bytecodeBuffer) {
  if (!Buffer.isBuffer(bytecodeBuffer)) {
    throw new Error("bytecodeBuffer must be a buffer object.");
  }

  const dummyBytecode = compileCode('"ಠ_ಠ"');
  const version = parseFloat(process.version.slice(1, 5));

  if (
    process.version.startsWith("v8.8") ||
    process.version.startsWith("v8.9")
  ) {
    // Node is v8.8.x or v8.9.x
    dummyBytecode.subarray(16, 20).copy(bytecodeBuffer, 16);
    dummyBytecode.subarray(20, 24).copy(bytecodeBuffer, 20);
  } else if (version >= 12 && version <= 21) {
    dummyBytecode.subarray(12, 16).copy(bytecodeBuffer, 12);
  } else {
    dummyBytecode.subarray(12, 16).copy(bytecodeBuffer, 12);
    dummyBytecode.subarray(16, 20).copy(bytecodeBuffer, 16);
  }
};

function isBufferV8Bytecode(buffer) {
  return (
    Buffer.isBuffer(buffer) &&
    !buffer.subarray(0, 2).equals(ZERO_LENGTH_EXTERNAL_REFERENCE_TABLE) &&
    buffer.subarray(2, 4).equals(MAGIC_NUMBER)
  );
}

const readSourceHash = function (bytecodeBuffer) {
  if (!Buffer.isBuffer(bytecodeBuffer)) {
    throw new Error("bytecodeBuffer must be a buffer object.");
  }

  if (
    process.version.startsWith("v8.8") ||
    process.version.startsWith("v8.9")
  ) {
    // Node is v8.8.x or v8.9.x
    // eslint-disable-next-line no-return-assign
    return bytecodeBuffer
      .subarray(12, 16)
      .reduce(
        (sum, number, power) => (sum += number * Math.pow(256, power)),
        0,
      );
  } else {
    // eslint-disable-next-line no-return-assign
    return bytecodeBuffer
      .subarray(8, 12)
      .reduce(
        (sum, number, power) => (sum += number * Math.pow(256, power)),
        0,
      );
  }
};

function generateScript(cachedData, filename) {
  fixBytecode(cachedData);

  const length = readSourceHash(cachedData);

  let dummyCode = "";

  if (length > 1) {
    dummyCode = '"' + "\u200b".repeat(length - 2) + '"'; // "\u200b" Zero width space
  }

  const script = new vm.Script(dummyCode, {
    cachedData,
    filename,
  });

  if (script.cachedDataRejected) {
    throw new Error("Invalid or incompatible cached data (cachedDataRejected)");
  }

  return script;
}

const main = async () => {
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (require("electron-squirrel-startup")) {
    app.quit();
  }

  const asarPath = pathUtil.join(__dirname, "..");

  const reflect = new vm.Script(
    await fs.promises.readFile(
      pathUtil.join(asarPath, "src/Reflect.js"),
      "utf-8",
    ),
  );

  const mainPath = pathUtil.join(__dirname, "backend/main.cjs");
  const mainScript = await fs.promises.readFile(mainPath);
  const script = generateScript(mainScript, "main.cjs");

  // const mainPath = pathUtil.join(asarPath, "src/backend/main.js");
  // const code = await fs.promises.readFile(mainPath, "utf-8");
  // const script = new vm.Script(code);

  const allowedImports = [
    "assert",
    "assert/strict",
    "async_hooks",
    "buffer",
    "child_process",
    "cluster",
    "console",
    "constants",
    "crypto",
    "dgram",
    "diagnostics_channel",
    "dns",
    "dns/promises",
    "domain",
    "events",
    "fs",
    "fs/promises",
    "http",
    "http2",
    "https",
    "inspector",
    "internal/*",
    "module",
    "net",
    "os",
    "path",
    "path/posix",
    "path/win32",
    "perf_hooks",
    "process",
    "punycode",
    "querystring",
    "readline",
    "repl",
    "stream",
    "stream/promises",
    "string_decoder",
    "sys",
    "timers",
    "timers/promises",
    "tls",
    "trace_events",
    "tty",
    "url",
    "util",
    "util/types",
    "v8",
    "vm",
    "wasi",
    "worker_threads",
    "zlib",
    "node:path",
    "node:crypto",
    "node:os",
    "node:fs",
    "node:process",
    "electron",
    "better-sqlite3",
  ];

  const global = {
    require: (id) => {
      if (allowedImports.includes(id)) {
        return require(id);
      }

      const err = new Error(`Cannot find module '${id}'. `);
      err.code = "MODULE_NOT_FOUND";
      throw err;
    },
    console,
    process,
    __dirname: pathUtil.join(__dirname, "../simple"),
    __filename: mainPath,
    Buffer,
    electron,
    global: {},
    TextEncoder,
    TextDecoder,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    setImmediate,
    clearImmediate,

    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    URL,
    fetch,
    Event,
    EventTarget,
    Array,
    Map,
    Object,
    JSON,
    Error,
    Date,
    Function,
    RegExp,
    Math,
    performance,
    String,
    Number,
    Boolean,
  };

  const context = vm.createContext({
    ...global,
    global,
  });

  reflect.runInContext(context);

  await app.whenReady();

  protocol.handle("file", (req) => {
    const url = new URL(req.url);
    const pathComponents = url.pathname.split(pathUtil.sep);

    const asarIndex = pathComponents.lastIndexOf("app.asar");
    if (asarIndex === -1) {
      const realPath = pathToFileURL(
        pathUtil.join(asarPath, "web-build", url.pathname),
      ).toString();

      return net.fetch(realPath, {
        bypassCustomProtocolHandlers: true,
      });
    }

    const webPathComponents = pathComponents.slice(asarIndex + 1);
    const webPath = pathUtil.join(...webPathComponents);
    const realPath = pathToFileURL(
      pathUtil.join(asarPath, "web-build", webPath),
    ).toString();

    return net.fetch(realPath, {
      bypassCustomProtocolHandlers: true,
    });
  });

  // protocol.handle("http", (req) => {
  //   console.log("http", req.url);
  // });

  script.runInContext(context);
};

main();
