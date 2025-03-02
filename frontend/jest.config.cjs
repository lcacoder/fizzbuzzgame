module.exports = {
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testEnvironment: 'jsdom',  
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/jest.setup.js'], 
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};
