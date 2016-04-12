import * as React from "react";

export default function LocalSettings() {
    return <fieldset>
        <legend class="i18n-local-settings"></legend>
        <div class="row">
            <div class="col-sm-3 text-right">
                <label for="nginx-path" class="form-control-static i18n-path-to-nginx"></label>
            </div>
            <div class="col-sm-9">
                <div class="input-group">
                    <input id="nginx-path" type="text" style="width: 100%;" class="form-control"/>
                    <span class="input-group-btn">
                        <button id="select-button" type="button" class="btn btn-secondary i18n-select"></button>
                    </span>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-3 text-right">
                <label for="port" class="form-control-static i18n-port"></label>
            </div>
            <div class="col-sm-2">
                <input id="port" placeholder="1935" type="number" min="1" max="65535" class="form-control"/>
            </div>
        </div>
        <hr/>
        <div class="row">
            <div class="col-sm-3 text-right">
                <label for="fms" class="form-control-static">FMS URL: </label>
            </div>
            <div class="col-sm-6">
                <div class="input-group">
                    <input type="text" readonly style="width: 100%;" id="fms" class="form-control"/><span class="input-group-btn">
                        <button type="button" id="copy" class="btn btn-secondary"><i class="fa fa-files-o"></i><span style="margin-left: 0.5em;" class="i18n-copy"></span></button></span>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-push-3 col-sm-9 i18n-notification-for-fms-url"></div>
        </div>
    </fieldset>;
}
