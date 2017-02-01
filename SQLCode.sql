DROP TABLE IF EXISTS `division`;
CREATE TABLE `division` (did INT(11) AUTO_INCREMENT PRIMARY KEY,
                         name VARCHAR(30));

INSERT INTO division (name) values ("accounting");
INSERT INTO division (name) values ("sales");
INSERT INTO division (name) values ("maintenance");
INSERT INTO division (name) values ("management");


DROP TABLE IF EXISTS `users`;
CREATE TABLE users (id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    fName VARCHAR(30) NOT NULL,
                    lName VARCHAR(30) NOT NULL,
                    email VARCHAR(70) NOT NULL,
                    password VARCHAR(70) NOT NULL,
                    timeCreated TIMESTAMP, 
                    signature VARCHAR(100) NOT NULL, 
                    dept INT(11) NOT NULL,    
                    FOREIGN KEY (dept) REFERENCES division(did),
                    UNIQUE(lName, email));
                    
/* INSERT INTO users (fName, lName, email, password, timeCreated, dept) VALUES 
                  ("mike", "smith", "msmith@yahoo.com", "msmith", current_timestamp, 1); */


 
DROP TABLE IF EXISTS `admins`;
CREATE TABLE admins (id INT(11) AUTO_INCREMENT PRIMARY KEY,  
                     adminName VARCHAR(30) NOT NULL,
                     password VARCHAR(30) NOT NULL);
                     
INSERT INTO admins (adminName, password) VALUES ("benbrew", "drspock");    
INSERT INTO admins (adminName, password) VALUES ("mikejam", "nolimit");                 
                    
DROP TABLE IF EXISTS `awards`;
CREATE TABLE awards ( aid INT(11) AUTO_INCREMENT PRIMARY KEY,
                      title VARCHAR(255) NOT NULL);
                      
INSERT INTO awards (title) values ("Employee of the Month");
INSERT INTO awards (title) values ("Employee of the Week");
INSERT INTO awards (title) values ("New Sales Record");                        
                      
DROP TABLE IF EXISTS `bonus`;
CREATE TABLE bonus (bid INT(11) AUTO_INCREMENT PRIMARY KEY,
                    amount INT(11) NOT NULL);
                    
INSERT INTO bonus (amount) values (25);
INSERT INTO bonus (amount) values (50);
INSERT INTO bonus (amount) values (100);                    

DROP TABLE IF EXISTS `userAwards`;
CREATE TABLE userAwards ( uaid INT(11) AUTO_INCREMENT PRIMARY KEY ,
                          recipient INT(11) NOT NULL,
                          giver INT(11) NOT NULL,
                          awardID INT(11) NOT NULL,
                          bonusID INT(11) NOT NULL,
                          awardDate DATE,
                          FOREIGN KEY (recipient) REFERENCES users(id),
                          FOREIGN KEY (giver) REFERENCES users(id),
                          FOREIGN KEY (awardID) REFERENCES awards(aid),
                          FOREIGN KEY (bonusID) REFERENCES bonus(bid));
