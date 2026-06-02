// Polyfill Web Crypto API antes del entorno de test
const { webcrypto } = require("crypto");
Object.defineProperty(globalThis, "crypto", {
  value: webcrypto,
  writable: true,
  configurable: true,
});
