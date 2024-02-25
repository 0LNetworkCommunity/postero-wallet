import AccountAddress from "./AccountAddress";
import AuthenticationKey from "./AuthenticationKey";
import KeyFactory from "./KeyFactory";
import Seed from "./Seed";

class WalletLibrary {
  private readonly mnemonic: string;

  private readonly keyFactory: KeyFactory;

  private readonly addrMap = new Map<string, bigint>();

  private keyLeaf = 0n;

  public static newFromMnemonic(mnemonic: string) {
    const seed = new Seed(mnemonic, Buffer.from("0L", "ascii"));
    const keyFactory = new KeyFactory(seed);

    return new WalletLibrary(mnemonic, keyFactory);
  }

  private constructor(mnemonic: string, keyFactory: KeyFactory) {
    this.mnemonic = mnemonic;
    this.keyFactory = keyFactory;
  }

  public newAddress(): [AuthenticationKey, bigint] {
    const child = this.keyFactory.privateChild(this.keyLeaf);
    const authenticationKey = child.getAuthenticationKey();

    const oldKeyLeaf = this.keyLeaf;
    this.keyLeaf += 1n;
    const address = authenticationKey.derivedAddress();
    const addrStr = Buffer.from(address.address).toString("hex");

    if (this.addrMap.has(addrStr)) {
      throw new Error("This address is already in your wallet");
    }
    this.addrMap.set(addrStr, oldKeyLeaf);
    return [authenticationKey, oldKeyLeaf];
  }

  public getPrivateKey(accountAddress: AccountAddress) {
    const child = this.addrMap.get(
      Buffer.from(accountAddress.address).toString("hex"),
    );
    if (child === undefined) {
      throw new Error("missing address");
    }
    return this.keyFactory.privateChild(child).getPrivateKey();
  }
}

export default WalletLibrary;
