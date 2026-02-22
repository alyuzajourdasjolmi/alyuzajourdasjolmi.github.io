import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    // Tambahkan baris ini agar semua path file (JS/CSS) bersifat relatif
    // Sangat penting untuk GitHub Pages agar tidak terjadi error 404
    base: './', 
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                admin: resolve(__dirname, 'admin.html'),
            },
        },
    },
});