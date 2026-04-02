import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
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