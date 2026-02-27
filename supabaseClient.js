import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

/**
 * HIJRAH TOKO - Supabase Client Config
 * Menggunakan pemanggilan variabel lingkungan secara statis agar terdeteksi oleh Vite.
 */

// Vite mewajibkan pemanggilan statis (full string) agar bisa di-replace saat build
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Diagnostik & Error Handling
if (!supabaseUrl || !supabaseAnonKey) {
    const isFileProtocol = window.location.protocol === 'file:';

    if (isFileProtocol) {
        console.group('🚨 ERROR: Masalah Akses Lokal');
        console.error("Website dibuka langsung melalui file (file://).");
        console.info("Solusi: Gunakan server lokal (npm run dev).");
        console.groupEnd();
    } else {
        console.group('❌ CONFIGURATION ERROR: Credentials Tidak Terbaca');
        console.warn("API Key Supabase (URL/Key) kosong.");
        console.info("Penyebab Umum:\n1. GitHub Secrets belum diisi dengan nama VITE_SUPABASE_URL\n2. File .yml belum menyertakan ENV saat 'npm run build'");
        console.groupEnd();
    }
}

// Export Client
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;