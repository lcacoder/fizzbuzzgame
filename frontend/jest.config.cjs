module.exports = {
  setupFiles: ["<rootDir>/jest.setup.js"], // path to your setup file
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest", // Transform TypeScript with Babel
    "^.+\\.(js|jsx)$": "babel-jest", // Also for JS files
  },
  testEnvironment: "jsdom", // Jest environment for testing React apps
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"], // Ensure Jest knows about TypeScript and JavaScript files
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy', // Mock CSS imports to prevent Jest from processing them
  },
};
