-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 05, 2024 at 04:55 PM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `animal_care`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) NOT NULL,
  `user_id` int DEFAULT NULL,
  `pet_type` varchar(50) NOT NULL,
  `pet_name` varchar(255) NOT NULL,
  `service_type` text NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `service_provider_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) 

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nic` varchar(12) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `phone_no` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) 

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
CREATE TABLE IF NOT EXISTS `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `date_of_birth` date NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `medical_license_number` varchar(100) NOT NULL,
  `specialization` varchar(255) NOT NULL,
  `years_of_experience` int NOT NULL,
  `qualifications` text NOT NULL,
  `available_start_time` time DEFAULT NULL,
  `available_end_time` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `medical_license_number` (`medical_license_number`)
) 

-- --------------------------------------------------------

--
-- Table structure for table `emergency_appointments`
--

DROP TABLE IF EXISTS `emergency_appointments`;
CREATE TABLE IF NOT EXISTS `emergency_appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `appointment_time` datetime NOT NULL,
  `google_meeting_link` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `payment_status` enum('Pending','Completed') NOT NULL,
  `doctor_id` int DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
)

-- --------------------------------------------------------

--
-- Table structure for table `service_providers`
--

DROP TABLE IF EXISTS `service_providers`;
CREATE TABLE IF NOT EXISTS `service_providers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_center_name` varchar(50) NOT NULL,
  `owner_name` varchar(50) NOT NULL,
  `location` varchar(50) NOT NULL,
  `phone_no` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `nic` varchar(12) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `service_types` text NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
)

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
CREATE TABLE IF NOT EXISTS `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `address` varchar(200) NOT NULL,
  `phone_no` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `nic` varchar(12) NOT NULL,
  `age` int DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `service_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) 


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
