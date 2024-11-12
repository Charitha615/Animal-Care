

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
  `status` varchar(50) NOT NULL DEFAULT 'not_completed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
); 

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `customer_name`, `user_id`, `pet_type`, `pet_name`, `service_type`, `appointment_date`, `appointment_time`, `service_provider_id`, `status`, `created_at`) VALUES
(1, 'cha', 1, 'Dog', 'sss', 'Vaccinations', '2024-10-27', '01:42:00', 2, 'completed', '2024-10-26 20:12:17'),
(2, 'cus test name', 1, 'Bird', 'dsa', 'Vaccinations', '2024-10-27', '01:43:00', 2, 'completed', '2024-10-27 04:07:42');

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
);

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `nic`, `customer_name`, `address`, `phone_no`, `email`, `password`) VALUES
(1, '22', 'dasdas', 'dasdas', 232, 'dasdas', 'dsa'),
(3, '992891722V', 'string', 'add', 789621706, 'string@gmail.com', '$2y$10$XWDhckCyisOB6T6rHw6zyOvUlmGj1Zeuwm3adgSJ1aOniAAdDqrfK');

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
  `profile_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `medical_license_number` (`medical_license_number`)
); 

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `email`, `password`, `full_name`, `gender`, `date_of_birth`, `phone_number`, `medical_license_number`, `specialization`, `years_of_experience`, `qualifications`, `available_start_time`, `available_end_time`, `profile_image`) VALUES
(1, 'doc@gmail.com', '$2y$10$jEnqZFyN8R.HLD6jFkeZUOfLIEPAg4arSNQ2QQ7ZCqcbRnonO3Ysq', 'update', 'Male', '2024-10-24', '2321312', 'dasd232', 'dad', 8, 'dsd', '00:01:00', '23:45:00', 'uploads/doctor_images/1729965287_eos-r5-mark-ii_hotspot-module_b2bcadf5c83d441fbbcc89018b3e457c.jpeg'),
(2, 'doctor@example.com', '$2y$10$6ntqpe012a4c0.3c/QHvrOEG6zDL9nIZDbXO5bPuu2mMtZ1b6b8LS', 'Dr. John Doe', '', '1980-05-15', ' 1234567890', ' ML12345', ' Cardiology', 10, ' MBBS, MD', NULL, NULL, ''),
(3, 'doctorss@example.com', '$2y$10$U4ArI2iyRmC1gbERfZQaqecV/OXufp6zElMGpprtm9riTSdt1AZMK', 'Dr. John Doe', '', '1980-05-15', ' 1234567890', ' ML123454', ' Cardiology', 10, ' MBBS, MD', NULL, NULL, 'uploads/doctor_images/1729972980_360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg');

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
); 

--
-- Dumping data for table `emergency_appointments`
--

INSERT INTO `emergency_appointments` (`id`, `user_id`, `customer_name`, `appointment_time`, `google_meeting_link`, `gender`, `payment_status`, `doctor_id`, `status`, `created_at`) VALUES
(1, 1, 'Test  user', '2024-10-25 23:28:00', 'https://meet.google.com/tqe-gzex-gxv', 'Male', 'Completed', 1, 'Done', '2024-10-25 17:58:00'),
(2, 1, 'Test  user', '2024-10-26 00:40:14', '', '', 'Completed', 1, 'Done', '2024-10-25 19:10:14'),
(3, 1, 'Test  user', '2024-10-26 00:41:25', '', '', 'Completed', 1, 'Done', '2024-10-25 19:11:25'),
(4, 1, 'Test  user', '2024-10-26 00:41:58', '', '', 'Completed', 1, 'Done', '2024-10-25 19:11:58'),
(5, 1, 'Test  user', '2024-10-26 00:49:08', '', '', 'Completed', 1, 'Done', '2024-10-25 19:19:08'),
(6, 1, 'Test  user', '2024-10-26 00:50:00', '', '', 'Completed', 1, 'Done', '2024-10-25 19:20:00'),
(7, 1, 'Test  user', '2024-10-26 00:50:59', '', '', 'Completed', 1, 'Done', '2024-10-25 19:20:59'),
(8, 1, 'Test  user', '2024-10-26 00:51:41', '', '', 'Completed', 1, 'Done', '2024-10-25 19:21:41'),
(9, 1, 'Test  user', '2024-10-26 00:52:46', '', '', 'Completed', 1, 'Done', '2024-10-25 19:22:46'),
(10, 1, 'Test  user', '2024-10-26 00:53:00', '', '', 'Completed', 1, 'Done', '2024-10-25 19:23:00'),
(11, 1, 'Test  user', '2024-10-26 00:54:34', '', '', 'Completed', 1, 'Done', '2024-10-25 19:24:34'),
(12, 1, 'Test  user', '2024-10-26 22:54:38', 'https://meet.google.com/klm-nopq-rst', '', 'Completed', 1, 'Done', '2024-10-26 17:24:38'),
(13, 1, 'Test  user', '2024-10-26 23:01:40', 'https://meet.google.com/klm-nopq-rst', '', 'Completed', 1, 'Done', '2024-10-26 17:31:40'),
(14, 1, 'Test  user', '2024-10-26 23:01:59', 'https://meet.google.com/klm-nopq-rst', '', 'Completed', 1, 'Done', '2024-10-26 17:31:59'),
(15, 1, 'Test  user', '2024-10-26 23:02:50', 'https://meet.google.com/uvw-xyza-abc', '', 'Completed', 1, 'Done', '2024-10-26 17:32:50'),
(16, 1, 'Test  user', '2024-10-26 23:03:00', 'https://meet.google.com/uvw-xyza-2es', '', 'Completed', 1, 'Done', '2024-10-26 17:33:00');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE IF NOT EXISTS `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `feedback_type` enum('positive','negative') NOT NULL,
  `comments` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `user_id`, `feedback_type`, `comments`, `created_at`) VALUES
(1, 3, 'positive', 'dasdas', '2024-11-11 19:53:13'),
(2, 3, 'positive', 'dasdas', '2024-11-11 19:55:52'),
(3, 3, 'negative', 'dasdasd', '2024-11-11 20:07:27');

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

DROP TABLE IF EXISTS `inquiries`;
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ;

--
-- Dumping data for table `inquiries`
--

INSERT INTO `inquiries` (`id`, `user_id`, `name`, `email`, `subject`, `message`, `created_at`) VALUES
(1, 3, 'Charitha', 'adweb@gmail.com', 'adsa', 'das', '2024-11-11 19:13:16'),
(2, 3, 'das', 'adweb@gmail.com', 'adsa', 'das', '2024-11-11 19:17:25'),
(3, 3, 'Charitha', 'john.doe@example.com', 'adsa', 'das', '2024-11-11 19:18:49'),
(4, 3, 'das', 'adweb@gmail.com', 'das', 'das', '2024-11-11 19:20:38');

-- --------------------------------------------------------

--
-- Table structure for table `pets`
--

DROP TABLE IF EXISTS `pets`;
CREATE TABLE IF NOT EXISTS `pets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pet_name` varchar(255) NOT NULL,
  `breed` varchar(255) NOT NULL,
  `age` int NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `pets`
--

INSERT INTO `pets` (`id`, `pet_name`, `breed`, `age`, `image_path`, `created_at`, `user_id`) VALUES
(1, 'Shaddy', 'Dog', 2, 'uploads/pngtree-blue-bird-vector-or-color-illustration-png-image_2013004.jpg', '2024-11-10 11:07:48', 1);

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
);

--
-- Dumping data for table `service_providers`
--

INSERT INTO `service_providers` (`id`, `service_center_name`, `owner_name`, `location`, `phone_no`, `email`, `nic`, `image`, `service_types`, `password`, `created_at`) VALUES
(2, 'Serv pro', 'tharaka', 'piliyandala', '0789621706', 'sp@gmail.com', '992891722V', 'uploads/WhatsApp_Image_2024-10-27_at_00.31.55_e076d18b.jpg', '[\"Vaccinations\",\"Doctor channeling\",\"Scanning\"]', '$2y$10$SoxWkQC3d35mqSJhtqv2kenaNoIUeYYvT57FQBq/hMC.SK7pHF5ZG', '2024-10-26 19:29:07');

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
) ;

-- --------------------------------------------------------

--
-- Table structure for table `vaccinations`
--

DROP TABLE IF EXISTS `vaccinations`;
CREATE TABLE IF NOT EXISTS `vaccinations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pet_id` int NOT NULL,
  `vaccination_name` varchar(255) NOT NULL,
  `vaccination_date` date NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'completed',
  PRIMARY KEY (`id`),
  KEY `pet_id` (`pet_id`)
);

--
-- Dumping data for table `vaccinations`
--

INSERT INTO `vaccinations` (`id`, `pet_id`, `vaccination_name`, `vaccination_date`, `status`) VALUES
(1, 1, '1st dor', '2024-11-08', 'completed'),
(2, 1, 'doos 2', '2024-11-11', 'completed');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
