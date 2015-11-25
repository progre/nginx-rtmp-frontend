mkdir dest
cp -r lib/ dest/lib
cp LICENSE dest/
cp package.json dest/
cp README*.md dest/
cd dest
call npm install --production
cd ..
