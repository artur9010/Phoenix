rm -rf dist
mkdir dist
rm -rf Phoenix-*
electron-packager . --platform=darwin --arch=x64 --asar --icon icons/icon.icns
electron-packager . --platform=linux --arch=ia32 --asar --icon icons/icon.png
electron-packager . --platform=win32 --arch=ia32 --asar --icon icons/icon.ico
mv Phoenix-darwin-x64/ dist/
mv Phoenix-linux-ia32/ dist/
mv Phoenix-win32-ia32/ dist/