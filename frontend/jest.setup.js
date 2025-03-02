// jest.setup.js
require('@testing-library/jest-dom');
const { TextEncoder, TextDecoder } = require('util');

// Mock TextEncoder and TextDecoder for environments that don't have them natively
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock alert to prevent issues during testing
global.alert = jest.fn();

// Mock fetch to avoid actual API calls during tests
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  text: () => Promise.resolve(''),
});

// Mock import.meta.env for Jest compatibility
global.importMeta = {
  env: {
    VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:5020/api',
    BASE_URL: '/',
    MODE: 'development',
    DEV: true,
    PROD: false,
    SSR: false,
  },
};

// Make import.meta accessible globally
Object.defineProperty(global, 'import', {
  value: { meta: { env: global.importMeta.env } },
  writable: true,
});
