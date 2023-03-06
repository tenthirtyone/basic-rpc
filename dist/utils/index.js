"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDeep = exports.oneHour = exports.oneMinute = exports.oneSecond = void 0;
exports.oneSecond = 1000;
exports.oneMinute = exports.oneSecond * 60;
exports.oneHour = exports.oneMinute * 60;
const mergeDeep = (target, source) => {
    if (!source)
        return target;
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object)
            Object.assign(source[key], (0, exports.mergeDeep)(target[key], source[key]));
    }
    Object.assign(target || {}, source);
    return target;
};
exports.mergeDeep = mergeDeep;
