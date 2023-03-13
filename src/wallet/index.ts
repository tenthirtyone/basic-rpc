import hdkey from "hdkey";
import { Buffer } from "buffer";

const bip39 = require("bip39");

type Account = {
  privateKey: Buffer;
  publicKey: Buffer;
  address: string;
};

export default class DevHDWallet {
  _seedPhrase: string = bip39.generateMnemonic();
  _hdKey;
  _path: string = "m/00'/00'/0'/0/0";
  _privateKey: Buffer;
  _publicKey: Buffer;
  _address: string;
  _accounts: Account[];

  get accounts() {
    return this._accounts.map((account) => account.address);
  }

  constructor(mnemonic?: string, path?: string) {
    this._seedPhrase = mnemonic || this._seedPhrase;
    this._path = path || this._path;

    this._hdKey = hdkey.fromMasterSeed(
      bip39.mnemonicToSeedSync(this._seedPhrase)
    );

    this._accounts = this.createNAccounts(10);

    const { privateKey, publicKey, address } = this.getAccountAtIndex(0);

    this._privateKey = privateKey;
    this._publicKey = publicKey;
    this._address = address;
  }

  createNAccounts(n: number): Account[] {
    return Array.from({ length: n }).map((_empty, index) => {
      return this.getAccountAtIndex(index);
    });
  }

  getAccountAtIndex(index: number) {
    const lastZeroIndex = this._path.lastIndexOf("0");

    const accountPath: string =
      this._path.substring(0, lastZeroIndex) + index.toString();

    const hdWalletDerived = this._hdKey.derive(accountPath);
    const addressBuffer = DevHDWallet.getAddressBuffer(
      hdWalletDerived.publicKey
    );
    return {
      privateKey: hdWalletDerived.privateKey,
      publicKey: hdWalletDerived.publicKey,
      address: DevHDWallet.bufferToChecksumAddress(addressBuffer),
    };
  }

  get seedPhrase() {
    return this._seedPhrase;
  }

  private static getAddressBuffer(publicKey: Buffer): Buffer {
    const hash = DevHDWallet.hashKeccak256(publicKey);
    const addressBuffer = hash.slice(12);
    return addressBuffer;
  }

  private static bufferToChecksumAddress(buffer: Buffer): string {
    const address = "0x" + buffer.toString("hex");
    const hash = DevHDWallet.hashKeccak256(
      Buffer.from(address.slice(2), "hex")
    );
    let checksumAddress = "0x";
    const hashArray = Array.from(hash, (byte) => byte.toString(16)); // convert hash to an array
    for (let i = 0; i < address.length - 2; i++) {
      // Check if the i-th character of the *address* string should be capitalized
      if (parseInt(hashArray[Math.floor(i / 2)], 16) & (i % 2 == 0 ? 8 : 4)) {
        checksumAddress += address[i + 2].toUpperCase();
      } else {
        checksumAddress += address[i + 2];
      }
    }
    return checksumAddress;
  }
  private static hashKeccak256(buffer: Buffer): Buffer {
    const keccak256 = require("keccak256");
    const hash = keccak256(buffer).toString("hex");
    return Buffer.from(hash, "hex");
  }
}
