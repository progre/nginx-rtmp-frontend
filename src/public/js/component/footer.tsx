import * as React from "react";
import { t } from "i18next";

export default function Footer(props: { needRestart: boolean, onRestart: React.MouseEventHandler }) {
    return <fieldset className="text-right">
        <div className="row">
            <div className="col-sm-12">
                <button
                    type="button"
                    onClick={props.onRestart}
                    className={[
                        "btn",
                        props.needRestart ? "btn-primary" : "btn-secondary"
                    ].join(" ")}>
                    {t("restart-nginx")}
                </button>
            </div>
        </div>
        <div className="row">
            <div
                style={{ display: props.needRestart ? "initial" : "none" }}
                className="col-sm-12">
                {t("notification-for-restart-nginx")}
            </div>
        </div>
    </fieldset>;
}
