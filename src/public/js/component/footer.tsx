import * as React from "react";

export default function Footer() {
    return <fieldset className="text-right">
        <div className="row">
            <div className="col-sm-12">
                <button
                    type="button"
                    id="restart-button"
                    className="btn btn-secondary i18n-restart-nginx"/>
            </div>
        </div>
        <div className="row">
            <div
                style={{ display: "none" }}
                id="restart-message"
                className="col-sm-12 i18n-notification-for-restart-nginx"/>
        </div>
    </fieldset>;
}
