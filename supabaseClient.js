import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

/**
 * Konfigurasi Supabase menggunakan Environment Variables dari Vite.
 */

// Debugging Context: Cek apakah kita di dalam Vite atau bukan
const isVite = typeof import.meta !== 'undefined' && !!import.meta.env;

if (!isVite) {
    console.group("🚨 CRITICAL ERROR: Environment Tidak Terdeteksi!");
    console.error("Browser tidak mendeteksi sistem 'Vite'.");
    console.info(
        "💡 PENYEBAB UTAMA:\n" +
        "Kamu kemungkinan besar membuka file HTML secara langsung (double click) atau lewat 'Live Server'.\n\n" +
        "💡 SOLUSI:\n" +
        "Kamu WAJIB menggunakan alamat dari terminal, contoh: http://localhost:5173\n" +
        "Pastikan di address bar browser kamu tulisannya bukan 'C:/Users/...' tapi 'localhost:...' atau '127.0.0.1:...'"
    );
    console.groupEnd();
}

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

if (isVite && (!supabaseUrl || !supabaseAnonKey)) {
    console.group("❌ CONFIGURATION ERROR: Variabel .env Kosong!");
    console.error("Vite berjalan, tapi tidak bisa menemukan VITE_SUPABASE_URL di file .env.");
    console.info(
        "💡 LANGKAH PERBAIKAN:\n" +
        "1. Pastikan file bernama '.env' (bukan .env.txt).\n" +
        "2. Pastikan isi file .env sudah di-save.\n" +
        "3. RESTART VITE: Tekan Ctrl+C di terminal, lalu ketik 'npm run dev' lagi."
    );
    console.groupEnd();
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;