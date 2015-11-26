nginx-rtmp-frontend
====

[nginx-rtmp-module](https://github.com/arut/nginx-rtmp-module)のフロントエンドです。
以下の機能があります：
- [Twitch](http://www.twitch.tv/), [Livecoding.tv](http://www.livecoding.tv/), [ニコニコ生放送](http://live.nicovideo.jp/), そして[PeerCastStation](http://www.pecastation.org/)など、簡単に配信先のサイトを切り替えられます。
- **複数のサービスに同時に配信ができます**。

使い方
----

最初にnginx-rtmp-moduleが組み込まれたnginxを用意する必要があります。

Windowsの場合、**[ここ](http://nginx-win.ecsds.eu/download/)**からバイナリをダウンロードできます。<br>
(**nginx&#160;1.7.12.1&#160;Lizard.zip**をダウンロードしてください。1.9.x系にはnginx-rtmp-moduleが入っていないため動作しません)

OSXの場合、brewでnginx-full (nginxではなく) をインストールできます。
詳しくはこちら: [Homebrew/homebrew-nginx](https://github.com/Homebrew/homebrew-nginx)
```
$ brew tap homebrew/nginx
$ brew install nginx-full --with-rtmp-module
```

----

nginxが用意出来たら、`nginx-rtmp-frontend.exe`もしくは`nginx-rtmp-frontend`を単純に起動してください。

初回起動時は設定が必要です。
設定ウィンドウが開かない場合は、タスクトレイを右クリックして **設定...** をクリックしてください。

### [ダウンロードはこちら](https://github.com/progre/nginx-rtmp-frontend/releases)
