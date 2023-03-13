import crypto from "crypto";
export const oneSecond = 1000;
export const oneMinute = oneSecond * 60;
export const oneHour = oneMinute * 60;

export const mergeDeep = (target: any, source?: any) => {
  if (!source) return target;

  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object)
      Object.assign(source[key], mergeDeep(target[key], source[key]));
  }

  Object.assign(target || {}, source);
  return target;
};

export const convertToBigInt = (input: string): bigint => {
  // Check if the input is a hexadecimal string
  if (/^0x([0-9A-Fa-f]{2})*$/.test(input)) {
    return BigInt(input);
  }

  // Check if the input is a number
  const number = Number(input);
  if (!isNaN(number)) {
    return BigInt(number);
  }

  return 0n;
};

type AnyObject = { [key: string]: any };

export function flattenObject(obj: AnyObject): AnyObject {
  const result: AnyObject = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenObject(value));
    } else {
      result[key] = value;
    }
  }
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

export function numberToHexString(num: number | BigInt): string {
  const hexString = num.toString(16);
  return `0x${hexString}`;
}

export function randomEthereumAddress(): Buffer {
  return generateRandomBytes(20);
}

function generateRandomBytes(len: number): Buffer {
  return crypto.randomBytes(len);
}
