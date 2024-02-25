const lazyImports = [
  "@nestjs/microservices/microservices-module",
  "@nestjs/websockets/socket-module",
  "pg",
  "pg-query-stream",
  "oracledb",
  "mysql",
  "mysql2",
  "tedious",
  "better-sqlite3",
  "ts-morph",
  "@apollo/subgraph/dist/directives",
  "fsevents",
  "class-transformer/storage",
  "@apollo/subgraph/package.json",
  "@apollo/subgraph",
];

module.exports = (options, webpack) => {
  return {
    ...options,
    target: "electron-main",
    externals: {
      fsevents: {},
      chokidar: {},
      "@apollo/gateway": {},
      "@as-integrations/fastify": {},
      "better-sqlite3": "better-sqlite3",
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
  };
};