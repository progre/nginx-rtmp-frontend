call electron-packager dest/ %APP_NAME% --platform=win32 --arch=ia32 --version=%ELECTRON_VER% --icon=src/res/icon_256.ico --asar=true
call 7za.exe a %APP_NAME%-win.zip %APP_NAME%-win32-ia32
rm -rf %APP_NAME%-win32-ia32
