import bootstrapBackend, { Backend } from "@postero/mobile-backend";
import ExpoPlatformModule from './ExpoPlatformModule';

const bootstrap = async (): Promise<Backend> => {
  const proc = process as any;

  if (!global.Buffer) {
    global.Buffer = require('buffer/').Buffer;
  }

  Object.assign(proc, {
    cwd: () => "/",
    stdout: {
      write(...args: any[]) {
        console.log(...args);
      },
    },
    stderr: {
      write(...args: any[]) {
        console.log(...args);
      },
    },
  });

  const backend = await bootstrapBackend(ExpoPlatformModule);
  return backend;
};

export default bootstrap;
