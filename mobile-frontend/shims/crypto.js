const Crypto = require("expo-crypto");

class Hash {
  constructor(algorithm) {
    this.algorithm = algorithm;
    this.data = [];
  }

  update(data) {
    this.data.push(data);
    return this;
  }

  digest(encoding) {
    if (encoding !== "hex") {
      throw new Error(`unsupported encoding ${encoding}`);
    }
    return Crypto.digestStringAsync(this.algorithm, this.data.join(""));
  }
}

module.exports = {
  createHash: (algorithm) => {
    let digest;
    switch (algorithm) {
      case "sha256":
        digest = Crypto.CryptoDigestAlgorithm.SHA256;
        break;
      default:
        throw new Error(`Unsupported algorithm ${algorithm}`);
    }
    return new Hash(digest);
  },
};
