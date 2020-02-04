CREATE TABLE `user`(
	`user_first` varchar(30) NOT NULL,
    `user_last` varchar(30) NOT NULL,
    `user_name` varchar(30) NOT NULL,
    `user_password` varchar(30) NOT NULL,
    `user_email` varchar(30) NOT NULL,
    `user_super` int,
    `user_number` int NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`user_name`)
);

CREATE TABLE `records`(
	`record_id` int NOT NULL AUTO_INCREMENT,
    `record_name` varchar(30) NOT NULL,
    `record_data` varchar(30) NOT NULL,
    `record_URL` varchar(30),
    `record_user` int,
    PRIMARY KEY (`record_id`),
    FOREIGN KEY (`record_user`) REFERENCES `user`(`user_number`) ON DELETE SET NULL
);

INSERT INTO `user`(`user_first`,`user_last`,`user_name`,`user_password`,`user_email`,`user_super`)
VALUES
('Admin','Admin','Admin', 'password', 'admin@fake.com', 1),
('Kyle','Dixon','Kyle', '12345', 'kdixon@fake.com' , 0),
('Katie','Young','Katie', 'secret', 'kyoung@fake.com', 0),
('John','Doe','John', '1q2w3e', 'jdoe@fake.com', 0),
('Jane','Doe','Jane', 'password1', 'jdoe@fake.com', 0);

INSERT INTO `records`(`record_name`, `record_data`, `record_URL`,`record_user`)
VALUES
('USBank', '123456789', 'USBank.com',(SELECT record_user FROM user WHERE user_number='1')),
('Twitter', 'montana', 'Twitter.com',(SELECT record_user FROM user WHERE user_number='1')),
('IRS', 'supersecret', 'USA.gov',(SELECT record_user FROM user WHERE user_number='1')),
('OffShoreBank', '987654321', 'OffShoreBank.com',(SELECT record_user FROM user WHERE user_number='2')),
('OSU', 'banana', 'oregonstate.edu',(SELECT record_user FROM user WHERE user_number='2')),
('Xfinity', 'secrets', 'xfinity.com',(SELECT record_user FROM user WHERE user_number='2'));