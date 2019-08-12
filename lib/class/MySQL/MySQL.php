<?php
/**
 * File :: MySQL.php
 *
 * %DESC BLOCK%
 *
 * @author    Nicolas DUPRE
 * @release   08/10/2018
 * @version   1.0.0
 * @package   Index
 * @require   /init/init.settings.php
 *
 *
 *
 * Version 1.0.0 : 08/10/2018 : NDU
 * -------------------------------
 *
 *
 */

namespace MySQL;


class MySQL
{
    static public function sql ($server, $database, $user, $password)
    {
        return new \PDO(
            'mysql:host=' . $server . ';dbname=' . $database . ';charset=utf8;',
            $user,
            $password,
            array(
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION
            )
        );
    }

    static public function prepare ()
    {
//        return call_user_func_array(array(MySQL::sql(), 'prepare'), func_get_args());
    }

    static public function query ()
    {
//        return call_user_func_array(array(MySQL::sql(), 'query'), func_get_args());
    }

}
