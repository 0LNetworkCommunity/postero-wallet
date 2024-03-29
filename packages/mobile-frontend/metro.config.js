// Learn more https://docs.expo.io/guides/customizing-metro

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const coreNodeModules = path.resolve(monorepoRoot, 'packages/core/node_modules');
const rootNodeModules = path.resolve(monorepoRoot, 'node_modules');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];

config.resolver.disableHierarchicalLookup = true;

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  coreNodeModules,
  rootNodeModules,
];

const shimsDir = path.join(projectRoot, "shims");

Object.assign(config.resolver.extraNodeModules, {
  stream: require.resolve('stream-browserify'),

  buffer: require.resolve("buffer"),

  repl: config.resolver.emptyModulePath,
  crypto: require.resolve('crypto-browserify'),
  events: config.resolver.emptyModulePath,

  perf_hooks: path.join(shimsDir, "perf_hooks.js"),

  timers: path.join(shimsDir, "timers.js"),
  tty: require.resolve('tty-browserify'),

  fs: path.join(shimsDir, "fs.js"),
  http: path.join(shimsDir, "http.js"),
  https: path.join(shimsDir, "https.js"),
  os: path.join(shimsDir, "os.js"),
  async_hooks: config.resolver.emptyModulePath,
  net: config.resolver.emptyModulePath,
  tls: config.resolver.emptyModulePath,
  url: config.resolver.emptyModulePath,
  zlib: config.resolver.emptyModulePath,
  mkdirp: config.resolver.emptyModulePath,
  querystring: config.resolver.emptyModulePath,
});

const skippedModules = [
  "@nestjs/microservices",
  "@nestjs/websockets/socket-module",
  "@nestjs/microservices/microservices-module",
  "busboy",
  "ts-morph",
  "@apollo/gateway",
  "@apollo/subgraph",
  "@apollo/subgraph/package.json",
  "@apollo/subgraph/dist/directives",
  "chokidar",
  "@as-integrations/fastify",
  "class-transformer/storage",
  "@nodelib/fs.scandir",
  "fast-glob",
  "mkdirp",
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (skippedModules.includes(moduleName)) {
    return { type: "empty" };
  }

  if (moduleName === "fs") {
    return { type: "sourceFile", filePath: path.join(shimsDir, "fs.js") };
  }

  if (moduleName === "timers") {
    return { type: "sourceFile", filePath: path.join(shimsDir, "timers.js") };
  }

  if (
    moduleName ===
    path.join(
      rootNodeModules,
      "@expo/knex-expo-sqlite-dialect/node_modules/stream-browserify/index.js"
    )
  ) {
    return {
      type: "sourceFile",
      filePath: require.resolve("stream-browserify"),
    };
  }

  if (
    moduleName ===
    path.join(
      rootNodeModules,
      "@expo/knex-expo-sqlite-dialect/node_modules/tty-browserify/index.js"
    )
  ) {
    return { type: "sourceFile", filePath: require.resolve("tty-browserify") };
  }

  return context.resolveRequest(context, moduleName, platform);
}

module.exports = config;
