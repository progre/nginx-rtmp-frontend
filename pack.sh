electron-packager dest/ $APP_NAME --platform=darwin --arch=x64 --version=$ELECTRON_VER --icon=src/res/icon.icns
cd $APP_NAME-darwin-x64
zip -qry ../$APP_NAME-osx.zip . -x '*.exe'
cd ..
rm -rf $APP_NAME-darwin-x64
electron-packager dest/ $APP_NAME --platform=win32 --arch=ia32 --version=$ELECTRON_VER --icon=src/res/icon_256.ico --asar=true
cd $APP_NAME-win32-ia32
zip -qry ../$APP_NAME-win.zip . -x '*.osx'
cd ..
rm -rf $APP_NAME-win32-ia32
electron-packager dest/ $APP_NAME --platform=linux --arch=ia32 --version=$ELECTRON_VER
cd $APP_NAME-linux-ia32
zip -qry ../$APP_NAME-linux.zip .
cd ..
rm -rf $APP_NAME-linux-ia32
