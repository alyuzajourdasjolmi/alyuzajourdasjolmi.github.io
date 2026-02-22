import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

/**
 * HIJRAH TOKO - Supabase Client Config
 * Menggunakan sistem 'Safe Environment' agar tidak crash di kondisi apapun.
 */

// Helper: Mengambil variabel lingkungan dengan aman
const getEnv = (key) => {
    try {
        // Cek apakah sistem modern (Vite) tersedia
        if (typeof import.meta !== 'undefined' && import.meta.env) {
            return import.meta.env[key];
        }
    } catch (e) {
        // Abaikan error jika akses dilarang/tidak didukung
    }
    return null;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Diagnostik & Error Handling
if (!supabaseUrl || !supabaseAnonKey) {
    const isFileProtocol = window.location.protocol === 'file:';

    if (isFileProtocol) {
        console.group('🚨 ERROR: Masalah Akses Lokal');
        console.error("Website dibuka langsung melalui file (file://).");
        console.info("Solusi: Kamu HARUS membuka alamat http://localhost:5173 atau http://127.0.0.1:5173 yang ada di terminal.");
        console.groupEnd();
    } else {
        console.group('❌ CONFIGURATION ERROR: Credentials Tidak Terbaca');
        console.warn("API Key Supabase (URL/Key) kosong.");
        console.info("Jika di Local: Restart terminal 'npm run dev'.\nJika di GitHub: Isi Repository Secrets.");
        console.groupEnd();
    }
}

// Export Client (Null jika tidak ada config agar tidak crash di script lain)
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
