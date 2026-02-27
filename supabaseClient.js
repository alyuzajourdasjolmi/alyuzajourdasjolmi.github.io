import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

/**
 * HIJRAH TOKO - Supabase Client Config
 * Menggunakan pengecekan opsional agar tidak crash jika import.meta tidak tersedia.
 */

// Gunakan optional chaining (?.) untuk mencegah error "undefined"
const supabaseUrl = import.meta?.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta?.env?.VITE_SUPABASE_ANON_KEY;

// Diagnostik & Error Handling
if (!supabaseUrl || !supabaseAnonKey) {
    console.group('❌ CONFIGURATION ERROR');
    console.warn("API Key Supabase tidak terbaca.");
    console.info("Pastikan kamu menjalankan aplikasi dengan 'npm run dev' atau melalui build GitHub Actions.");
    console.groupEnd();
}

// Export Client
// Pastikan tidak mencoba membuat client jika URL tidak ada
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;