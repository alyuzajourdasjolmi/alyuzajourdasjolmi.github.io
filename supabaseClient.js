import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

/**
 * Konfigurasi Supabase menggunakan Environment Variables dari Vite.
 * Pastikan variabel diawali dengan VITE_ agar bisa terbaca.
 */

// Menggunakan ?. untuk mencegah crash jika import.meta.env belum terdefinisi
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

// Logika pengecekan untuk membantu debugging
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ ERROR: Supabase Credentials tidak ditemukan!");
    console.info(
        "💡 Solusi:\n" +
        "1. Lokal: Pastikan file .env ada dan berisi VITE_SUPABASE_URL.\n" +
        "2. GitHub: Pastikan sudah mengisi Secrets di Settings > Secrets > Actions.\n" +
        "3. Pastikan menjalankan project dengan perintah 'npm run dev'."
    );
}

// Inisialisasi client. Jika credential tidak ada, bernilai null agar tidak crash.
export const supabase = (supabaseUrl && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;