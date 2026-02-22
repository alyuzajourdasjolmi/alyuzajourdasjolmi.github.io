import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

/**
 * Konfigurasi Supabase menggunakan Environment Variables dari Vite.
 * Bekerja baik di Local (dev) maupun GitHub Pages (prod).
 */

// Gunakan optional chaining (?.) agar tidak crash jika import.meta.env belum ada
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

// Pengecekan Error secara Profesional
if (!supabaseUrl || !supabaseAnonKey) {
    const isFileProtocol = window.location.protocol === 'file:';

    if (isFileProtocol) {
        console.group('🚨 ERROR: Jangan Buka File Secara Langsung!');
        console.error("Browser mendeteksi protokol 'file://'.");
        console.info(
            "Solusi Lokal:\n" +
            "1. Jalankan `npm run dev` di terminal.\n" +
            "2. Buka URL yang muncul (misal: http://localhost:5173)."
        );
        console.groupEnd();
    } else {
        console.group('❌ CONFIGURATION ERROR: API Key Missing');
        console.error("Aplikasi tidak bisa terhubung ke database.");
        console.info(
            "Solusi Deployment (GitHub Pages):\n" +
            "1. Buka Repository Settings > Secrets > Actions.\n" +
            "2. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.\n" +
            "3. Lakukan 'Push' ulang untuk memicu build baru."
        );
        console.groupEnd();
    }
}

// Inisialisasi client
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
