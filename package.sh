#!/usr/bin/env bash
rm -rf dist
mkdir dist
rm -rf Phoenix-*
electron-packager . Phoenix --platform=darwin --arch=x64 --asar --icon icons/icon.icns --out=dist
electron-packager . Phoenix --platform=linux --arch=ia32 --asar --icon icons/icon.png --out=dist
electron-packager . Phoenix --platform=win32 --arch=ia32 --asar --icon icons/icon.ico --out=dist