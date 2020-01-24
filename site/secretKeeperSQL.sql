DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `record`;


CREATE TABLE `user`(
	`id` int NOT NULL AUTO_INCREMENT,
    `user_name` varchar(30) NOT NULL,
    `user_password` varchar(30) NOT NULL,
    `user_email` varchar(30) NOT NULL,
    'super_user' int,
    PRIMARY KEY (`id`)
);

CREATE TABLE `record`(
	`record_id` int NOT NULL AUTO_INCREMENT,
    `record_name` varchar(30) NOT NULL,
    `record_data` varchar(30) NOT NULL,
    `record_URL` varchar(30),
    'user' int,
    PRIMARY KEY (`id`)
    FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON DELETE SET NULL,
);

INSERT INTO 'user'('user_name','user_password','user_email','super_user')
VALUES
('Admin', 'password', 'admin@fake.com', 1),
('Kyle', '12345', 'kdixon@fake.com' , 0),
('Katie', 'secret', 'kyoung@fake.com', 0),
('John', '1q2w3e', 'jdoe@fake.com', 0),
('Jane', 'password1', 'jdoe@fake.com', 0);

INSERT INTO `records`(`record_name`, `record_data`, `record_URL`)
VALUES
('Credit Card', '123456789', 'USBank.com',(SELECT id FROM user WHERE name='Kyle')),
('Password', 'montana', 'Twitter.com',(SELECT id FROM user WHERE name='Kyle')),
('Password', 'supersecret', 'USA.gov',(SELECT id FROM user WHERE name='Kyle')),
('Credit Card', '987654321', 'OffShoreBank.com',(SELECT id FROM user WHERE name='Katie')),
('Password', 'banana', 'oregonstate.edu',(SELECT id FROM user WHERE name='Katie')),
('Password', 'secrets', 'xfinity.com',(SELECT id FROM user WHERE name='Katie'));