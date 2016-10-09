import * as React from "react";
import { t } from "i18next";
import * as uuid from "node-uuid";
import { ServiceDefinition, ServiceConfig } from "../domain/domains";

export default function ServiceSettingsContents(props: {
    definition: ServiceDefinition;
    config: ServiceConfig;
    twitchIngests: { name: string; url: string; }[];
    onEnabledChange: (value: boolean) => void;
    onFMSChange: (value: string) => void;
    onStreamKeyChange: (value: string) => void;
}) {
    let fmsId = uuid.v4();
    let streamKeyId = uuid.v4();
    return <div className="col-sm-8">
        <div className="row">
            <div className="col-sm-push-3 col-sm-9">
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={props.config.enabled}
                            onChange={e => props.onEnabledChange(
                                (e.target as HTMLInputElement).checked)} />
                        <span>{t("enable")}</span>
                    </label>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-3 text-right">
                <label
                    for={fmsId}
                    className="form-control-static">
                    FMS URL:
                </label>
            </div>
            <div className="col-sm-9">
                {
                    props.definition.name === "twitch"
                        ? <select
                            style={{ height: 40 }}
                            id={fmsId}
                            className="form-control"
                            value={props.config.fms}
                            onChange={e => props.onFMSChange(
                                (e.target as HTMLInputElement).value)}>
                            {
                                props.twitchIngests.map(ingest =>
                                    <option key={ingest.name} value={ingest.url}>
                                        {ingest.name}
                                    </option>)
                            }
                        </select>
                        : <input
                            style={{ width: "100%" }}
                            type="text"
                            id={fmsId}
                            className="form-control"
                            value={props.config.fms}
                            onChange={e => props.onFMSChange(
                                (e.target as HTMLInputElement).value)} />
                }
            </div>
        </div>
        {
            props.definition.name === "peercaststation"
                ? <div className="row">
                    <div className="col-sm-push-3 col-sm-9"
                        dangerouslySetInnerHTML={{ __html: t("notification-for-peercaststation") }} />
                </div>
                : <div className="row">
                    <div className="col-sm-3 text-right">
                        <label
                            for={streamKeyId}
                            className="form-control-static">
                            {t("stream-key")}
                        </label>
                    </div>
                    <div className="col-sm-9">
                        <input
                            style={{ width: "100%" }}
                            type="text"
                            id={streamKeyId}
                            className="form-control"
                            value={props.config.key}
                            onChange={e => props.onStreamKeyChange(
                                (e.target as HTMLInputElement).value)} />
                    </div>
                </div>
        }
        <div style={{ marginTop: "1em" }} className="row">
            <div className="col-sm-12 text-right">
                <a href={props.definition.url!}
                    target="_blank"
                    className="selectable">
                    {props.definition.url}
                </a>
            </div>
        </div>
    </div>;
}
