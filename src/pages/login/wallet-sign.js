// import ethers from "ethers";

const uint8Array = (arr) => {
  return Array.prototype.map.call(arr, (x) => ("00" + x.toString(16)).slice(-2)).join("");
};

export class WalletSign {
  constructor(name) {
    this.name = name;
    this.client = this.getWallet();
  }
  get provider() {
    if (!window.ethereum) {
      throw "window.ethereum not found";
    }
    return new ethers.providers.Web3Provider(window.ethereum);
  }

  get signer() {
    return this.provider.getSigner();
  }

  getWallet() {
    if (["aptos", "okxwallet"].includes(this.name)) {
      return window[this.name];
    }
    let provider = window.ethereum;
    if (this.name == "phantom") {
      provider = window.phantom?.solana;
      return provider?.isPhantom ? provider : null;
    }
    if (!provider) {
      return null;
    }
    const isType = {
      metamask: "isMetaMask",
      coinbase: "isCoinbaseWallet",
    }[this.name];
    if (!provider[isType]) {
      const { providers = [] } = provider;
      provider = null;
      providers.forEach((it) => {
        if (it[isType]) provider = it;
      });
    }
    return provider;
  }

  async getAccount() {
    if (["metamask", "okxwallet"].includes(this.name)) {
      const accounts = await this.client.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    }
    if (this.name == "phantom") {
      const resp = await window.solana.connect();
      return resp.publicKey.toString();
    }
    if (this.name == "aptos") {
      const { address } = await window.aptos.connect();
      return address;
    }
  }

  async getSign(nonce) {
    if (this.name == "metamask") {
      return this.signer.signMessage(nonce);
    }
    if (this.name == "okxwallet") {
      const msg = `0x${Buffer.from(nonce, "utf8").toString("hex")}`;
      const accounts = await this.getAccounts();
      return window.okxwallet.request({
        method: "personal_sign",
        params: [msg, accounts],
      });
    }
    if (this.name == "phantom") {
      const provider = this.getWallet();
      const encodedMessage = new TextEncoder().encode(nonce);
      const signedMessage = await provider.signMessage(encodedMessage, "utf8");
      return uint8Array(signedMessage.signature);
    }
    if (this.name == "aptos") {
      const { signature } = await window.aptos.signMessage({
        nonce,
        message: nonce,
      });
      return signature;
    }
  }
}
