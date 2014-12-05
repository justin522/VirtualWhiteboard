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

CREATE TABLE Room (
    id BIGINT NOT NULL AUTO_INCREMENT,
    roomname VARCHAR(50) NOT NULL,
    created DATETIME NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (roomname)
) ENGINE=InnoDB;

CREATE TABLE ChatMessage (
    id BIGINT NOT NULL AUTO_INCREMENT,
    userid BIGINT NOT NULL,
    roomid BIGINT NOT NULL,
    data TEXT,
    created DATETIME NOT NULL,

    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE WhiteboardEdit (
    id BIGINT NOT NULL AUTO_INCREMENT,
    userid BIGINT NOT NULL,
    roomid BIGINT NOT NULL,
    data TEXT,
    created DATETIME NOT NULL,

    PRIMARY KEY (id)
) ENGINE=InnoDB;
