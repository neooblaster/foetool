-- ------------------------------------------------------------ --
-- ---------------------[  DDL Generated  ]-------------------- --
-- ------------------------------------------------------------ --
create table content_plugin
(
  id mediumint(8) unsigned auto_increment
    primary key,
  section_option tinyint(3) unsigned null,
  plugin tinyint(3) unsigned null,
  enabled bit null,
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
  `desc` tinytext null,
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
-- ------------------------------------------------------------ -- ---------------------------- -- Auto-Increment:
                                                                                                -- sections.id :
INSERT INTO sections (id, name, enabled) VALUES (null, 'SECTION_GM', 1);                        -- 1
INSERT INTO sections (id, name, enabled) VALUES (null, 'SECTION_QUEST', 1);                     -- 2
INSERT INTO sections (id, name, enabled) VALUES (null, 'SECTION_COLONY', 1);                    -- 3
INSERT INTO sections (id, name, enabled) VALUES (null, 'SECTION_BUILDING', 1);                  -- 4
INSERT INTO sections (id, name, enabled) VALUES (null, 'SECTION_TOOL', 1);                      -- 5

                                                                                                -- section_option.id :
INSERT INTO section_option (id, section, name, `desc`, enabled) VALUES (                        -- 1
  null, 3, 'COLONY_VIKING', 'COLONY_VIKING_TTL', 1
);
INSERT INTO section_option (id, section, name, `desc`, enabled) VALUES (                        -- 2
  null, 3, 'COLONY_JAPANESE', 'COLONY_JAPANESE_TTL', 1
);
INSERT INTO section_option (id, section, name, `desc`, enabled) VALUES (                        -- 3
  null, 3, 'COLONY_EGYPTIAN', 'COLONY_EGYPTIAN_TTL', 1
);
INSERT INTO section_option (id, section, name, `desc`, enabled) VALUES (                        -- 4
  null, 5, 'PF_DISPATCHER', 'PF_DISPATCHER_TTL', 1
);
INSERT INTO section_option (id, section, name, `desc`, enabled) VALUES (                        -- 5
  null, 5, 'RES_DISPATCHER', 'RES_DISPATCHER_TTL', 1
);
INSERT INTO section_option (id, section, name, `desc`, enabled) VALUES (                        -- 6
  null, 5, 'YIELD', 'YIELD_TTL', 1
);
INSERT INTO section_option (id, section, name, `desc`, enabled) VALUES (                        -- 7
  null, 5, 'GM_CONTRIB', 'GM_CONTRIB_TTL', 1
);

                                                                                                -- plugin.id :
INSERT INTO plugin (id, name, enabled) VALUES(null, 'PfDispatcher', 1);                         -- 1

                                                                                                -- content_plugin.id :
INSERT INTO content_plugin (id, section_option, plugin, enabled) VALUES (null, 4, 1, 1);        -- 1
