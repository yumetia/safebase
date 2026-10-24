-- MySQL dump 10.13  Distrib 8.4.11, for Linux (aarch64)
--
-- Host: localhost    Database: safebase
-- ------------------------------------------------------
-- Server version	8.4.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `backup`
--

DROP TABLE IF EXISTS `backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backup` (
  `id` int NOT NULL AUTO_INCREMENT,
  `database_id` int NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `status` enum('success','failed') NOT NULL,
  `triggered_by` enum('manual','schedule') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `database_id` (`database_id`),
  CONSTRAINT `backup_ibfk_1` FOREIGN KEY (`database_id`) REFERENCES `database` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backup`
--

LOCK TABLES `backup` WRITE;
/*!40000 ALTER TABLE `backup` DISABLE KEYS */;
INSERT INTO `backup` VALUES (1,1,'/app/backups/test_2026-10-24T14-38-00-020Z.sql','success','schedule','2026-10-24 14:38:00'),(2,1,'/app/backups/test_2026-10-24T14-39-00-021Z.sql','success','schedule','2026-10-24 14:39:00'),(3,1,'/app/backups/test_2026-10-24T14-40-00-008Z.sql','success','schedule','2026-10-24 14:40:00'),(4,1,'/app/backups/test_2026-10-24T14-41-00-018Z.sql','success','schedule','2026-10-24 14:41:00'),(5,1,'/app/backups/test_2026-10-24T14-43-00-026Z.sql','success','schedule','2026-10-24 14:43:00'),(6,1,'/app/backups/test_2026-10-24T14-44-00-013Z.sql','success','schedule','2026-10-24 14:44:00'),(7,1,'/app/backups/test_2026-10-24T14-45-00-034Z.sql','success','schedule','2026-10-24 14:45:00');
/*!40000 ALTER TABLE `backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `database`
--

DROP TABLE IF EXISTS `database`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `database` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` enum('mysql','postgres') NOT NULL,
  `host` varchar(255) NOT NULL,
  `port` int NOT NULL,
  `db_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `database`
--

LOCK TABLES `database` WRITE;
/*!40000 ALTER TABLE `database` DISABLE KEYS */;
INSERT INTO `database` VALUES (1,'test','mysql','mysql',3306,'safebase','root','root','2026-10-24 12:27:13');
/*!40000 ALTER TABLE `database` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `backup_id` int NOT NULL,
  `action` enum('backup','restore') NOT NULL,
  `level` enum('info','warning','error') NOT NULL,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `backup_id` (`backup_id`),
  CONSTRAINT `log_ibfk_1` FOREIGN KEY (`backup_id`) REFERENCES `backup` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
INSERT INTO `log` VALUES (1,1,'backup','info','Scheduled backup created: test_2026-10-24T14-38-00-020Z.sql','2026-10-24 14:38:00'),(2,2,'backup','info','Scheduled backup created: test_2026-10-24T14-39-00-021Z.sql','2026-10-24 14:39:00'),(3,3,'backup','info','Scheduled backup created: test_2026-10-24T14-40-00-008Z.sql','2026-10-24 14:40:00'),(4,4,'backup','info','Scheduled backup created: test_2026-10-24T14-41-00-018Z.sql','2026-10-24 14:41:00'),(5,5,'backup','info','Scheduled backup created: test_2026-10-24T14-43-00-026Z.sql','2026-10-24 14:43:00'),(6,6,'backup','info','Scheduled backup created: test_2026-10-24T14-44-00-013Z.sql','2026-10-24 14:44:00'),(7,7,'backup','info','Scheduled backup created: test_2026-10-24T14-45-00-034Z.sql','2026-10-24 14:45:00');
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `database_id` int NOT NULL,
  `cron_expression` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `next_run_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `database_id` (`database_id`),
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`database_id`) REFERENCES `database` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,1,'* * * * *',1,'2026-10-24 14:45:00','2026-10-24 12:27:13');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-24 14:46:00
