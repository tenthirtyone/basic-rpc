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
