import hdkey from "hdkey";
import { Buffer } from "buffer";
const bip39 = require("bip39");

export default class DevHDWallet {
  private readonly _seedPhrase: string;
  private readonly _hdWallet;
  private readonly _path: string = "m/00'/00'/0'/0/0";
  private readonly _privateKey: Buffer;
  private readonly _publicKey: Buffer;
  private readonly _address: string;

  get accounts() {
    return [this._address];
  }

  constructor(path?: string) {
    this._seedPhrase = bip39.generateMnemonic();
    this._path = path || this._path;

    this._hdWallet = hdkey.fromMasterSeed(
      bip39.mnemonicToSeedSync(this._seedPhrase)
    );

    const { privateKey, publicKey, address } = this.getAccountAtIndex(0);

    this._privateKey = privateKey;
    this._publicKey = publicKey;
    this._address = address;
  }

  createNAccounts(n: number) {
    return Array.from({ length: n }).map((_empty, index) => {
      return this.getAccountAtIndex(index);
    });
  }

  getAccountAtIndex(index: number) {
    const lastZeroIndex = this._path.lastIndexOf("0");

    const accountPath: string =
      this._path.substring(0, lastZeroIndex) + index.toString();

    const hdWalletDerived = this._hdWallet.derive(accountPath);
    const addressBuffer = DevHDWallet.getAddressBuffer(this._publicKey);
    return {
      privateKey: hdWalletDerived.privateKey,
      publicKey: hdWalletDerived.publicKey,
      address: DevHDWallet.bufferToChecksumAddress(addressBuffer),
    };
  }

  get seedPhrase() {
    return this._seedPhrase;
  }

  public getAddress(): string {
    return this._address;
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
