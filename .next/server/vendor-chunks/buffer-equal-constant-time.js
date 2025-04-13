"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/buffer-equal-constant-time";
exports.ids = ["vendor-chunks/buffer-equal-constant-time"];
exports.modules = {

/***/ "(rsc)/./node_modules/buffer-equal-constant-time/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/buffer-equal-constant-time/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/*jshint node:true */\n\nvar Buffer = (__webpack_require__(/*! buffer */ \"buffer\").Buffer); // browserify\nvar SlowBuffer = (__webpack_require__(/*! buffer */ \"buffer\").SlowBuffer);\n\nmodule.exports = bufferEq;\n\nfunction bufferEq(a, b) {\n\n  // shortcutting on type is necessary for correctness\n  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {\n    return false;\n  }\n\n  // buffer sizes should be well-known information, so despite this\n  // shortcutting, it doesn't leak any information about the *contents* of the\n  // buffers.\n  if (a.length !== b.length) {\n    return false;\n  }\n\n  var c = 0;\n  for (var i = 0; i < a.length; i++) {\n    /*jshint bitwise:false */\n    c |= a[i] ^ b[i]; // XOR\n  }\n  return c === 0;\n}\n\nbufferEq.install = function() {\n  Buffer.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {\n    return bufferEq(this, that);\n  };\n};\n\nvar origBufEqual = Buffer.prototype.equal;\nvar origSlowBufEqual = SlowBuffer.prototype.equal;\nbufferEq.restore = function() {\n  Buffer.prototype.equal = origBufEqual;\n  SlowBuffer.prototype.equal = origSlowBufEqual;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVxdWFsLWNvbnN0YW50LXRpbWUvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDYTtBQUNiLGFBQWEsb0RBQXdCLEVBQUU7QUFDdkMsaUJBQWlCLHdEQUE0Qjs7QUFFN0M7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLGNBQWM7QUFDaEM7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL25vZGVfbW9kdWxlcy9idWZmZXItZXF1YWwtY29uc3RhbnQtdGltZS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKmpzaGludCBub2RlOnRydWUgKi9cbid1c2Ugc3RyaWN0JztcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7IC8vIGJyb3dzZXJpZnlcbnZhciBTbG93QnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuU2xvd0J1ZmZlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBidWZmZXJFcTtcblxuZnVuY3Rpb24gYnVmZmVyRXEoYSwgYikge1xuXG4gIC8vIHNob3J0Y3V0dGluZyBvbiB0eXBlIGlzIG5lY2Vzc2FyeSBmb3IgY29ycmVjdG5lc3NcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYSkgfHwgIUJ1ZmZlci5pc0J1ZmZlcihiKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIGJ1ZmZlciBzaXplcyBzaG91bGQgYmUgd2VsbC1rbm93biBpbmZvcm1hdGlvbiwgc28gZGVzcGl0ZSB0aGlzXG4gIC8vIHNob3J0Y3V0dGluZywgaXQgZG9lc24ndCBsZWFrIGFueSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgKmNvbnRlbnRzKiBvZiB0aGVcbiAgLy8gYnVmZmVycy5cbiAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBjID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgLypqc2hpbnQgYml0d2lzZTpmYWxzZSAqL1xuICAgIGMgfD0gYVtpXSBeIGJbaV07IC8vIFhPUlxuICB9XG4gIHJldHVybiBjID09PSAwO1xufVxuXG5idWZmZXJFcS5pbnN0YWxsID0gZnVuY3Rpb24oKSB7XG4gIEJ1ZmZlci5wcm90b3R5cGUuZXF1YWwgPSBTbG93QnVmZmVyLnByb3RvdHlwZS5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKHRoYXQpIHtcbiAgICByZXR1cm4gYnVmZmVyRXEodGhpcywgdGhhdCk7XG4gIH07XG59O1xuXG52YXIgb3JpZ0J1ZkVxdWFsID0gQnVmZmVyLnByb3RvdHlwZS5lcXVhbDtcbnZhciBvcmlnU2xvd0J1ZkVxdWFsID0gU2xvd0J1ZmZlci5wcm90b3R5cGUuZXF1YWw7XG5idWZmZXJFcS5yZXN0b3JlID0gZnVuY3Rpb24oKSB7XG4gIEJ1ZmZlci5wcm90b3R5cGUuZXF1YWwgPSBvcmlnQnVmRXF1YWw7XG4gIFNsb3dCdWZmZXIucHJvdG90eXBlLmVxdWFsID0gb3JpZ1Nsb3dCdWZFcXVhbDtcbn07XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/buffer-equal-constant-time/index.js\n");

/***/ })

};
;