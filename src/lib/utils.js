const els = (v, el) => (isDef(v) ? v : el);
const elsFn = (v, fn) => (isDef(v) ? v : fn());
const isDef = (v) => v !== undefined && v !== null;
const isArr = (v) => isDef(v) && Array.isArray(v);
const isFunc = (v) => isDef(v) && typeof v === "function";
const isStr = (v) => isDef(v) && typeof v === "string";
const isNum = (v) => isDef(v) && typeof v === "number";
const isObj = (v) => isDef(v) && typeof v === "object";
const isUndef = (v) => v === undefined || v === null;
const isTrue = (v) => v === true;
const isFalse = (v) => v === false;

//==================================================

//                 Default Values

//==================================================
const identity = (v) => v; // deprecated
const emptyFunction = () => {}; // deprecated
const identityFunc = (v) => v;
const trueFunc = () => true;
const emptyFun = () => {};
const defaultMutator = (value) => (value === undefined ? null : value); // undefined cannot be serialized so default to null
const defaultAccessor = (value) => value;
const functionMutator = (fn) =>
  isDef(fn) && typeof fn === "function" ? fn : identity;
const identityMutator = functionMutator;
const makeSeq = (num, fn = identity) => Array.from(Array(num).keys()).map(fn);


const getNestedValue = function (reference, path, fallback = undefined) {
  path = isArr(path) ? path : [path];

  var pointer = reference;
  for (var i = 0, len = path.length; i < len; i++) {
    if (
      typeof pointer !== "string" &&
      pointer !== null &&
      typeof pointer[path[i]] !== "undefined"
    ) {
      pointer = pointer[path[i]];
    } else {
      return fallback;
    }
  }

  if (typeof pointer === "string") {
    pointer = ("" + pointer).trim();
    if (pointer.length === 0) return fallback;
  }
  return pointer;
};

module.exports = {
  els,
  elsFn,
  isDef,
  isArr,
  isFunc,
  isStr,
  isNum,
  isObj,
  isUndef,
  isTrue,
  isFalse,
  identity,
  emptyFunction,
  identityFunc,
  trueFunc,
  emptyFun,
  defaultMutator,
  defaultAccessor,
  functionMutator,
  identityMutator,
  makeSeq,
  getNestedValue,
}