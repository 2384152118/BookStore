-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        5.5.25 - MySQL Community Server (GPL)
-- 服务器操作系统:                      Win32
-- HeidiSQL 版本:                  9.5.0.5220
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- 导出 bookstore 的数据库结构
CREATE DATABASE IF NOT EXISTS `bookstore` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `bookstore`;

-- 导出  表 bookstore.admin 结构
CREATE TABLE IF NOT EXISTS `admin` (
  `adminid` int(3) NOT NULL AUTO_INCREMENT,
  `adminname` char(16) DEFAULT NULL,
  `adminpassword` char(16) DEFAULT NULL,
  PRIMARY KEY (`adminid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- 正在导出表  bookstore.admin 的数据：~3 rows (大约)
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` (`adminid`, `adminname`, `adminpassword`) VALUES
	(1, '管理员1', '123456'),
	(2, '管理员2', '123456'),
	(3, '管理员3', '123456');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;

-- 导出  表 bookstore.author 结构
CREATE TABLE IF NOT EXISTS `author` (
  `aid` int(3) NOT NULL AUTO_INCREMENT COMMENT '作者id',
  `aname` char(16) NOT NULL COMMENT '笔名',
  `apassword` char(16) NOT NULL COMMENT '作者密码',
  `atel` char(11) NOT NULL COMMENT '作者手机号',
  `aemail` char(16) NOT NULL COMMENT '作者邮箱',
  `uid` int(3) DEFAULT NULL COMMENT '用户id',
  `username` char(16) DEFAULT NULL COMMENT '作者用户名',
  PRIMARY KEY (`aid`),
  KEY `uid` (`uid`),
  KEY `username` (`username`),
  KEY `aname` (`aname`),
  CONSTRAINT `username` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `uid` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  bookstore.author 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `author` DISABLE KEYS */;
/*!40000 ALTER TABLE `author` ENABLE KEYS */;

-- 导出  表 bookstore.novel 结构
CREATE TABLE IF NOT EXISTS `novel` (
  `nid` int(3) NOT NULL AUTO_INCREMENT COMMENT '小说id',
  `nname` char(16) DEFAULT NULL COMMENT '小说名称',
  `noveltype` char(16) DEFAULT NULL COMMENT '小说类型',
  `keywords` char(16) DEFAULT NULL COMMENT '关键字',
  `sectionnum` char(16) DEFAULT NULL COMMENT '章节字数',
  `info` text COMMENT '简介',
  `ndatetime` datetime DEFAULT NULL COMMENT '建立时间',
  `nwordnum` char(10) DEFAULT NULL COMMENT '小说总字数默认为0',
  `serial` int(1) DEFAULT NULL COMMENT '默认0  连载',
  `aid` int(10) DEFAULT NULL COMMENT '作者id ',
  `aname` char(16) DEFAULT NULL COMMENT '作者笔名',
  PRIMARY KEY (`nid`),
  KEY `aid` (`aid`),
  KEY `aname` (`aname`),
  KEY `nname` (`nname`),
  CONSTRAINT `aid` FOREIGN KEY (`aid`) REFERENCES `author` (`aid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `aname` FOREIGN KEY (`aname`) REFERENCES `author` (`aname`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  bookstore.novel 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `novel` DISABLE KEYS */;
/*!40000 ALTER TABLE `novel` ENABLE KEYS */;

-- 导出  表 bookstore.section 结构
CREATE TABLE IF NOT EXISTS `section` (
  `sid` int(3) NOT NULL AUTO_INCREMENT,
  `sname` char(16) DEFAULT NULL,
  `sortnum` int(3) DEFAULT NULL,
  `swordnum` char(10) DEFAULT NULL,
  `sdatetime` date DEFAULT NULL,
  `text` text,
  `aid` int(3) DEFAULT NULL,
  `aname` char(16) DEFAULT NULL,
  `nid` int(3) DEFAULT NULL,
  `nname` char(16) DEFAULT NULL,
  PRIMARY KEY (`sid`),
  KEY `aid` (`aid`),
  KEY `nid` (`nid`),
  KEY `aname` (`aname`),
  KEY `nname` (`nname`),
  CONSTRAINT `section_ibfk_1` FOREIGN KEY (`aid`) REFERENCES `author` (`aid`),
  CONSTRAINT `section_ibfk_2` FOREIGN KEY (`nid`) REFERENCES `novel` (`nid`),
  CONSTRAINT `section_ibfk_3` FOREIGN KEY (`aname`) REFERENCES `author` (`aname`),
  CONSTRAINT `section_ibfk_4` FOREIGN KEY (`nname`) REFERENCES `novel` (`nname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  bookstore.section 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `section` DISABLE KEYS */;
/*!40000 ALTER TABLE `section` ENABLE KEYS */;

-- 导出  表 bookstore.user 结构
CREATE TABLE IF NOT EXISTS `user` (
  `uid` int(3) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` char(16) DEFAULT NULL COMMENT '用户名',
  `upasswd` char(16) DEFAULT NULL COMMENT '用户密码',
  `utel` char(11) DEFAULT NULL COMMENT '用户手机号',
  `img` char(255) DEFAULT NULL COMMENT '用户头像',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uid` (`uid`) USING BTREE,
  KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  bookstore.user 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
