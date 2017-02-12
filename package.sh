#!/usr/bin/env bash
[ "$3" != "-" ] &&
rm -rf dist &&
mkdir dist &&
rm -rf Phoenix-*

PLATFORM=$1
ARCH=$2

[ "$PLATFORM" == "" ] && PLATFORM=$OSTYPE
[ "$ARCH" == "a" ] && ARCH="all"

case "$PLATFORM" in
  "mac" | "m" | "darwin")
    node_modules/.bin/electron-packager . Phoenix --platform=darwin --arch=$ARCH --asar --icon icons/icon.icns --out=dist --prune app-category-type=public.app-category.utilities
    ;;
  "linux" | "l" | "linux-gnu")
    node_modules/.bin/electron-packager . Phoenix --platform=linux --arch=$ARCH --asar --icon icons/icon.png --out=dist --prune
    ;;
  "windows" | "w" | "win32" | "msys")
    node_modules/.bin/electron-packager . Phoenix --platform=win32 --arch=$ARCH --asar --icon icons/icon.ico --out=dist --prune --version-string.ProductName="Phoenix" --version-string.CompanyName="artur9010"
    ;;
  "all" | "a")
    ./package.sh m $ARCH
    ./package.sh l $ARCH -
    ./package.sh w $ARCH -
    ;;
  *)
    echo "No such platform as $PLATFORM. Please use one of these: mac, linux, windows, all."
    exit 1
    ;;

esac
