require('@testing-library/jest-dom');
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.alert = jest.fn();
global.importMetaEnv = {
    VITE_API_URL: 'http://localhost:5020/api', // Mock your API URL
};
  
Object.defineProperty(global, 'import.meta', {
    value: { env: global.importMetaEnv },
});
  