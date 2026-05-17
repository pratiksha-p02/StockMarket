
export const config = {
    // Server port
    port: process.env?.['PORT'] || 4200,
  
    // API configuration
    api: {
      endpoint: process.env["API_ENDPOINT"] || 'http://localhost:4200/',
    },
  
    // Other server-specific configuration
    // ...
  };