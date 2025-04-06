import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
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
          connect-src 'self' https://intex2025-backend-bpdjaqe0f9g2cra2.eastus-01.azurewebsites.net https://gray-flower-0bd00101e.6.azurestaticapps.net; \
          object-src 'none'; \
          base-uri 'self'; \
          form-action 'self';"

    }
  },
});
