import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl' // Imported secure TLS local generator plugin

export default defineConfig({
    plugins: [
        react(),
        basicSsl() // Generates development SSL certs on the fly for secure local network testing
    ],
    server: {
        host: true, // Tells Vite to listen on 0.0.0.0 for LAN/Hotspot cross-device communication
        port: 5173
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
        // --- ADD THIS EXCLUDE LINE ---
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/tests-e2e/**', // This tells Vitest to ignore Playwright files
            '**/.{idea,git,cache,output,temp}/**'
        ],
        // -----------------------------
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
})