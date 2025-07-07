import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

function logAfterStartup() {
  return {
    name: 'custom-log',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    configureServer(server: any) {
      server.httpServer?.once('listening', () => {
        const address = server.httpServer.address();
        if (typeof address === 'object' && address?.port) {
          const host = 'localhost'; // or '127.0.0.1' or get from env
          const protocol = server.config.server.https ? 'https' : 'http';
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          console.log(`\n🟢 Frontend Running at ${protocol}://${host}:${address.port}\n`);
        }
      });
    },
  };
}
// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  
  return {
    plugins: [react(), logAfterStartup(), tailwindcss()],
    server: {
      allowedHosts: ['sem-v1.local', env.VITE_API_BASE_URL],
      port: env.VITE_PORT ? parseInt(env.VITE_PORT, 10) : 8080,
      proxy: {
        '/api': env.VITE_API_BASE_URL || 'http://localhost:8081',
      },
      watch: {
        ignored: ['**/api/db.json'],
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: command === 'serve',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
})
