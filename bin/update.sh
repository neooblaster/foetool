#!/usr/bin/env bash
DIRECTORY=`dirname $0`
cd $DIRECTORY
cd ..
git update-index --assume-unchanged --skip-worktree -- etc/credentials.custom.json
git checkout -- .
git fetch --all
git pull gh latest
sed -i -re "s/foedev/foe/" lib/js/foetool.js
composer update
chown -R www-data: var/tmp