mkdir dest
cp -r lib/ dest/lib
cp LICENSE dest/
cp package.json dest/
cp README*.md dest/
pushd dest
npm install --production
popd
