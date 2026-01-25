-- Database: `hijrah_toko`

CREATE DATABASE IF NOT EXISTS `hijrah_toko`;
USE `hijrah_toko`;

-- Table structure for table `products`
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` varchar(50) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `products`
INSERT INTO `products` (`name`, `price`, `image`, `category`) VALUES
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

-- Table structure for table `users`
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `users`
-- Default Admin: admin@hijrahtoko.com / admin123
INSERT INTO `users` (`email`, `password`) VALUES
('admin@hijrahtoko.com', 'admin123');

-- Table structure for table `events`
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `event_day` int(2) NOT NULL,
  `event_month` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `events`
INSERT INTO `events` (`title`, `description`, `event_day`, `event_month`) VALUES
('Pasar Murah Awal Tahun', 'Dapatkan diskon spesial untuk pembelian paket sembako. Jangan lewatkan kesempatan ini!', 25, 'Jan'),
('Jumat Berkah', 'Berbagi makanan gratis setiap hari Jumat untuk yang membutuhkan di depan toko.', 2, 'Feb');
