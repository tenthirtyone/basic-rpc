import crypto from "crypto";
export const oneSecond = 1000;
export const oneMinute = oneSecond * 60;
export const oneHour = oneMinute * 60;

export const generatePrivateKey = (): Buffer => {
  let privateKey: Buffer;
  do {
    privateKey = crypto.randomBytes(32);
  } while (!isValidPrivateKey(privateKey));

  return privateKey;
};

export const isValidPrivateKey = (privateKey: Buffer): boolean => {
  const ecdh = crypto.createECDH("secp256k1");
  ecdh.setPrivateKey(privateKey);
  const publicKey = ecdh.getPublicKey();
  return publicKey.length !== 0;
};

export const mergeDeep = (target: any, source?: any) => {
  if (!source) return target;

  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object)
      Object.assign(source[key], mergeDeep(target[key], source[key]));
  }

  Object.assign(target || {}, source);
  return target;
};

type AnyObject = { [key: string]: any };

export function flattenObject(obj: AnyObject): AnyObject {
  const result: AnyObject = {};

  function recurse(obj: AnyObject, currentKey: string) {
    for (const [key, value] of Object.entries(obj)) {
      const newKey = currentKey ? `${currentKey}.${key}` : key;
      if (typeof value === "object" && value !== null) {
        recurse(value, newKey);
      } else {
        result[newKey] = value;
      }
    }
  }

  recurse(obj, "");

  return result;
}

export function hexStringToBuffer(hex: string): Buffer {
  if (hex.substring(0, 2) === "0x") {
    hex = hex.slice(2);
  }

  if (hex.length % 2 !== 0) {
    throw new Error("Hex string must have an even number of characters");
  }

  const buffer = Buffer.allocUnsafe(hex.length / 2);

  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.substr(i, 2), 16);
    buffer.writeUInt8(byte, i / 2);
  }

  return buffer;
}

export function bigintToHexString(num: BigInt): string {
  return `0x${num.toString(16)}`;
}

export function randomEthereumAddress(): Buffer {
  return generateRandomBytes(20);
}

function generateRandomBytes(len: number): Buffer {
  return crypto.randomBytes(len);
}

export function bufferToHexString(buffer: Buffer): string {
  return `0x${buffer.toString("hex")}`;
}
