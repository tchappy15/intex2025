import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: './', // <-- SUPER IMPORTANT for relative paths in Azure
  plugins: [react()],
  server: {
    port: 3000,
    headers: {

        "Content-Security-Policy":
          "default-src 'self'; \
          script-src 'self' 'unsafe-inline' 'unsafe-eval'; \
          style-src 'self' 'unsafe-inline' fonts.googleapis.com; \
          img-src 'self' data:; \
          frame-ancestors 'none'; \
          font-src 'self' fonts.gstatic.com data:; \
          connect-src 'self' https://localhost:5000 https://intex2025-backend-bpdjaqe0f9g2cra2.eastus-01.azurewebsites.net https://gray-flower-0bd00101e.6.azurestaticapps.net; \
          object-src 'none'; \
          base-uri 'self'; \
          form-action 'self';"

    }
  },
  build: {
    outDir: 'dist',
  }
});
