import { createClient } from '@supabase/supabase-js';

/**
 * Supabase configuration using Vite environment variables.
 * Source code must run through Vite (`npm run dev` / `npm run preview`).
 */
const isViteRuntime = typeof import.meta !== 'undefined' && !!import.meta.env;
const requiredEnvKeys = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];

if (!isViteRuntime) {
    console.group('CRITICAL ERROR: Vite environment not detected');
    console.error("Browser tidak mendeteksi runtime Vite.");
    console.info(
        "Penyebab utama:\n" +
        "- File HTML dibuka langsung (double click / file://)\n" +
        "- Menjalankan source dengan Live Server\n\n" +
        "Solusi:\n" +
        "- Jalankan `npm run dev`\n" +
        "- Buka URL dari terminal, misalnya `http://127.0.0.1:5173`"
    );
    console.groupEnd();
}

const missingEnvKeys = isViteRuntime
    ? requiredEnvKeys.filter((key) => !import.meta.env?.[key])
    : requiredEnvKeys.slice();

if (isViteRuntime && missingEnvKeys.length > 0) {
    console.group('CONFIGURATION ERROR: Missing .env values');
    console.error(`Variabel yang belum diisi: ${missingEnvKeys.join(', ')}`);
    console.info(
        "Langkah perbaikan:\n" +
        "1. Isi semua variabel yang kosong di file `.env`.\n" +
        "2. Simpan perubahan `.env`.\n" +
        "3. Restart Vite: Ctrl+C lalu jalankan `npm run dev` lagi."
    );
    console.groupEnd();
}

const supabaseUrl = isViteRuntime ? import.meta.env.VITE_SUPABASE_URL : null;
const supabaseAnonKey = isViteRuntime ? import.meta.env.VITE_SUPABASE_ANON_KEY : null;

export const supabase = isViteRuntime && missingEnvKeys.length === 0
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
