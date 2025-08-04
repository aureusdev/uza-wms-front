import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
   plugins: [
      tanstackRouter({
         target: 'react',
         autoCodeSplitting: true,
      }),
      tailwindcss(),
      react(),
   ],
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
         "@auth": path.resolve(__dirname, "./src/modules/shared/auth"),
         "@items": path.resolve(__dirname, "./src/modules/warehouse/items"),
         "@assignments": path.resolve(__dirname, "./src/modules/warehouse/assignments"),
         "@categories": path.resolve(__dirname, "./src/modules/shared/categories"),
         "@warehouses": path.resolve(__dirname, "./src/modules/warehouse/warehouses"),
         "@containers": path.resolve(__dirname, "./src/modules/warehouse/containers"),
      },
   },
});


