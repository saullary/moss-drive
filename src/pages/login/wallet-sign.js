import { providers, utils } from "ethers";

function uint8Array(arr) {
  return Array.prototype.map.call(arr, (x) => ("00" + x.toString(16)).slice(-2)).join("");
}
function strToHex(str) {
  //return `0x${Buffer.from(nonce, "utf8").toString("hex")}`;
  return utils.hexlify(utils.toUtf8Bytes(str));
}

const METAMASK = "METAMASK";
const SOLANA = "SOLANA";
const COINBASE = "COINBASE";
const PETRA = "PETRA";
const OKX = "OKX";

export class WalletSign {
  constructor(type) {
    this.type = type;
  }

  get client() {
    if (this.type == PETRA) {
      return window.aptos;
    }
    if (this.type == OKX) {
      return window.okxwallet;
    }
    let client = window.ethereum;
    if (this.type == SOLANA) {
      client = window.phantom?.solana;
      return client?.isPhantom ? client : null;
    }
    if (!client) {
      return null;
    }
    const isType = {
      [METAMASK]: "isMetaMask",
      [COINBASE]: "isCoinbaseWallet",
    }[this.type];
    if (!client[isType]) {
      const { providers = [] } = client;
      client = null;
      providers.forEach((it) => {
        if (it[isType]) client = it;
      });
    }
    return client;
  }

  get web3Provider() {
    if (!window.ethereum) {
      throw "window.ethereum not found";
    }
    return new providers.Web3Provider(window.ethereum);
  }

  get signer() {
    return this.web3Provider.getSigner();
  }

  async getAccount() {
    if ([METAMASK, OKX, COINBASE].includes(this.type)) {
      const accounts = await this.client.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    }
    if (this.type == SOLANA) {
      const resp = await window.solana.connect();
      return resp.publicKey.toString();
    }
    if (this.type == PETRA) {
      const { address } = await window.aptos.connect();
      return address;
    }
  }

  async getSign(nonce) {
    if (this.type == METAMASK) {
      return this.signer.signMessage(nonce);
    }
    if (this.type == OKX || this.type == COINBASE) {
      const msg = strToHex(nonce);
      const account = await this.getAccount();
      return this.client.request({
        method: "personal_sign",
        params: [msg, account],
      });
    }
    if (this.type == SOLANA) {
      const encodedMessage = new TextEncoder().encode(nonce);
      const signedMessage = await this.client.signMessage(encodedMessage, "utf8");
      return uint8Array(signedMessage.signature);
    }
    if (this.type == PETRA) {
      const { signature } = await window.aptos.signMessage({
        nonce,
        message: nonce,
      });
      return signature;
    }
  }
}
