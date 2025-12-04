import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// REMOVE the line: import tailwindcss from '@tailwindcss/vite'; 
// (We are using the standard PostCSS method instead)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    // Only keep the React plugin here
    plugins: [react(),tailwindcss()], 
    define: {
      'process.env.API_KEY': JSON.stringify("AIzaSyCrrcDbxeTOkp78UZ--5FvGaSKtGiKvzjc"),
      'process.env.GEMINI_API_KEY': JSON.stringify("AIzaSyCrrcDbxeTOkp78UZ--5FvGaSKtGiKvzjc")
    },
    resolve: {  
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});