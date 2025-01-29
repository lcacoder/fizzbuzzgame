module.exports = {
  presets: [
    '@babel/preset-env',        // For ECMAScript syntax
    '@babel/preset-react',      // For React JSX syntax
    '@babel/preset-typescript', // For handling TypeScript syntax
  ],
  plugins: [
    '@babel/plugin-transform-runtime',  // For handling async functions, etc.
  ],
};
