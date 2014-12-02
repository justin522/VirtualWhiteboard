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
    userid BIGINT NOT NULL,
    created DATETIME NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (roomname)
) ENGINE=InnoDB;

CREATE TABLE ChatMessage (
    id BIGINT NOT NULL AUTO_INCREMENT,
    userid BIGINT NOT NULL,
    message VARCHAR(250),
    roomid BIGINT NOT NULL,
    created DATETIME NOT NULL,

    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE WhiteboardEdit (
    id BIGINT NOT NULL AUTO_INCREMENT,
    userid BIGINT NOT NULL,
    type VARCHAR(50),
    layer VARCHAR(50),
    prevX INT,
    prevY INT,
    currX INT,
    currY INT,
    strokeColor VARCHAR(50),
    strokeWidth INT,
    roomid BIGINT NOT NULL,
    created DATETIME NOT NULL,

    PRIMARY KEY (id)
) ENGINE=InnoDB;
