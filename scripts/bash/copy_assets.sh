#!/bin/bash

mkdir -p dist/assets/

cp -r src/scripts/renderer/dashboard/dist dist/assets/dashboard
cp -r src/scripts/renderer/nav/dist dist/assets/nav

cp -r data/settings/. dist/settings/
cp -r src/scripts/renderer/startup/dist/. dist/
