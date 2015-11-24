where electron-packager
electron-packager dest/ %APP_NAME% --platform=win32 --arch=ia32 --version=%ELECTRON_VER% --icon=src/res/icon_256.ico
where grunt
grunt create-windows-installer
where zip
zip -qry %APP_NAME%-win.zip %APP_NAME%-win32-ia32 -x '*.osx'
rm -rf %APP_NAME%-win32-ia32
