interface Wallet {
  id: string;
  label: string;
  publicKey: Uint8Array;
  authenticationKey: Uint8Array;
  accountAddress: Uint8Array;
  mnemonic?: string;
}

export default Wallet;
