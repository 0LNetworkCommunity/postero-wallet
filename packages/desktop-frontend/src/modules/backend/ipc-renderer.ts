
interface IpcRenderer {
  invoke: (channel: string, ...args: unknown[]) => Promise<any>;
  send: (channel: string, ...args: unknown[]) => void;
  on: (channel: string, func: (...args: unknown[]) => void) => () => void;
  once:(channel: string, func: (...args: unknown[]) => void) => void;
}

export default IpcRenderer;
