import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173, 
    strictPort: true,
    // Uncomment the following if you're having CORS issues:
    // cors: true,
    // // Uncomment if you need to specify the origin explicitly:
    // headers: {
    //   "Access-Control-Allow-Origin": "*",
    // }
  }
})