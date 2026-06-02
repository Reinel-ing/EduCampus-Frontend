import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// URL base de la API para los tests
process.env.VITE_API_BASE_URL = "http://localhost:8000";
