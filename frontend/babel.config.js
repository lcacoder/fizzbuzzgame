module.exports = {
  presets: [
    '@babel/preset-env',      // Handle modern JS syntax
    '@babel/preset-react',    // Handle React JSX
    '@babel/preset-typescript', // Handle TypeScript
  ],
  plugins: [
    '@babel/plugin-transform-runtime',  // Re-use Babel's helpers
    'babel-plugin-transform-import-meta',  // Support for import.meta
  ],
};
