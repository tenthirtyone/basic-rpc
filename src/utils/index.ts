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
