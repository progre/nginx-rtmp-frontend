import * as React from "react";

export default function Footer() {
    return <fieldset class="text-right">
        <div class="row">
            <div class="col-sm-12">
                <button type="button" id="restart-button" class="btn btn-secondary i18n-restart-nginx"></button>
            </div>
        </div>
        <div class="row">
            <div style="display: none;" id="restart-message" class="col-sm-12 i18n-notification-for-restart-nginx"></div>
        </div>
    </fieldset>;
}
