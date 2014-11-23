CREATE DATABASE whiteboard;
GRANT ALL ON whiteboard.* TO 'whiteboard'@'%' IDENTIFIED BY 'whiteboard';
USE whiteboard;

CREATE TABLE User (
	id BIGINT NOT NULL AUTO_INCREMENT,
	username VARCHAR(50) NOT NULL,
	password VARCHAR(50) NOT NULL,
	created DATETIME NOT NULL,

	PRIMARY KEY (id),
	UNIQUE (username)
) ENGINE=InnoDB;
