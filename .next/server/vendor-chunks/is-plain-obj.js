"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-plain-obj";
exports.ids = ["vendor-chunks/is-plain-obj"];
exports.modules = {

/***/ "(ssr)/./node_modules/is-plain-obj/index.js":
/*!********************************************!*\
  !*** ./node_modules/is-plain-obj/index.js ***!
  \********************************************/
/***/ ((module) => {

eval("\nmodule.exports = (value)=>{\n    if (Object.prototype.toString.call(value) !== \"[object Object]\") {\n        return false;\n    }\n    const prototype = Object.getPrototypeOf(value);\n    return prototype === null || prototype === Object.prototype;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXMtcGxhaW4tb2JqL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBRUFBLE9BQU9DLE9BQU8sR0FBR0MsQ0FBQUE7SUFDaEIsSUFBSUMsT0FBT0MsU0FBUyxDQUFDQyxRQUFRLENBQUNDLElBQUksQ0FBQ0osV0FBVyxtQkFBbUI7UUFDaEUsT0FBTztJQUNSO0lBRUEsTUFBTUUsWUFBWUQsT0FBT0ksY0FBYyxDQUFDTDtJQUN4QyxPQUFPRSxjQUFjLFFBQVFBLGNBQWNELE9BQU9DLFNBQVM7QUFDNUQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kZW1vLy4vbm9kZV9tb2R1bGVzL2lzLXBsYWluLW9iai9pbmRleC5qcz8wZDk2Il0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB2YWx1ZSA9PiB7XG5cdGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGNvbnN0IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSk7XG5cdHJldHVybiBwcm90b3R5cGUgPT09IG51bGwgfHwgcHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlO1xufTtcbiJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwidmFsdWUiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJnZXRQcm90b3R5cGVPZiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/is-plain-obj/index.js\n");

/***/ })

};
;