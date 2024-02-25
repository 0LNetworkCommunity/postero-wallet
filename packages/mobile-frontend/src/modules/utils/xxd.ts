import _ from "lodash";

/**
 * Produces an output string like the xxd binary:
 * 
 * A3F7 8FD1 7D40 E78E 3D38 AD09 5248 6E45  ....}@..=8..RHnE
 * B392 3198 90E7 1951 C6DC 77FA D160 3CDA  ..1....Q..w..`<.
 * DFC3 BA8B CB35 D215 B72A 4103 775E 3D41  .....5...*A.w^=A
 * C6D0 7B53 21B2 D78A FEE6 20D3 6480 0F52  ..{S!..... .d..R
 * 700E 3A7A 1AF4 9BCB 6565 48B2 ACF1 8DAE  p.:z....eeH.....
 * 9D02 E7A9 FC4F F9E2 AED9 E853 5CCC 96C8  .....O.....S\...
 * 4797 9E4B 3740 3A1F 9B2B 819E 9F95 1603  G..K7@:..+......
 * FFD9                                     ..
 * 
 */

const xxd = (input: Uint8Array): string => {
  const rows = _.chunk(input, 16).map((it) => _.chunk(it, 2));

  return rows
    .map((row: number[][]) => {
      let ascii = '';
      let line = row
        .map((it: number[]) => {
          const hexStr = it
            .map((it) => {
              if (it >= 0x21 && it <= 0x7e) {
                ascii += String.fromCharCode(it);
              } else {
                ascii += '.';
              }
              return it.toString(16).toUpperCase().padStart(2, '0');
            })
            .join("");
          return hexStr;
        })
        .join(" ");

      line = line.padEnd(41, ' ');
      line += ascii;
      return line;
    })
    .join("\n");
};

export default xxd;
