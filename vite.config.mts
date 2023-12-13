import image from '@rollup/plugin-image'
import inject from '@rollup/plugin-inject'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { checker } from 'vite-plugin-checker'
import commonjs from 'vite-plugin-commonjs'
import svgrPlugin from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgrPlugin(),
    checker({ typescript: true }),
    inject({
      Buffer: ['buffer', 'Buffer']
    }),
    {
      ...image(),
      enforce: 'pre'
    },
    commonjs({})
  ],
  server: {
    hmr: { overlay: false },
    host: '0.0.0.0',
    port: 3000
  }
})
