import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   proxy: {
  //     '/EduTech': {
  //       target: 'http://localhost:8800',
  //       changeOrigin: true,
  //       secure: false, 
  //     },
  //   },
  // },
  css: {
    postcss: './postcss.config.js',
  },
})
