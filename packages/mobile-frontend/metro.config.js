// Learn more https://docs.expo.io/guides/customizing-metro

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];

config.resolver.disableHierarchicalLookup = true;

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

const shimsDir = path.join(projectRoot, "shims");

const s = require.resolve('stream-browserify');
console.log('>>>>>>', s);

Object.assign(config.resolver.extraNodeModules, {
  // stream: require.resolve("readable-stream"),
  stream: require.resolve('stream-browserify'),

  buffer: require.resolve("buffer"),

  repl: config.resolver.emptyModulePath,
  // crypto: path.join(shimsDir, "crypto.js"),
  crypto: require.resolve('crypto-browserify'),
  // events: require.resolve('events'),
  events: config.resolver.emptyModulePath,

  perf_hooks: path.join(shimsDir, "perf_hooks.js"),

  timers: path.join(shimsDir, "timers.js"),
  tty: require.resolve('tty-browserify'),

  fs: path.join(shimsDir, "fs.js"),
  http: path.join(shimsDir, "http.js"),
  https: path.join(shimsDir, "https.js"),
  os: path.join(shimsDir, "os.js"),
  // stream: path.join(shimsDir, "stream.js"),
  // path: path.join(shimsDir, "path.js"),
  // util: config.resolver.emptyModulePath,
  async_hooks: config.resolver.emptyModulePath,
  net: config.resolver.emptyModulePath,
  tls: config.resolver.emptyModulePath,
  url: config.resolver.emptyModulePath,
  zlib: config.resolver.emptyModulePath,
  querystring: config.resolver.emptyModulePath,

});

const skippedModules = [
  "@nestjs/microservices",
  "@nestjs/websockets/socket-module",
  "@nestjs/microservices/microservices-module",
  // "@nestjs/platform-express",
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
];

const rootNodeModules = path.resolve(monorepoRoot, 'node_modules');
const knexExpoSqliteDialectNodeModules = path.join(rootNodeModules, '@expo/knex-expo-sqlite-dialect/node_modules/');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (skippedModules.includes(moduleName)) {
    return { type: "empty" };
  }

  // if (moduleName === "events") {
  //   return { type: "sourceFile", filePath: require.resolve('events') };
  // }
  if (moduleName === "fs") {
    return { type: "sourceFile", filePath: path.join(shimsDir, "fs.js") };
  }
  if (moduleName === "timers") {
    return { type: "sourceFile", filePath: path.join(shimsDir, "timers.js") };
  }
  if (moduleName === "/Users/will/Projects/086_POSTERO/postero/node_modules/@expo/knex-expo-sqlite-dialect/node_modules/stream-browserify/index.js") {
    return { type: "sourceFile", filePath: require.resolve('stream-browserify') };
  }
  if (moduleName === "/Users/will/Projects/086_POSTERO/postero/node_modules/@expo/knex-expo-sqlite-dialect/node_modules/tty-browserify/index.js") {
    return { type: "sourceFile", filePath: require.resolve('tty-browserify') };
  }

  //       return { type: "sourceFile", filePath: require.resolve('stream-browserify') };
  // if (moduleName.startsWith(knexExpoSqliteDialectNodeModules)) {
  //   const mod = moduleName.substring(knexExpoSqliteDialectNodeModules.length).split('/')[0];
  //   console.log('mod', mod);

  //   switch (mod) {
  //     case 'crypto':
  //       return { type: "sourceFile", filePath: require.resolve('crypto-browserify') };
  //     case 'events':
  //       return { type: "sourceFile", filePath: require.resolve('events') };
  //     case 'fs':
  //       return { type: "sourceFile", filePath: path.join(shimsDir, "fs.js") };
  //     case 'stream':
  //       return { type: "sourceFile", filePath: require.resolve('stream-browserify') };
  //     case 'timers':
  //       return { type: "sourceFile", filePath: path.join(shimsDir, "timers.js") };
  //     case 'tty':
  //       return { type: "sourceFile", filePath: require.resolve('tty-browserify') };
  //   }
  // }
  // console.log(moduleName);
  return context.resolveRequest(context, moduleName, platform);
}

module.exports = config;
