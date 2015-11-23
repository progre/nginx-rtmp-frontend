nginx-rtmp-frontend
====

A frontend for [nginx-rtmp-module](https://github.com/arut/nginx-rtmp-module).
This will help in these things;
- Easily switch the delivery service. for example, [Twitch](http://www.twitch.tv/), [livecoding.tv](http://www.livecoding.tv/), [niconico](http://live.nicovideo.jp/), and [PeerCastStation](http://www.pecastation.org/).
- It will be delivered to **multiple services**.

Usage
----

You need to install nginx that nginx-rtmp-module is plugged in.

If your platform is **Windows**, You can download binary from **[here](http://nginx-win.ecsds.eu/download/)**.<br>
(It is recommended that you download the **nginx&#160;1.7.12.1&#160;Lizard.zip**. The reason is that the 1.9.x will not work probably.)

If your platform is **OSX**, You can install the nginx-full (not nginx) with brew.
see also: [Homebrew/homebrew-nginx](https://github.com/Homebrew/homebrew-nginx)
```
$ brew tap homebrew/nginx
$ brew install nginx-full --with-rtmp-module
```

----

After that, execute `nginx-rtmp-frontend.exe` or `nginx-rtmp-frontend`.

First time, you need configuration. 
If the configuration is not open, You can open that right-click on the tasktray icon and click the **configuration...** item.

### [Download it here!](https://github.com/progre/nginx-rtmp-frontend/releases)
