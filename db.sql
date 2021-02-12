-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 12 Feb 2021 pada 07.37
-- Versi server: 10.4.11-MariaDB
-- Versi PHP: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bcc`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `invoice_id` varchar(255) CHARACTER SET utf8 NOT NULL,
  `item` varchar(255) CHARACTER SET utf8 NOT NULL,
  `amount` int(11) NOT NULL,
  `is_credit` tinyint(1) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `invoices`
--

INSERT INTO `invoices` (`id`, `invoice_id`, `item`, `amount`, `is_credit`, `created_at`, `updated_at`, `deleted_at`, `user_id`) VALUES
(2, '139279', 'Add Balance', 20000, 1, '2021-02-11 13:58:35.529', '2021-02-11 13:58:35.529', NULL, 31),
(3, '868865', 'Add Balance', 2000, 1, '2021-02-11 14:08:30.287', '2021-02-11 14:08:30.287', NULL, 31),
(4, '447339', 'Add Balance', 1, 1, '2021-02-11 14:13:37.760', '2021-02-11 14:13:37.760', NULL, 31),
(5, '889532', 'Add Balance', 12, 1, '2021-02-11 14:19:42.285', '2021-02-11 14:19:42.285', NULL, 25),
(6, '944784', 'Add Balance', 20000, 1, '2021-02-11 15:43:49.868', '2021-02-11 15:43:49.868', NULL, 31),
(7, '958281', 'Add Balance', 20000, 1, '2021-02-11 15:44:07.944', '2021-02-11 15:44:07.944', NULL, 31),
(8, '891542', 'Add Balance', 20000, 1, '2021-02-11 19:11:15.678', '2021-02-11 19:11:15.678', NULL, 31),
(9, '828777', 'Add Balance', 20000, 1, '2021-02-11 19:11:20.900', '2021-02-11 19:11:20.900', NULL, 31),
(10, '621371', 'Add Balance', 20000, 1, '2021-02-11 19:12:25.230', '2021-02-11 19:12:25.230', NULL, 31),
(11, '366137', 'Add Balance', 20000, 1, '2021-02-12 00:26:32.454', '2021-02-12 00:26:32.454', NULL, 34),
(12, '233559', 'Add Balance', 1, 1, '2021-02-12 00:33:26.710', '2021-02-12 00:33:26.710', NULL, 34),
(13, '299269', 'Add Balance', 10000, 1, '2021-02-12 00:33:47.873', '2021-02-12 00:33:47.873', NULL, 34),
(14, '365139', 'Entered Banana Boat', 30000, 0, '2021-02-12 00:33:52.341', '2021-02-12 00:33:52.341', NULL, 34),
(15, '228847', 'Entered Banana Boat', 30000, 0, '2021-02-12 00:36:11.121', '2021-02-12 00:36:11.121', NULL, 34),
(16, '516726', 'Add Balance', 20000, 1, '2021-02-12 00:52:15.088', '2021-02-12 00:52:15.088', NULL, 31),
(17, '888783', 'Add Balance', 20000, 1, '2021-02-12 00:52:34.159', '2021-02-12 00:52:34.159', NULL, 35),
(18, '326227', 'Entered Banana Boat', 30000, 0, '2021-02-12 01:09:46.932', '2021-02-12 01:09:46.932', NULL, 35);

-- --------------------------------------------------------

--
-- Struktur dari tabel `parks`
--

CREATE TABLE `parks` (
  `id` int(11) NOT NULL,
  `park_id` varchar(255) CHARACTER SET utf8 NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `price` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `minimum_height` int(11) DEFAULT NULL,
  `seat_available` int(11) DEFAULT NULL,
  `desc` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `parks`
--

INSERT INTO `parks` (`id`, `park_id`, `name`, `price`, `created_at`, `updated_at`, `deleted_at`, `minimum_height`, `seat_available`, `desc`) VALUES
(1, '241297', 'Snake Coaster', 50000, '2021-02-10 19:51:26', '2021-02-10 21:13:35', NULL, 130, 15, 'One of the extreme rides that will be a favorite of Friends of BCC Adventure Park has launched, namely Snake Coaster.\r\nSnake Coaster is one of the longest rides in Indonesia, with a height of 22 meters and a track length of 535 meters.\r\nFriends of BCC Adventure Park will have an adrenaline rush at a speed of 65 km / hour.\r\nSnake Coaster is located in the Mysteria Zone, for adults with a minimum height of 130 cm, it is not intended if you have a history of heart disease, hypertension, a history of vertebral & neck fractures or are pregnant.'),
(2, '196486', 'Mega Drop', 50000, '2021-02-10 21:23:31', '2021-02-10 21:27:07', '2021-02-10 21:28:00', 135, 20, 'A vehicle that really challenges your guts. They rise high and fall from a height of 38 meters!'),
(3, '675527', 'Banana Boat', 30000, '2021-02-11 19:58:26', '2021-02-11 20:03:08', NULL, 130, 5, 'Ini rame banget sumpah.'),
(4, '657845', 'Paralayang', 100000, '2021-02-12 01:37:05', '2021-02-12 01:43:55', '2021-02-12 01:57:18', 130, 1, 'Ini rame jugaa wajib coba pokoknya titik.');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 NOT NULL,
  `pin` int(11) NOT NULL,
  `balance` int(11) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `identifier`, `name`, `email`, `pin`, `balance`, `created_at`, `updated_at`, `deleted_at`, `role`) VALUES
(25, '424887', 'Asep Dingdong', 'ad@gmail.com', 123456, 75012, '2021-02-09 21:33:29.000', '2021-02-11 14:19:42.286', NULL, 'visitor'),
(30, '232455', 'rakhmad', 'm@gmail.com', 123456, 20000, '2021-02-10 15:40:01.000', '2021-02-10 15:50:16.000', '2021-02-10 19:18:53.000', 'visitor'),
(31, '866785', 'Gill Bates', 'g@gmail.com', 123456, 1020000, '2021-02-10 16:01:21.000', '2021-02-12 00:52:15.090', NULL, 'admin'),
(32, '562758', 'Rheza Firmanda', 'rf@gmail.com', 123456, 0, '2021-02-11 19:20:16.898', '2021-02-11 19:20:16.898', '2021-02-11 19:21:11.576', ''),
(34, '425876', 'Andira MS', 'ams@gmail.com', 123455, 1, '2021-02-11 23:37:19.465', '2021-02-12 00:36:11.127', NULL, ''),
(35, '628335', 'Night Clawer', 'nc@gmail.com', 123456, 0, '2021-02-12 00:46:46.191', '2021-02-12 01:09:46.933', '2021-02-12 01:32:02.018', 'visitor'),
(36, '569861', 'Your Name', 'your@gmail.com', 123456, 0, '2021-02-12 02:18:11.850', '2021-02-12 02:18:11.850', NULL, 'visitor');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_users_invoices` (`user_id`),
  ADD KEY `idx_invoices_deleted_at` (`deleted_at`);

--
-- Indeks untuk tabel `parks`
--
ALTER TABLE `parks`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_users_deleted_at` (`deleted_at`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `parks`
--
ALTER TABLE `parks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `fk_users_invoices` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
