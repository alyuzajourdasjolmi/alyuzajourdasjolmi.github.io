import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

/**
 * HIJRAH TOKO - Supabase Client Config
 * Menggunakan pengecekan bertingkat agar tidak TypeError saat object env belum siap.
 */

// 1. Ambil env dengan cara yang aman (mencegah undefined error)
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

// 2. Deklarasikan variabel secara statis agar Vite bisa melakukan "find and replace"
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 3. Diagnostik & Error Handling (Tanpa merusak jalannya script lain)
if (!supabaseUrl || !supabaseAnonKey) {
    const isFileProtocol = window.location.protocol === 'file:';

    if (isFileProtocol) {
        console.warn("🚨 Akses Lokal: Pastikan menjalankan dengan 'npm run dev'.");
    } else {
        console.group('❌ CONFIGURATION ERROR');
        console.warn("API Key Supabase tidak ditemukan.");
        console.info("Cek GitHub Secrets dan pastikan build di GitHub Actions sukses.");
        console.groupEnd();
    }
}

// 4. Export Client
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;