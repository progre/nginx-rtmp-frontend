electron-packager dest/ $APP_NAME --platform=darwin --arch=x64 --version=$ELECTRON_VER --icon=src/res/icon.icns
zip -qry $APP_NAME-osx.zip $APP_NAME-darwin-x64 -x '*.exe'
rm -rf $APP_NAME-darwin-x64
