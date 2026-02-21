import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Professional Environment Handling
// Memastikan aplikasi tidak crash jika dijalankan tanpa Vite (misal lewat Live Server atau File System)
const getEnv = (key) => {
    try {
        // Cek apakah import.meta.env tersedia (Vite context)
        if (typeof import.meta !== 'undefined' && import.meta.env) {
            return import.meta.env[key];
        }
    } catch (e) {
        // Fallback jika import.meta tidak didukung atau error
    }
    return null;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Inisialisasi Client hanya jika credential tersedia
// Jika tidak, kita ekspor dummy atau biarkan admin.js menangani errornya lewat UI
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabase) {
    console.warn("⚠️ Supabase Client tidak terinisialisasi: Credential (URL/Key) tidak ditemukan.");
    console.info("💡 Pastikan kamu menjalankan project menggunakan 'npm run dev' dan file .env sudah dikonfigurasi.");
}
