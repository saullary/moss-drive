import { providers } from "ethers";

const uint8Array = (arr) => {
  return Array.prototype.map.call(arr, (x) => ("00" + x.toString(16)).slice(-2)).join("");
};

export class WalletSign {
  constructor(name) {
    this.name = name;
    this.client = this.getClient();
  }
  get provider() {
    if (!window.ethereum) {
      throw "window.ethereum not found";
    }
    return new providers.Web3Provider(window.ethereum);
  }

  get signer() {
    return this.provider.getSigner();
  }

  getClient() {
    if (["aptos", "okxwallet"].includes(this.name)) {
      return window[this.name];
    }
    let client = window.ethereum;
    if (this.name == "phantom") {
      client = window.phantom?.solana;
      return client?.isPhantom ? client : null;
    }
    if (!client) {
      return null;
    }
    const isType = {
      metamask: "isMetaMask",
      coinbase: "isCoinbaseWallet",
    }[this.name];
    if (!client[isType]) {
      const { providers = [] } = client;
      client = null;
      providers.forEach((it) => {
        if (it[isType]) client = it;
      });
    }
    return client;
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
      const account = await this.getAccount();
      return window.okxwallet.request({
        method: "personal_sign",
        params: [msg, [account]],
      });
    }
    if (this.name == "phantom") {
      const provider = this.getClient();
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
