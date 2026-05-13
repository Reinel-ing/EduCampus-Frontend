import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// simular variables de entorno de Vite
global.import = {
  meta: {
    env: {
      VITE_API_BASE_URL: "http://localhost:8000"
    }
  }
};