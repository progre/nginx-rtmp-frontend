import * as React from "react";

export default function Footer(props: { needRestart: boolean, onRestart: Function }) {
    return <fieldset className="text-right">
        <div className="row">
            <div className="col-sm-12">
                <button
                    type="button"
                    onClick={props.onRestart}
                    className={[
                        "btn",
                        "i18n-restart-nginx",
                        props.needRestart ? "btn-primary" : "btn-secondary"
                    ].join(" ") }/>
            </div>
        </div>
        <div className="row">
            <div
                style={{ display: props.needRestart ? "initial" : "none" }}
                className="col-sm-12 i18n-notification-for-restart-nginx"/>
        </div>
    </fieldset>;
}
