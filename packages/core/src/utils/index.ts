export function parseHexString(str: string): Uint8Array {
  let cleanStr = str;

  // strip 0x prefix
  if (
    cleanStr.length >= 2 &&
    cleanStr[0] === "0" &&
    (cleanStr[1] === "x" || cleanStr[1] === "X")
  ) {
    cleanStr = cleanStr.substring(2);
  }

  if ((cleanStr.length & 1) === 1) { // even length
    cleanStr = `0${cleanStr}`;
  }

  cleanStr = cleanStr.toUpperCase();

  if (!/^[0-9ABCDEF]*$/.test(cleanStr)) {
    throw new Error('Invalid hex input');
  }

  return new Uint8Array(Buffer.from(cleanStr, 'hex'));
};

export const normalizeHexString = (str: string): string => {
  let cleanStr = str;

  // strip 0x prefix
  if (
    cleanStr.length >= 2 &&
    cleanStr[0] === "0" &&
    (cleanStr[1] === "x" || cleanStr[1] === "X")
  ) {
    cleanStr = cleanStr.substring(2);
  }

  if ((cleanStr.length & 1) === 1) { // even length
    cleanStr = `0${cleanStr}`;
  }

  cleanStr = cleanStr.toUpperCase();

  if (!/^[0-9ABCDEF]*$/.test(cleanStr)) {
    throw new Error('Invalid hex input');
  }

  return cleanStr;
};

export const normalizeAddress = (address: string): string => {
  let addr = normalizeHexString(address);

  if (addr.length > 64) {
    throw new Error("Invalid address length");
  }

  if (addr.length <= 32) {
    addr = addr.padStart(32, "0");
  } else if (addr.length < 64) {
    addr = addr.padStart(64, "0");
  }

  return addr;
};
