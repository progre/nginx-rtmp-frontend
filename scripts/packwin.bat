electron-packager dest/ %APP_NAME% --platform=win32 --arch=ia32 --version=%ELECTRON_VER% --icon=src/res/icon_256.ico
grunt create-windows-installer
zip -qry %APP_NAME%-win.zip %APP_NAME%-win32-ia32 -x '*.osx'
rm -rf %APP_NAME%-win32-ia32
