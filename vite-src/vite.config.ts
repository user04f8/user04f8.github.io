import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import obfuscator from 'vite-plugin-obfuscator';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    obfuscator({
      globalOptions: {
        compact: true, // Minifies the output
        controlFlowFlattening: true, // Adds control flow flattening to make the code harder to read
      },
      include: ['**/*.js', '**/*.jsx']
    })
  ],
})
