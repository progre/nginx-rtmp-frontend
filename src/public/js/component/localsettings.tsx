import * as React from "react";
import * as ReactDOM from "react-dom";
import * as uuid from "node-uuid";
import {t} from "i18next";

export interface Props {
    nginxPath: string;
    ffmpegPath: string;
    port: number;
    onNginxPathSelectorLaunch: () => Promise<string>;
    onNginxPathChange: (path: string) => void;
    onFfmpegPathSelectorLaunch: () => Promise<string>;
    onFfmpegPathChange: (path: string) => void;
    onPortChange: (port: number) => void;
}

function FileSelectorRow(props: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onSelectorLaunch: () => Promise<string>;
}) {
    let id = uuid.v4();
    return <div className="row">
        <div className="col-sm-3 text-right">
            <label for={id} className="form-control-static">
                {props.label }
            </label>
        </div>
        <div className="col-sm-9">
            <div className="input-group">
                <input
                    id={id}
                    type="text"
                    style={{ width: "100%" }}
                    className="form-control"
                    value={props.value}
                    onChange={e => props.onChange(
                        (e.target as HTMLInputElement).value) }/>
                <span className="input-group-btn">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={async () => {
                            let value = await props.onSelectorLaunch();
                            if (value != null) {
                                props.onChange(value);
                            }
                        } }>
                        {t("select") }
                    </button>
                </span>
            </div>
        </div>
    </div>;
}

export default class LocalSettings extends React.Component<Props, {}> {
    render() {
        let nginxPathId = uuid.v4();
        let portId = uuid.v4();
        let fmsURLId = uuid.v4();
        return <fieldset>
            <legend>
                {t("local-settings") }
            </legend>
            <FileSelectorRow
                label={t("path-to-nginx") }
                value={this.props.nginxPath}
                onChange={this.props.onNginxPathChange}
                onSelectorLaunch={this.props.onNginxPathSelectorLaunch}/>
            <FileSelectorRow
                label={t("path-to-ffmpeg") }
                value={this.props.ffmpegPath}
                onChange={this.props.onFfmpegPathChange}
                onSelectorLaunch={this.props.onFfmpegPathSelectorLaunch}/>
            <div className="row">
                <div className="col-sm-3 text-right">
                    <label for={portId} className="form-control-static">
                        {t("port") }
                    </label>
                </div>
                <div className="col-sm-2">
                    <input id={portId}
                        placeholder="1935"
                        type="number"
                        min="1"
                        max="65535"
                        className="form-control"
                        value={this.props.port}
                        onChange={e => this.props.onPortChange(Number.parseInt(
                            (e.target as HTMLInputElement).value
                        )) }/>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col-sm-3 text-right">
                    <label for={fmsURLId} className="form-control-static">
                        FMS URL:
                    </label>
                </div>
                <div className="col-sm-6">
                    <div className="input-group">
                        <input
                            ref="input"
                            type="text"
                            readOnly
                            style={{ width: "100%" }}
                            id={fmsURLId}
                            className="form-control"
                            value={this.getFMSURL() }/>
                        <span className="input-group-btn">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => this.copyFMSURL() }>
                                <i className="fa fa-files-o"/>
                                <span style={{ marginLeft: "0.5em" }}>
                                    {t("copy") }
                                </span>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-push-3 col-sm-9">
                    {t("notification-for-fms-url") }
                </div>
            </div>
        </fieldset>;
    }

    private getFMSURL() {
        let port = this.props.port;
        if (port == null || port === 1935) {
            return `rtmp://127.0.0.1/live`;
        } else {
            return `rtmp://127.0.0.1:${port}/live`;
        }
    }

    private copyFMSURL() {
        /* tslint:disable:no-string-literal */
        let input
            = ReactDOM.findDOMNode(this.refs["input"]) as HTMLInputElement;
        /* tslint:enable */
        input.select();
        document.execCommand("copy");
    }
}
