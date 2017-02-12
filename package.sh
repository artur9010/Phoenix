#!/usr/bin/env bash
rm -rf dist
mkdir dist
rm -rf Phoenix-*
node_modules/.bin/electron-packager . Phoenix --platform=darwin --arch=x64 --asar --icon icons/icon.icns --out=dist --prune app-category-type=public.app-category.utilities
node_modules/.bin/electron-packager . Phoenix --platform=linux --arch=ia32 --asar --icon icons/icon.png --out=dist --prune
node_modules/.bin/electron-packager . Phoenix --platform=win32 --arch=ia32 --asar --icon icons/icon.ico --out=dist --prune --version-string.ProductName="Phoenix" --version-string.CompanyName="artur9010"