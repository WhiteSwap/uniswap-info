import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build'
    },
    plugins: [react(), tsconfigPaths(), svgrPlugin({ svgrOptions: { icon: true } })],
    esbuild: {
      loader: 'tsx'
    }
  }
})
