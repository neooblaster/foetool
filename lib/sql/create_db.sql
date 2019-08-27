-- ------------------------------------------------------------ --
-- ---------------------[  DDL Generated  ]-------------------- --
-- ------------------------------------------------------------ --
create table content_plugin
(
  id mediumint(8) unsigned auto_increment
    primary key,
  section_option tinyint(3) unsigned null,
  plugin tinyint(3) unsigned null,
  constraint content_plugin_id_uindex
  unique (id)
)
;

create index content_plugin_plugin_id_fk
  on content_plugin (plugin)
;

create index content_plugin_section_option_id_fk
  on content_plugin (section_option)
;

create table content_type
(
  id tinyint(3) unsigned auto_increment
    primary key,
  type tinytext null,
  constraint content_type_id_uindex
  unique (id)
)
;

create table plugin
(
  id tinyint(3) unsigned auto_increment
    primary key,
  name tinytext null,
  enabled bit null,
  constraint plugin_id_uindex
  unique (id)
)
;

alter table content_plugin
  add constraint content_plugin_plugin_id_fk
foreign key (plugin) references plugin (id)
;

create table section_option
(
  id tinyint(3) unsigned auto_increment
    primary key,
  section tinyint(3) unsigned not null,
  content_type tinyint(3) unsigned null,
  name tinytext not null,
  enabled bit null,
  constraint content_option_ID_uindex
  unique (id),
  constraint section_option_content_type_id_fk
  foreign key (content_type) references content_type (id)
)
;

create index section_option_content_type_id_fk
  on section_option (content_type)
;

create index section_option_sections_id_fk
  on section_option (section)
;

alter table content_plugin
  add constraint content_plugin_section_option_id_fk
foreign key (section_option) references section_option (id)
;

create table sections
(
  id tinyint(3) unsigned auto_increment
    primary key,
  name tinytext null,
  enabled bit null,
  constraint content_ID_uindex
  unique (id)
)
;

alter table section_option
  add constraint section_option_sections_id_fk
foreign key (section) references sections (id)
;



-- ------------------------------------------------------------ --
-- ---------------------[ Technical Data  ]-------------------- --
-- ------------------------------------------------------------ --
INSERT INTO content_type (id, type) VALUES (null, 'plugin');



-- ------------------------------------------------------------ --
-- ---------------------[   Sample Data   ]-------------------- --
-- ------------------------------------------------------------ --
INSERT INTO sections (id, name, enabled) VALUES (null, 'SECTION_GM', 1);        -- 1
INSERT INTO sections (id, name, enabled) VALUES (null, 'SECTION_QUEST', 1);     -- 2
INSERT INTO sections (id, name, enabled) VALUES (null, 'SECTION_COLONY', 1);    -- 3
INSERT INTO sections (id, name, enabled) VALUES (null, 'SECTION_BUILDING', 1);  -- 4
INSERT INTO sections (id, name, enabled) VALUES (null, 'SECTION_TOOL', 1);      -- 5

INSERT INTO section_option (id, section, name, enabled) VALUES (null, 3, 'COLONY_VIKING', 1);
INSERT INTO section_option (id, section, name, enabled) VALUES (null, 3, 'COLONY_JAPANESE', 1);
INSERT INTO section_option (id, section, name, enabled) VALUES (null, 3, 'COLONY_EGYPTIAN', 1);

INSERT INTO plugin (id, name, enabled) VALUES(null, 'PfDispatcher', 1);
