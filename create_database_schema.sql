CREATE DATABASE course_school_ms;

USE DATABASE course_school_ms;

CREATE TABLE students(
 id INT(11) PRIMARY KEY AUTO_INCREMENT,
 number_id VARCHAR(10) UNIQUE,   
 fullname VARCHAR(200),
 place_of_birth VARCHAR(150),
 date_of_birth DATE,
 address VARCHAR(250)
)ENGINE=INNODB;