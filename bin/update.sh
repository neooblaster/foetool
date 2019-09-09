#!/usr/bin/env bash
git checkout -- ../
git fetch --all
git pull gh master
./switchPrd.sh
composer update
chown -R www-data: ../var/tmp