--
-- Table structure for table `boilerplate`
--

DROP TABLE IF EXISTS `boilerplate`;

CREATE TABLE `boilerplate` (
  `boilerplate_id` int NOT NULL AUTO_INCREMENT,
  `verb` varchar(100) DEFAULT '',
  `phrase_object` varchar(100) DEFAULT '',
  `detail` varchar(300) DEFAULT '',
  `requirement_id` int NOT NULL,
  `market_type_id` int NOT NULL,
  PRIMARY KEY (`boilerplate_id`),
  KEY `requirement_id` (`requirement_id`),
  KEY `market_type_id` (`market_type_id`),
  CONSTRAINT `boilerplate_ibfk_1` FOREIGN KEY (`requirement_id`) REFERENCES `requirement` (`requirement_id`) ON DELETE CASCADE,
  CONSTRAINT `boilerplate_ibfk_2` FOREIGN KEY (`market_type_id`) REFERENCES `market_type` (`market_type_id`) ON DELETE CASCADE
);

--
-- Table structure for table `generated_project_available`
--

DROP TABLE IF EXISTS `generated_project_available`;

CREATE TABLE `generated_project_available` (
  `generated_project_available_id` int NOT NULL AUTO_INCREMENT,
  `requirements_url` varchar(250) NOT NULL,
  `market_type_id` int NOT NULL,
  PRIMARY KEY (`generated_project_available_id`),
  UNIQUE KEY `generated_project_available_key` (`market_type_id`),
  CONSTRAINT `generated_project_available_ibfk_1` FOREIGN KEY (`market_type_id`) REFERENCES `market_type` (`market_type_id`) ON DELETE CASCADE
);

--
-- Table structure for table `market_type`
--

DROP TABLE IF EXISTS `market_type`;

CREATE TABLE `market_type` (
  `market_type_id` int NOT NULL AUTO_INCREMENT,
  `market_type_name` varchar(100) NOT NULL,
  PRIMARY KEY (`market_type_id`),
  UNIQUE KEY `market_type_key` (`market_type_name`)
);

--
-- Table structure for table `product_backlog`
--

DROP TABLE IF EXISTS `product_backlog`;

CREATE TABLE `product_backlog` (
  `product_backlog_id` int NOT NULL AUTO_INCREMENT,
  `product_backlog_name` varchar(100) NOT NULL,
  `project_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_backlog_id`),
  UNIQUE KEY `product_backlog_key` (`project_id`,`product_backlog_name`),
  CONSTRAINT `product_backlog_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE
);

--
-- Table structure for table `profile_user`
--

DROP TABLE IF EXISTS `profile_user`;

CREATE TABLE `profile_user` (
  `profile_user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `user_password` varchar(100) NOT NULL,
  `primary_address` text,
  `secundary_address` text,
  `location_code` varchar(20) NOT NULL DEFAULT 'es-pe',
  `location_description` varchar(20) NOT NULL DEFAULT 'Spanish (Peru)',
  `suscribed` tinyint(1) NOT NULL DEFAULT '0',
  `account_status` enum('CREATED','VERIFIED') NOT NULL DEFAULT 'VERIFIED',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `refresh_token` text,
  `test_user` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`profile_user_id`),
  UNIQUE KEY `profile_user_key` (`email`)
);

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;

CREATE TABLE `project` (
  `project_id` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(50) NOT NULL,
  `visibility` enum('PUBLIC','PRIVATE') NOT NULL DEFAULT 'PUBLIC',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `profile_user_id` int NOT NULL,
  `market_type_id` int NOT NULL,
  `template_url` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`project_id`),
  UNIQUE KEY `project_key` (`project_name`),
  KEY `profile_user_id` (`profile_user_id`),
  KEY `market_type_id` (`market_type_id`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`profile_user_id`) REFERENCES `profile_user` (`profile_user_id`) ON DELETE CASCADE,
  CONSTRAINT `project_ibfk_2` FOREIGN KEY (`market_type_id`) REFERENCES `market_type` (`market_type_id`)
);

--
-- Table structure for table `project_employee`
--

DROP TABLE IF EXISTS `project_employee`;

CREATE TABLE `project_employee` (
  `project_employee_id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `profile_user_id` int NOT NULL,
  `project_id` int NOT NULL,
  PRIMARY KEY (`project_employee_id`),
  KEY `profile_user_id` (`profile_user_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_employee_ibfk_1` FOREIGN KEY (`profile_user_id`) REFERENCES `profile_user` (`profile_user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_employee_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE
);

--
-- Table structure for table `project_favorite`
--

DROP TABLE IF EXISTS `project_favorite`;

CREATE TABLE `project_favorite` (
  `project_favorite_id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `profile_user_id` int NOT NULL,
  `project_id` int NOT NULL,
  PRIMARY KEY (`project_favorite_id`),
  KEY `profile_user_id` (`profile_user_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_favorite_ibfk_1` FOREIGN KEY (`profile_user_id`) REFERENCES `profile_user` (`profile_user_id`) ON DELETE CASCADE,
  CONSTRAINT `project_favorite_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE
);

--
-- Table structure for table `project_tag`
--

DROP TABLE IF EXISTS `project_tag`;

CREATE TABLE `project_tag` (
  `project_tag_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`project_tag_id`),
  UNIQUE KEY `project_tag_key` (`project_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `project_tag_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE,
  CONSTRAINT `project_tag_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`tag_id`) ON DELETE CASCADE
);

--
-- Table structure for table `requirement`
--

DROP TABLE IF EXISTS `requirement`;

CREATE TABLE `requirement` (
  `requirement_id` int NOT NULL AUTO_INCREMENT,
  `system_description` varchar(50) NOT NULL,
  `actor_description` varchar(30) NOT NULL,
  `action_description` varchar(500) NOT NULL,
  `requirement_type` enum('FUNCTIONAL','NOT FUNCTIONAL') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `product_backlog_id` int NOT NULL,
  `clean_action_description` varchar(500),
  `popularity` int DEFAULT '1',
  `details_description` varchar(500),
  PRIMARY KEY (`requirement_id`),
  UNIQUE KEY `requirement_key` (`product_backlog_id`,`system_description`,`actor_description`,`action_description`),
  CONSTRAINT `requirement_ibfk_1` FOREIGN KEY (`product_backlog_id`) REFERENCES `product_backlog` (`product_backlog_id`) ON DELETE CASCADE
);

--
-- Table structure for table `requirement_priority`
--

DROP TABLE IF EXISTS `requirement_priority`;

CREATE TABLE `requirement_priority` (
  `requirement_priority_id` int NOT NULL AUTO_INCREMENT,
  `priority_value` varchar(50) NOT NULL,
  `priority_type` varchar(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `profile_user_id` int NOT NULL,
  `requirement_id` int NOT NULL,
  PRIMARY KEY (`requirement_priority_id`),
  UNIQUE KEY `requirement_priority_key` (`profile_user_id`,`requirement_id`,`priority_value`,`priority_type`),
  KEY `requirement_id` (`requirement_id`),
  CONSTRAINT `requirement_priority_ibfk_1` FOREIGN KEY (`requirement_id`) REFERENCES `requirement` (`requirement_id`) ON DELETE CASCADE,
  CONSTRAINT `requirement_priority_ibfk_2` FOREIGN KEY (`profile_user_id`) REFERENCES `profile_user` (`profile_user_id`) ON DELETE CASCADE
);

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;

CREATE TABLE `tag` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `tag_description` varchar(50) NOT NULL,
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `tag_key` (`tag_description`)
);