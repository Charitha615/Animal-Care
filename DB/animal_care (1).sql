-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: animal_care
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,'cha',1,'Dog','sss','Vaccinations','2024-10-27','01:42:00',2,'completed','2024-10-26 20:12:17'),(2,'cus test name',1,'Bird','dsa','Vaccinations','2024-10-27','01:43:00',2,'completed','2024-10-27 04:07:42');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nic` varchar(12) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `phone_no` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (3,'992891722V','string','add',789621706,'string@gmail.com','$2y$10$XWDhckCyisOB6T6rHw6zyOvUlmGj1Zeuwm3adgSJ1aOniAAdDqrfK');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
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
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,'doc@gmail.com','$2y$10$jEnqZFyN8R.HLD6jFkeZUOfLIEPAg4arSNQ2QQ7ZCqcbRnonO3Ysq','update','Male','2024-10-24','2321312','dasd232','dad',8,'dsd','00:01:00','23:45:00','uploads/doctor_images/1729965287_eos-r5-mark-ii_hotspot-module_b2bcadf5c83d441fbbcc89018b3e457c.jpeg'),(2,'doctor@example.com','$2y$10$6ntqpe012a4c0.3c/QHvrOEG6zDL9nIZDbXO5bPuu2mMtZ1b6b8LS','Dr. John Doe','','1980-05-15',' 1234567890',' ML12345',' Cardiology',10,' MBBS, MD',NULL,NULL,''),(3,'doctorss@example.com','$2y$10$U4ArI2iyRmC1gbERfZQaqecV/OXufp6zElMGpprtm9riTSdt1AZMK','Dr. John Doe','','1980-05-15',' 1234567890',' ML123454',' Cardiology',10,' MBBS, MD',NULL,NULL,'uploads/doctor_images/1729972980_360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg'),(4,'das@gmail.com','$2y$10$UKg/Ion3FZ.ZSZ6L0KjAm.Tw8vp.HuTTs0mh4P9xCePVg07Ljb2da','das','Male','2024-11-30','0704068787','asd1234555','asd',23,'dasd',NULL,NULL,'');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emergency_appointments`
--

DROP TABLE IF EXISTS `emergency_appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emergency_appointments` (
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
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_appointments`
--

LOCK TABLES `emergency_appointments` WRITE;
/*!40000 ALTER TABLE `emergency_appointments` DISABLE KEYS */;
INSERT INTO `emergency_appointments` VALUES (1,1,'string','2024-11-13 20:29:58','https://meet.google.com/uvw-xyza-bcd','','Completed',1,'Done','2024-11-13 14:59:58'),(2,2,'string','2023-11-13 20:36:35','https://meet.google.com/klm-nopq-rst','','Completed',1,'Done','2024-11-13 15:06:35'),(3,3,'string','2024-11-13 22:28:34','https://meet.google.com/uvw-xyza-hth','Male','Completed',1,'Done','2024-11-13 16:58:34');
/*!40000 ALTER TABLE `emergency_appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `feedback_type` enum('positive','negative') NOT NULL,
  `comments` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,3,'positive','dasdas','2024-11-11 19:53:13'),(2,3,'positive','dasdas','2024-11-11 19:55:52'),(3,3,'negative','dasdasd','2024-11-11 20:07:27'),(4,3,'negative','dasdadasd','2024-11-13 16:59:26');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiries`
--

DROP TABLE IF EXISTS `inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiries`
--

LOCK TABLES `inquiries` WRITE;
/*!40000 ALTER TABLE `inquiries` DISABLE KEYS */;
INSERT INTO `inquiries` VALUES (1,3,'Charitha','adweb@gmail.com','adsa','das','2024-11-11 19:13:16'),(2,3,'das','adweb@gmail.com','adsa','das','2024-11-11 19:17:25'),(3,3,'Charitha','john.doe@example.com','adsa','das','2024-11-11 19:18:49'),(4,3,'das','adweb@gmail.com','das','das','2024-11-11 19:20:38');
/*!40000 ALTER TABLE `inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pets`
--

DROP TABLE IF EXISTS `pets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pet_name` varchar(255) NOT NULL,
  `breed` varchar(255) NOT NULL,
  `age` int NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pets`
--

LOCK TABLES `pets` WRITE;
/*!40000 ALTER TABLE `pets` DISABLE KEYS */;
INSERT INTO `pets` VALUES (1,'Shaddy','Dog',2,'uploads/pngtree-blue-bird-vector-or-color-illustration-png-image_2013004.jpg','2024-11-10 11:07:48',1),(2,'sample','dog',15,'','2024-11-13 17:07:32',3);
/*!40000 ALTER TABLE `pets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_providers`
--

DROP TABLE IF EXISTS `service_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_providers` (
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
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_providers`
--

LOCK TABLES `service_providers` WRITE;
/*!40000 ALTER TABLE `service_providers` DISABLE KEYS */;
INSERT INTO `service_providers` VALUES (2,'Serv pro','tharaka','piliyandala','0789621706','sp@gmail.com','992891722V','uploads/WhatsApp_Image_2024-10-27_at_00.31.55_e076d18b.jpg','[\"Vaccinations\",\"Doctor channeling\",\"Scanning\"]','$2y$10$SoxWkQC3d35mqSJhtqv2kenaNoIUeYYvT57FQBq/hMC.SK7pHF5ZG','2024-10-26 19:29:07'),(3,'das','das','das','0789621706','das@gmail.com','992891722V','uploads/wallpaperflare.com_wallpaper_(3).jpg','[\"Vaccinations\"]','$2y$10$O/UsoGMeNaIH0UTMbDGkhOpf232A9UTWNd7Za7SpfYI1R3iArRpaO','2024-11-13 14:54:33');
/*!40000 ALTER TABLE `service_providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
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
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vaccinations`
--

DROP TABLE IF EXISTS `vaccinations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vaccinations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pet_id` int NOT NULL,
  `vaccination_name` varchar(255) NOT NULL,
  `vaccination_date` date NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'completed',
  PRIMARY KEY (`id`),
  KEY `pet_id` (`pet_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaccinations`
--

LOCK TABLES `vaccinations` WRITE;
/*!40000 ALTER TABLE `vaccinations` DISABLE KEYS */;
INSERT INTO `vaccinations` VALUES (1,1,'1st dor','2024-11-08','completed'),(2,1,'doos 2','2024-11-11','completed'),(3,2,'non','2024-11-13','completed'),(4,2,'two','2024-11-08','completed'),(5,2,'3wrwes','2024-11-05','upcoming');
/*!40000 ALTER TABLE `vaccinations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-14 16:02:59
