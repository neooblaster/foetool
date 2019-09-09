#!/usr/bin/env bash
DIRECTORY=`dirname $0`
cd $DIRECTORY
cd ..
sed -i -re "s/foedev/foe/" lib/js/foetool.js