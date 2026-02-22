# HIJRAH TOKO - Vite + Supabase + GitHub Pages

Landing page untuk toko, dengan halaman admin untuk login dan mengelola data produk serta event melalui Supabase.

## Runtime yang didukung

- Development source: Vite (`npm run dev`)
- Production/deploy: hasil build `dist` ke GitHub Pages

Source project ini tidak dirancang untuk dibuka langsung via `file://` atau Live Server.

## Setup lokal

1. Install dependency:

```bash
npm install
```

2. Buat file `.env` dari contoh:

```bash
# PowerShell (Windows)
Copy-Item .env.example .env

# Bash/macOS/Linux
cp .env.example .env
```

3. Isi `.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Jalankan development server:

```bash
npm run dev
```

5. Buka URL dari terminal (contoh: `http://127.0.0.1:5173`).

## Build dan preview

```bash
npm run build
npm run preview
```

## Deploy ke GitHub Pages

Deployment otomatis berjalan dari workflow `.github/workflows/deploy.yml` saat push ke branch `main`.

Wajib set Secrets repository:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Workflow akan gagal otomatis jika salah satu secret kosong.

## Catatan keamanan

- `.env` hanya untuk lokal, jangan di-commit.
- `VITE_SUPABASE_ANON_KEY` adalah public anon key untuk client app.
