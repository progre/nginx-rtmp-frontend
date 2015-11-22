mkdir dest
cp -r lib/ dest/lib
cp LICENSE dest/
cp package.json dest/
cp README.md dest/
cd dest
npm install --production
cd ..
electron-packager dest/ $APP_NAME --platform=win32 --arch=ia32 --version=$ELECTRON_VER --icon=src/res/icon_256.ico
zip -qry $APP_NAME-win.zip $APP_NAME-win32-ia32 -x '*.osx'
rm -rf $APP_NAME-win32-ia32
electron-packager dest/ $APP_NAME --platform=darwin --arch=x64 --version=$ELECTRON_VER --icon=src/res/icon.icns
zip -qry $APP_NAME-osx.zip $APP_NAME-darwin-x64 -x '*.exe'
rm -rf $APP_NAME-darwin-x64
