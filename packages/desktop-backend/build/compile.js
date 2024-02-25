const { app } = require("electron/main");
const vm = require("node:vm");
const v8 = require("node:v8");
const fs = require("node:fs");

v8.setFlagsFromString("--no-lazy");
v8.setFlagsFromString("--no-flush-bytecode");

const main = async () => {
  await app.whenReady();

  const code = await fs.promises.readFile("./dist/main.js", "utf-8");

  const script = new vm.Script(code, {
    produceCachedData: true,
  });

  const bytecodeBuffer =
    script.createCachedData && script.createCachedData.call
      ? script.createCachedData()
      : script.cachedData;

  await fs.promises.writeFile("dist/main.cjs", bytecodeBuffer);

  console.log("done!");

  app.quit();
};

main().catch((error) => {
  console.error(error);
});
