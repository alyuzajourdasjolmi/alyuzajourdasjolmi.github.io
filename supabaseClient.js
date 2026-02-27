import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

/**
 * HIJRAH TOKO - Supabase Client Config
 * Menggunakan pengecekan safe-access agar tidak crash di browser.
 */

// Gunakan "fallback" objek kosong agar tidak error 'reading properties of undefined'
const env = import.meta.env || {};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Diagnostik & Error Handling
if (!supabaseUrl || !supabaseAnonKey) {
    // Hanya munculkan warning, jangan biarkan aplikasi crash
    console.warn("⚠️ Supabase Credentials tidak ditemukan. Cek GitHub Secrets atau file .env anda.");
}

// Export Client
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;