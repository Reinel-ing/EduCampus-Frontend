import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["adopt-club-commodities-avatar.trycloudflare.com"],
  },
  build: {
    // Optimización de bundle
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'pdf': ['jspdf', 'jspdf-autotable', 'html2canvas'],  // Aislar PDF pesado
        }
      }
    },
    // Minificación agresiva
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    },
    // Optimizar CSS
    cssCodeSplit: true,
    // Reportar tamaño del bundle
    reportCompressedSize: true,
    // Precargar módulos críticos
    chunkSizeWarningLimit: 1000,
  },
  // Optimización de imágenes
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
});
