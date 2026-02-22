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
    console.group("❌ CONFIGURATION ERROR: Supabase Credentials Tidak Ditemukan!");
    console.error("Aplikasi tidak bisa terhubung ke database karena API Key kosong.");
    console.info(
        "💡 LANGKAH PERBAIKAN:\n" +
        "1. PASTIKAN kamu menjalankan project dengan perintah: 'npm run dev'\n" +
        "2. RESTART SERVER: Hentikan terminal (Ctrl+C) lalu jalankan lagi 'npm run dev' agar file .env dibaca ulang.\n" +
        "3. CEK FILENAME: Pastikan nama file adalah '.env' (titik di depan, tanpa akhiran .txt).\n" +
        "4. GITHUB DEPLOY: Jika ini muncul di website yang sudah live, pastikan kamu sudah mengisi 'Repository Secrets' di Settings GitHub."
    );
    console.groupEnd();
}

// Inisialisasi client. Jika credential tidak ada, bernilai null agar tidak crash.
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;