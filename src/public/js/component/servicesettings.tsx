import * as React from "react";

export default function ServiceSettings() {
    return     <fieldset>
      <legend className="i18n-service-settings"></legend>
      <div className="row">
        <div className="col-sm-4 btn-group-vertical">
          <button id="twitch-button" className="btn btn-secondary">
            <span style={{width: 16, height: 16}} className="pull-left">
            <img src="http://www.twitch.tv/favicon.ico" width="16" height="16" onerror="this.style.display = 'none';"/>
            </span>
            <span style={{marginLeft: "0.5em"}} className="pull-left">Twitch</span>
            <span className="pull-right"><i id="twitch-check" className="fa fa-check"/>          </span>
          </button>
          <button id="peercaststation-button" className="btn btn-secondary text-left">
          <span style={{width: 16, height: 16}} className="pull-left">
          <img src="http://127.0.0.1:7144/html/favicon.ico" width="16" height="16" onerror="this.style.display = 'none';"/>
          </span>
          <span style={{marginLeft: "0.5em"}} className="pull-left">PeerCastStation</span>
          <span className="pull-right"><i id="peercaststation-check" className="fa fa-check"/></span>
          </button>
          <div style={{display:"none"}}>
            // button.btn.btn-secondary.text-left#cavetube-button
            //   span.pull-left CaveTube
            //   span.pull-right
            //     i.fa.fa-check#cavetube-check
            </div>
          <button id="livecodingtv-button" className="btn btn-secondary text-left">
          <span style={{width: 16, height: 16}} className="pull-left">
          <img src="https://www.livecoding.tv/favicon.ico" width="16" height="16" onerror="this.style.display = 'none';"/>
          </span>
          <span style={{marginLeft: "0.5em"}} className="pull-left">Livecoding.tv</span>
          <span className="pull-right"><i id="livecodingtv-check" className="fa fa-check"/></span>
          </button>
          <button id="niconico-button" className="btn btn-secondary text-left">
          <span style={{width: 16, height: 16}} className="pull-left">
          <img src="http://www.nicovideo.jp/favicon.ico" width="16" height="16" onerror="this.style.display = 'none';"/>
          </span>
          <span style={{marginLeft: "0.5em"}} className="pull-left">niconico</span>
          <span className="pull-right"><i id="niconico-check" className="fa fa-check"/>
          </span>
          </button>
          <button id="other-button" className="btn btn-secondary text-left">
          <span className="pull-left"><img width="16" height="16"/></span>
          <span style={{marginLeft: "0.5em"}} className="pull-left">Other</span>
          <span className="pull-right"><i id="other-check" className="fa fa-check"/></span>
          </button>
        </div>
        <div style={{display: "none"}} id="twitch-option" className="col-sm-8">
          <div className="row">
            <div className="col-sm-push-3 col-sm-9">
              <div className="checkbox">
                <label>
                  <input type="checkbox" id="twitch-enabled"/><span className="i18n-enable"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3 text-right">
              <label for="twitch-fms" className="form-control-static">FMS URL:</label>
            </div>
            <div className="col-sm-9">
              <select style={{height: 40}} id="twitch-fms" className="form-control"></select>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3 text-right">
              <label for="twitch-key" className="form-control-static i18n-stream-key"></label>
            </div>
            <div className="col-sm-9">
              <input style={{width: "100%"}} type="text" id="twitch-key" className="form-control"/>
            </div>
          </div>
          <div style={{marginTop: "1em"}} className="row">
            <div className="col-sm-12 text-right">
            <a href="http://www.twitch.tv/" target="_blank" className="selectable">http://www.twitch.tv/</a>
            </div>
          </div>
        </div>
        <div style={{display: "none"}} id="peercaststation-option" className="col-sm-8">
          <div className="row">
            <div className="col-sm-push-3 col-sm-9">
              <div className="checkbox">
                <label>
                  <input type="checkbox" id="peercaststation-enabled"/><span className="i18n-enable"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3 text-right">
              <label for="peercaststation-fms" className="form-control-static">FMS URL:</label>
            </div>
            <div className="col-sm-9">
              <input style={{width: "100%"}} type="text" id="peercaststation-fms" className="form-control"/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-push-3 col-sm-9 i18n-notification-for-peercaststation"></div>
          </div>
          <div style={{marginTop: "1em"}} className="row">
            <div className="col-sm-12 text-right">
            <a href="http://www.pecastation.org/" target="_blank" className="selectable">http://www.pecastation.org/</a>
            </div>
          </div>
        </div>
          <div style={{display:"none"}}>
        // .col-sm-8(style='display: none;')#cavetube-option
        //   .row
        //     .col-sm-push-3.col-sm-9
        //       .checkbox
        //         label
        //           input(type='checkbox')#cavetube-enabled
        //           span.i18n-enable
        //   .row
        //     .col-sm-3.text-right
        //       label.form-control-static(for='cavetube-fms') FMS URL:
        //     .col-sm-9
        //       input.form-control(style='width: 100%', type='text')#cavetube-fms
        //   .row
        //     .col-sm-3.text-right
        //       label.form-control-static.i18n-stream-key(for='cavetube-key')
        //     .col-sm-9
        //       input.form-control(style='width: 100%', type='text')#cavetube-key
        </div>
        <div style={{display: "none"}} id="livecodingtv-option" className="col-sm-8">
          <div className="row">
            <div className="col-sm-push-3 col-sm-9">
              <div className="checkbox">
                <label>
                  <input type="checkbox" id="livecodingtv-enabled"/><span className="i18n-enable"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3 text-right">
              <label for="livecodingtv-fms" className="form-control-static">FMS URL:</label>
            </div>
            <div className="col-sm-9">
              <input style={{width: "100%"}} type="text" id="livecodingtv-fms" className="form-control"/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3 text-right">
              <label for="livecodingtv-key" className="form-control-static i18n-stream-key"></label>
            </div>
            <div className="col-sm-9">
              <input style={{width: "100%"}} type="text" id="livecodingtv-key" className="form-control"/>
            </div>
          </div>
          <div style={{marginTop: "1em"}} className="row">
            <div className="col-sm-12 text-right">
            <a href="https://www.livecoding.tv/" target="_blank" className="selectable">https://www.livecoding.tv/</a>
            </div>
          </div>
        </div>
        <div style={{display: "none"}} id="niconico-option" className="col-sm-8">
          <div className="row">
            <div className="col-sm-push-3 col-sm-9">
              <div className="checkbox">
                <label>
                  <input type="checkbox" id="niconico-enabled"/><span className="i18n-enable"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3 text-right">
              <label for="niconico-fms" className="form-control-static">FMS URL:</label>
            </div>
            <div className="col-sm-9">
              <input style={{width: "100%"}} type="text" id="niconico-fms" className="form-control"/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3 text-right">
              <label for="niconico-key" className="form-control-static i18n-stream-key"></label>
            </div>
            <div className="col-sm-9">
              <input style={{width: "100%"}} type="text" id="niconico-key" className="form-control"/>
            </div>
          </div>
          <div style={{marginTop: "1em"}} className="row">
            <div className="col-sm-12 text-right">
            <a href="http://live.nicovideo.jp/" target="_blank" className="selectable">http://live.nicovideo.jp/</a>
            </div>
          </div>
        </div>
        <div style={{display: "none"}} id="other-option" className="col-sm-8">
          <div className="row">
            <div className="col-sm-push-3 col-sm-9">
              <div className="checkbox">
                <label>
                  <input type="checkbox" id="other-enabled"/><span className="i18n-enable"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3 text-right">
              <label for="other-fms" className="form-control-static">FMS URL:</label>
            </div>
            <div className="col-sm-9">
              <input style={{width: "100%"}} type="text" id="other-fms" className="form-control"/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3 text-right">
              <label for="other-key" className="form-control-static i18n-stream-key"></label>
            </div>
            <div className="col-sm-9">
              <input style={{width: "100%"}} type="text" id="other-key" className="form-control"/>
            </div>
          </div>
        </div>
      </div>
    </fieldset>;
}
