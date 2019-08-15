-- ------------------------------------------------------------ --
-- ---------------------[  DDL Generated  ]-------------------- --
-- ------------------------------------------------------------ --
create table content
(
  ID tinyint(3) unsigned auto_increment
    primary key,
  NAME tinytext null,
  ENABLED bit null,
  constraint content_ID_uindex
  unique (ID)
)
;

create table content_option
(
  ID tinyint(3) unsigned auto_increment
    primary key,
  CONTENT tinyint(3) unsigned not null,
  NAME tinytext not null,
  ENABLED bit null,
  constraint content_option_ID_uindex
  unique (ID),
  constraint content_option_content_ID_fk
  foreign key (CONTENT) references content (ID)
)
;

create index content_option_content_ID_fk
  on content_option (CONTENT)
;



-- ------------------------------------------------------------ --
-- ---------------------[ Technical Data  ]-------------------- --
-- ------------------------------------------------------------ --



-- ------------------------------------------------------------ --
-- ---------------------[   Sample Data   ]-------------------- --
-- ------------------------------------------------------------ --
INSERT INTO content (ID, NAME, ENABLED) VALUES (null, 'CONTENT_GM', 1);        -- 1
INSERT INTO content (ID, NAME, ENABLED) VALUES (null, 'CONTENT_QUEST', 1);     -- 2
INSERT INTO content (ID, NAME, ENABLED) VALUES (null, 'CONTENT_COLONY', 1);    -- 3
INSERT INTO content (ID, NAME, ENABLED) VALUES (null, 'CONTENT_BUILDING', 1);  -- 4

INSERT INTO content_option (ID, CONTENT, NAME, ENABLED) VALUES (null, 3, 'COLONY_VIKING', 1);
INSERT INTO content_option (ID, CONTENT, NAME, ENABLED) VALUES (null, 3, 'COLONY_JAPANESE', 1);
INSERT INTO content_option (ID, CONTENT, NAME, ENABLED) VALUES (null, 3, 'COLONY_EGYPTIAN', 1);
