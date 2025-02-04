// global.d.ts or in your types file
declare global {
    var importMeta: {
      env: {
        VITE_API_URL: string;
      };
    };
  }
  