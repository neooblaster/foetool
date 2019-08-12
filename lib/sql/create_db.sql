-- ------------------------------------------------------------ --
-- ---------------------[  DDL Generated  ]-------------------- --
-- ------------------------------------------------------------ --
create table content
(
  ID tinyint(3) unsigned auto_increment
    primary key,
  NAME tinytext null,
  constraint content_ID_uindex
  unique (ID)
)
;




-- ------------------------------------------------------------ --
-- ---------------------[ Technical Data  ]-------------------- --
-- ------------------------------------------------------------ --



-- ------------------------------------------------------------ --
-- ---------------------[   Sample Data   ]-------------------- --
-- ------------------------------------------------------------ --
INSERT INTO content (ID, NAME) VALUES (null, 'CONTENT_GM');
INSERT INTO content (ID, NAME) VALUES (null, 'CONTENT_QUEST');
INSERT INTO content (ID, NAME) VALUES (null, 'CONTENT_COLONY');
INSERT INTO content (ID, NAME) VALUES (null, 'CONTENT_BUILDING');
