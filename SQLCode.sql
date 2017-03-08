DROP TABLE IF EXISTS `division`;
CREATE TABLE `division` (did INT(11) AUTO_INCREMENT PRIMARY KEY,
                         name VARCHAR(30),
                         active INT(7) DEFAULT 1,
                         UNIQUE (name));

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
                    timeCreated DATE NOT NULL, 
                    signature VARCHAR(30) NOT NULL, 
                    dept INT(11) NOT NULL,
                    active INT(7) DEFAULT 1,                    
                    FOREIGN KEY (dept) REFERENCES division(did));
                    
INSERT INTO users (fName, lName, email, password, timeCreated, dept) VALUES 
                  ("mike", "smith", "bonneym@oregonstate.edu", "msmith", curdate(), 1);
INSERT INTO users (fName, lName, email, password, timeCreated, dept) VALUES 
                  ("alicia", "broederdorf", "broedera@oregonstate.edu", "aliciapass", curdate(), 2);
INSERT INTO users (fName, lName, email, password, timeCreated, dept, active) VALUES 
                  ("fred", "garvin", "garvin@hotmail", "freddy", curdate(), 2, 0);
                  
                  


 
DROP TABLE IF EXISTS `admins`;
CREATE TABLE admins (id INT(11) AUTO_INCREMENT PRIMARY KEY,  
                     adminName VARCHAR(30) NOT NULL,
                     password VARCHAR(30) NOT NULL, 
                     active INT(7) DEFAULT 1, 
                     UNIQUE (adminName, password));
                     
INSERT INTO admins (adminName, password) VALUES ("benbrew", "drspock");    
INSERT INTO admins (adminName, password) VALUES ("mikejam", "nolimit");                 
                    
DROP TABLE IF EXISTS `awards`;
CREATE TABLE awards ( aid INT(11) AUTO_INCREMENT PRIMARY KEY,
                      title VARCHAR(255) NOT NULL,
                      active INT(7) DEFAULT 1,
                      UNIQUE (title));
                      
INSERT INTO awards (title) values ("Employee of the Month");
INSERT INTO awards (title) values ("Employee of the Week");
INSERT INTO awards (title) values ("New Sales Record");                        
                      
DROP TABLE IF EXISTS `bonus`;
CREATE TABLE bonus (bid INT(11) AUTO_INCREMENT PRIMARY KEY,
                    amount INT(11) NOT NULL,
                    active INT(7) DEFAULT 1,
                    UNIQUE (amount));
                    
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

INSERT INTO userAwards (recipient, giver, awardID, bonusID, awardDate) VALUES (1,2,1,2, curdate());
INSERT INTO userAwards (recipient, giver, awardID, bonusID, awardDate) VALUES (1,3,2,3, curdate());
INSERT INTO userAwards (recipient, giver, awardID, bonusID, awardDate) VALUES (2,1,3,1, curdate());

SELECT UA.uaid, t1.fName AS recipientFName, t1.lName AS recipientLName, t2.fName AS giverFName,
t2.lName AS giverLName, UA.awardDate, title AS awardTitle, amount AS bonusAmount FROM userAwards UA join users t1 on UA.recipient=t1.id 
join users t2 on UA.giver=t2.id INNER JOIN awards on UA.awardID=awards.aid INNER JOIN bonus on UA.bonusID=bonus.bid;
