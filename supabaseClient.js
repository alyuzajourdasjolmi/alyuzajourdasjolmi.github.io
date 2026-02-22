import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Vite akan mengganti nilai ini secara otomatis saat proses 'npm run build'
// Pastikan nama variabel di GitHub Secrets sama persis dengan yang ada di sini
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cek apakah variabel tersedia
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ ERROR: Supabase Credentials tidak ditemukan!");
    console.info("💡 Solusi: Pastikan VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY sudah ada di GitHub Secrets.");
}

// Inisialisasi client
export const supabase = (supabaseUrl && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;