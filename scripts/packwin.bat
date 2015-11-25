echo 1
electron-packager dest/ %APP_NAME% --platform=win32 --arch=ia32 --version=%ELECTRON_VER% --icon=src/res/icon_256.ico
echo 2
grunt create-windows-installer
echo 3
copy installer32\Setup.exe %APP_NAME%-win-installer.exe
echo 4
zip -qry %APP_NAME%-win.zip %APP_NAME%-win32-ia32 -x '*.osx'
echo 5
rm -rf %APP_NAME%-win32-ia32
echo 6
