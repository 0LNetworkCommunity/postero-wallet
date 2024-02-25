
const path = require("node:path");
const process = require("node:process");
const { spawn: nativeSpawn } = require("node:child_process");

const spawn = (command, args) => {
  return new Promise((resolve, reject) => {
    const proc = nativeSpawn(command, args, { shell: true });

    proc.stdout.pipe(process.stdout, { end: false });
    proc.stderr.pipe(process.stderr, { end: false });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    }); 
  });
};

const main = async () => {
  const nestPath = path.join(process.cwd(), "node_modules/.bin/nest");
  const electronPath = path.join(process.cwd(), "node_modules/.bin/electron");

  await spawn(nestPath, ["build", "-b", "webpack"]);
  await spawn(electronPath, ["build/compile"]);
};

main();