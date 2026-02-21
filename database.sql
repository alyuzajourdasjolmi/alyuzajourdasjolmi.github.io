-- ============================================
-- Supabase SQL Setup untuk HIJRAH TOKO
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================

-- Table: products
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  image VARCHAR(255) DEFAULT NULL,
  category VARCHAR(100) NOT NULL
);

-- Table: events
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date_display VARCHAR(50) NOT NULL,  -- e.g. "25 Jan"
  description TEXT
);

-- Table: carousel
CREATE TABLE IF NOT EXISTS carousel (
  id BIGSERIAL PRIMARY KEY,
  image VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NOT NULL
);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ: Semua orang bisa membaca data (untuk halaman utama)
CREATE POLICY "Public read products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Public read events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Public read carousel" ON carousel
  FOR SELECT USING (true);

-- AUTHENTICATED WRITE: Hanya user yang sudah login bisa insert/update/delete
CREATE POLICY "Auth insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete products" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert events" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update events" ON events
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete events" ON events
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert carousel" ON carousel
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update carousel" ON carousel
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete carousel" ON carousel
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- Seed Data (Optional — Hapus jika tidak perlu)
-- ============================================

-- Seed Products
INSERT INTO products (name, price, image, category) VALUES
('Buku Tulis Sidu', 'Rp 3.000', 'SIDU BC-01.jpg', 'Alat Tulis'),
('Buku Tulis Kiky', 'Rp 6.000', 'prod-stationery.png', 'Alat Tulis'),
('Pulpen Standard', 'Rp 3.000', 'penastandar.jpg', 'Alat Tulis'),
('Pulpen Gel', 'Rp 5.000', 'prod-stationery.png', 'Alat Tulis'),
('Pensil 2B', 'Rp 4.000', 'prod-stationery.png', 'Alat Tulis'),
('Penghapus', 'Rp 2.000', 'prod-stationery.png', 'Alat Tulis'),
('Penggaris 30cm', 'Rp 3.000', 'prod-stationery.png', 'Alat Tulis'),
('Tipe-X', 'Rp 5.000', 'prod-stationery.png', 'Alat Tulis'),
('Kertas HVS A4 (Rim)', 'Rp 55.000', 'prod-stationery.png', 'Alat Tulis'),
('Lem Kertas', 'Rp 3.000', 'prod-stationery.png', 'Alat Tulis'),
('Nugget Ayam Toraduo', 'Rp 25.000', 'NUGGET_AYAM_TORADUO.PNG', 'Frozen Food'),
('Sosis', 'Rp 30.000', 'prod-frozen.png', 'Frozen Food'),
('Sosis Ayam', 'Rp 25.000', 'sosis.png', 'Frozen Food'),
('Sosis Sapi', 'Rp 20.000', 'prod-frozen.png', 'Frozen Food'),
('Bakso Sapi', 'Rp 35.000', 'prod-frozen.png', 'Frozen Food'),
('Kentang Goreng', 'Rp 28.000', 'prod-frozen.png', 'Frozen Food'),
('Dimsum (isi 12)', 'Rp 35.000', 'prod-frozen.png', 'Frozen Food'),
('Cireng Bulat Merah', 'Rp 6.000', 'cirengmerah.png', 'Frozen Food'),
('Keripik Singkong', 'Rp 10.000', 'prod-stationery.png', 'Snack & Minuman'),
('Wafer', 'Rp 8.000', 'prod-stationery.png', 'Snack & Minuman'),
('Minuman Teh', 'Rp 4.000', 'prod-stationery.png', 'Snack & Minuman'),
('Es Krim', 'Rp 5.000', 'prod-frozen.png', 'Snack & Minuman');

-- Seed Events
INSERT INTO events (title, date_display, description) VALUES
('Pasar Murah Awal Tahun', '25 Jan', 'Dapatkan diskon spesial untuk pembelian paket sembako.'),
('Jumat Berkah', '02 Feb', 'Berbagi makanan gratis setiap hari Jumat untuk yang membutuhkan.');

-- Seed Carousel
INSERT INTO carousel (image, title, subtitle) VALUES
('hero-image-v3.png', 'Selamat Datang di HIJRAH TOKO', 'Pusat Alat Tulis & Frozen Food Terlengkap'),
('prod-frozen.png', 'Promo Spesial Minggu Ini', 'Dapatkan harga terbaik untuk kebutuhan harianmu.'),
('prod-stationery.png', 'Belanja Mudah & Hemat', 'Solusi lengkap untuk rumah tangga Anda.');
