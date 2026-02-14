#!/bin/bash
set -e

# Build admin site (CRA)
npm install
npm run build

# Build client site (Vite)
cd client-site
npm install
npm run build
cd ..

# Combine into output/
rm -rf output
mkdir -p output/admin

# Client site → root
cp -r client-site/dist/* output/

# Admin site → /admin
cp -r build/* output/admin/
