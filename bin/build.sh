#!/usr/bin/env bash

# Go to project root
cd ..

# Build CSS File
lessc --clean-css lib/less/foe.less lib/css/foe.css

# Update README.md
mdmerge README.md

# Optionals
source ~/.bashrc > /dev/null 2>&1 || true
mpdf README.md > /dev/null 2>&1 || true
mpdf CONTRIBUTING.md > /dev/null 2>&1 || true
