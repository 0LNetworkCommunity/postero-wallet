#!/bin/bash

set -ex

rm -rf ./src/backend
rm -rf ./web-build
rm -rf ./build/bin

# Backend
pushd ../desktop-backend
npm run build
popd

mkdir -p ./src/backend
mv ../desktop-backend/dist/main.cjs ./src/backend/main.cjs

# Frontend
pushd ../desktop-frontend
npm run build:web
popd

cp -r ../desktop-frontend/dist ./web-build

# Browser Helper
pushd ../browser-helper
cargo build --profile release
popd

mkdir -p ./build/bin

cp \
  ../browser-helper/target/release/browser-helper \
  ./build/bin/browser-helper

# Package App
npm run compile
