call electron-packager dest/ %APP_NAME% --platform=darwin --arch=x64 --version=%ELECTRON_VER% --icon=src/res/icon.icns
call 7za a %APP_NAME%-osx.zip %APP_NAME%-darwin-x64
rm -rf %APP_NAME%-darwin-x64
