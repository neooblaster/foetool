<?php

function getCredentials ()
{
    $credentialBase = json_decode(file_get_contents(__ROOT__ . '/etc/credentials.json'), true);
    $credentialOverload = json_decode(file_get_contents(__ROOT__ . '/etc/credentials.custom.json'), true);

    return array_replace_recursive($credentialBase, $credentialOverload);
}
