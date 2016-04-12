import * as React from "react";

export default function ServiceSettings() {
    return     <fieldset>
      <legend class="i18n-service-settings"></legend>
      <div class="row">
        <div class="col-sm-4 btn-group-vertical">
          <button id="twitch-button" class="btn btn-secondary"><span style="width: 16px; height: 16px;" class="pull-left"><img src="http://www.twitch.tv/favicon.ico" width="16" height="16" onerror="this.style.display = &quot;none&quot;;"/></span><span style="margin-left: 0.5em;" class="pull-left">Twitch</span><span class="pull-right"><i id="twitch-check" class="fa fa-check"></i></span></button>
          <button id="peercaststation-button" class="btn btn-secondary text-left"><span style="width: 16px; height: 16px;" class="pull-left"><img src="http://127.0.0.1:7144/html/favicon.ico" width="16" height="16" onerror="this.style.display = &quot;none&quot;;"/></span><span style="margin-left: 0.5em;" class="pull-left">PeerCastStation</span><span class="pull-right"><i id="peercaststation-check" class="fa fa-check"></i></span></button>
          <button id="livecodingtv-button" class="btn btn-secondary text-left"><span style="width: 16px; height: 16px;" class="pull-left"><img src="https://www.livecoding.tv/favicon.ico" width="16" height="16" onerror="this.style.display = &quot;none&quot;;"/></span><span style="margin-left: 0.5em;" class="pull-left">Livecoding.tv</span><span class="pull-right"><i id="livecodingtv-check" class="fa fa-check"></i></span></button>
          <button id="niconico-button" class="btn btn-secondary text-left"><span style="width: 16px; height: 16px;" class="pull-left"><img src="http://www.nicovideo.jp/favicon.ico" width="16" height="16" onerror="this.style.display = &quot;none&quot;;"/></span><span style="margin-left: 0.5em;" class="pull-left">niconico</span><span class="pull-right"><i id="niconico-check" class="fa fa-check"></i></span></button>
          <button id="other-button" class="btn btn-secondary text-left"><span class="pull-left"><img width="16" height="16"/></span><span style="margin-left: 0.5em;" class="pull-left">Other</span><span class="pull-right"><i id="other-check" class="fa fa-check"></i></span></button>
        </div>
        <div style="display: none;" id="twitch-option" class="col-sm-8">
          <div class="row">
            <div class="col-sm-push-3 col-sm-9">
              <div class="checkbox">
                <label>
                  <input type="checkbox" id="twitch-enabled"/><span class="i18n-enable"></span>
                </label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3 text-right">
              <label for="twitch-fms" class="form-control-static">FMS URL:</label>
            </div>
            <div class="col-sm-9">
              <select style="height: 40px;" id="twitch-fms" class="form-control"></select>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3 text-right">
              <label for="twitch-key" class="form-control-static i18n-stream-key"></label>
            </div>
            <div class="col-sm-9">
              <input style="width: 100%" type="text" id="twitch-key" class="form-control"/>
            </div>
          </div>
          <div style="margin-top: 1em;" class="row">
            <div class="col-sm-12 text-right"><a href="http://www.twitch.tv/" target="_blank" class="selectable">http://www.twitch.tv/</a></div>
          </div>
        </div>
        <div style="display: none;" id="peercaststation-option" class="col-sm-8">
          <div class="row">
            <div class="col-sm-push-3 col-sm-9">
              <div class="checkbox">
                <label>
                  <input type="checkbox" id="peercaststation-enabled"/><span class="i18n-enable"></span>
                </label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3 text-right">
              <label for="peercaststation-fms" class="form-control-static">FMS URL:</label>
            </div>
            <div class="col-sm-9">
              <input style="width: 100%" type="text" id="peercaststation-fms" class="form-control"/>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-push-3 col-sm-9 i18n-notification-for-peercaststation"></div>
          </div>
          <div style="margin-top: 1em;" class="row">
            <div class="col-sm-12 text-right"><a href="http://www.pecastation.org/" target="_blank" class="selectable">http://www.pecastation.org/</a></div>
          </div>
        </div>
        <div style="display: none;" id="livecodingtv-option" class="col-sm-8">
          <div class="row">
            <div class="col-sm-push-3 col-sm-9">
              <div class="checkbox">
                <label>
                  <input type="checkbox" id="livecodingtv-enabled"/><span class="i18n-enable"></span>
                </label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3 text-right">
              <label for="livecodingtv-fms" class="form-control-static">FMS URL:</label>
            </div>
            <div class="col-sm-9">
              <input style="width: 100%" type="text" id="livecodingtv-fms" class="form-control"/>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3 text-right">
              <label for="livecodingtv-key" class="form-control-static i18n-stream-key"></label>
            </div>
            <div class="col-sm-9">
              <input style="width: 100%" type="text" id="livecodingtv-key" class="form-control"/>
            </div>
          </div>
          <div style="margin-top: 1em;" class="row">
            <div class="col-sm-12 text-right"><a href="https://www.livecoding.tv/" target="_blank" class="selectable">https://www.livecoding.tv/</a></div>
          </div>
        </div>
        <div style="display: none;" id="niconico-option" class="col-sm-8">
          <div class="row">
            <div class="col-sm-push-3 col-sm-9">
              <div class="checkbox">
                <label>
                  <input type="checkbox" id="niconico-enabled"/><span class="i18n-enable"></span>
                </label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3 text-right">
              <label for="niconico-fms" class="form-control-static">FMS URL:</label>
            </div>
            <div class="col-sm-9">
              <input style="width: 100%" type="text" id="niconico-fms" class="form-control"/>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3 text-right">
              <label for="niconico-key" class="form-control-static i18n-stream-key"></label>
            </div>
            <div class="col-sm-9">
              <input style="width: 100%" type="text" id="niconico-key" class="form-control"/>
            </div>
          </div>
          <div style="margin-top: 1em;" class="row">
            <div class="col-sm-12 text-right"><a href="http://live.nicovideo.jp/" target="_blank" class="selectable">http://live.nicovideo.jp/</a></div>
          </div>
        </div>
        <div style="display: none;" id="other-option" class="col-sm-8">
          <div class="row">
            <div class="col-sm-push-3 col-sm-9">
              <div class="checkbox">
                <label>
                  <input type="checkbox" id="other-enabled"/><span class="i18n-enable"></span>
                </label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3 text-right">
              <label for="other-fms" class="form-control-static">FMS URL:</label>
            </div>
            <div class="col-sm-9">
              <input style="width: 100%" type="text" id="other-fms" class="form-control"/>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3 text-right">
              <label for="other-key" class="form-control-static i18n-stream-key"></label>
            </div>
            <div class="col-sm-9">
              <input style="width: 100%" type="text" id="other-key" class="form-control"/>
            </div>
          </div>
        </div>
      </div>
    </fieldset>;
}
