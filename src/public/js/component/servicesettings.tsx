import * as React from "react";
import {t} from "i18next";

const SERVICES = [
    {
        name: "twitch",
        icon: "http://www.twitch.tv/favicon.ico",
        url: "http://www.twitch.tv/",
        label: "Twitch"
    },
    {
        name: "peercaststation",
        icon: "http://127.0.0.1:7144/html/favicon.ico",
        url: "http://www.pecastation.org/",
        label: "PeerCastStation"
    },
    // {
    //     name: "cavetube",
    //     icon: null,
    //     url: null,
    //     label: "CaveTube"
    // },
    {
        name: "livecodingtv",
        icon: "https://www.livecoding.tv/favicon.ico",
        url: "https://www.livecoding.tv/",
        label: "Livecoding.tv"
    },
    {
        name: "niconico",
        icon: "http://www.nicovideo.jp/favicon.ico",
        url: "http://live.nicovideo.jp/",
        label: "niconico"
    },
    {
        name: "other",
        icon: null as string,
        url: null as string,
        label: "Other"
    }
];

interface ServiceDefinition {
    name: string;
    icon: string;
    url: string;
    label: string;
}

export interface ServiceConfig {
    name: string;
    enabled: boolean;
    fms: string;
    key: string;
}

export interface Props {
    serviceConfigs: ServiceConfig[];
    onEnabledChange: (service: string, enabled: boolean) => void;
    twitchIngests: { name: string; url: string; }[];
}

export interface State {
    selectedService: string;
}

export default class ServiceSettings extends React.Component<Props, State> {
    constructor() {
        super();

        this.state = {
            selectedService: SERVICES[0].name
        };
    }

    render() {
        let selected = this.state.selectedService;
        let selectedDefinition = SERVICES.find(x => x.name === selected);
        let selectedConfig = this.props.serviceConfigs.find(x => x.name === selected);
        return <fieldset>
            <legend className="i18n-service-settings"></legend>
            <div className="row">
                <Menu
                    serviceDefinitions={SERVICES}
                    serviceConfigs={this.props.serviceConfigs}
                    selectedService={this.state.selectedService}
                    onMenuClick={service =>
                        this.setState({ selectedService: service }) }/>
                <Contents
                    definition={selectedDefinition}
                    config={selectedConfig}
                    twitchIngests={this.props.twitchIngests}
                    onEnabledChange={enabled => this.props.onEnabledChange(selected, enabled) }/>
            </div>
        </fieldset>;
    }
}

function Menu(props: {
    serviceDefinitions: ServiceDefinition[],
    serviceConfigs: ServiceConfig[],
    selectedService: string,
    onMenuClick: (service: string) => void
}) {
    return <div className="col-sm-4 btn-group-vertical">
        {
            props.serviceDefinitions
                .map(x => x.name)
                .map(name => {
                    let definition = props.serviceDefinitions.find(x => x.name === name);
                    let config = props.serviceConfigs.find(x => x.name === name);
                    return <MenuItem
                        primary={name === props.selectedService}
                        serviceDefinition={definition }
                        serviceConfig={config }
                        onClick={() => props.onMenuClick(name) }/>;
                })
        }
    </div>;
}

function MenuItem(props: {
    primary: boolean,
    serviceDefinition: ServiceDefinition,
    serviceConfig: ServiceConfig,
    onClick: () => void
}) {
    return <button
        className={"btn text-left " + (props.primary ? "btn-primary" : "btn-secondary") }
        onClick={props.onClick}>
        <span style={{ width: 16, height: 16 }} className="pull-left">
            <img
                src={props.serviceDefinition.icon}
                width="16"
                height="16"
                onerror="this.style.display = 'none';"/>
        </span>
        <span style={{ marginLeft: "0.5em" }} className="pull-left">
            {props.serviceDefinition.name}
        </span>
        <span className="pull-right">
            <i id={`${props.serviceDefinition.name}-check`}
                className="fa fa-check"
                style={{ display: props.serviceConfig.enabled ? "initial" : "none" }}/>
        </span>
    </button>;
}

function Contents(props: {
    definition: ServiceDefinition,
    config: ServiceConfig,
    twitchIngests: { name: string; url: string; }[];
    onEnabledChange: (enabled: boolean) => void
}) {
    return <div className="col-sm-8">
        <div className="row">
            <div className="col-sm-push-3 col-sm-9">
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={props.config.enabled}
                            onChange={e => props.onEnabledChange((e.target as HTMLInputElement).checked) }
                            id={`${props.definition.name}-enabled`}/>
                        <span className="i18n-enable"/>
                    </label>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-3 text-right">
                <label
                    for={`${props.definition.name}-fms`}
                    className="form-control-static">
                    FMS URL:
                </label>
            </div>
            <div className="col-sm-9">
                {
                    props.definition.name === "twitch"
                        ? <select
                            style={{ height: 40 }}
                            id={`${props.definition.name}-fms`}
                            className="form-control">
                            {
                                props.twitchIngests.map(ingest =>
                                    <option value={ingest.url}>
                                        {ingest.name}
                                    </option>)
                            }
                        </select>
                        : <input
                            style={{ width: "100%" }}
                            type="text"
                            id={`${props.definition.name}-fms`}
                            className="form-control"/>
                }
            </div>
        </div>
        {
            props.definition.name === "peercaststation"
                ? <div className="row">
                    <div className="col-sm-push-3 col-sm-9">
                        {t("notification-for-peercaststation") }
                    </div>
                </div>
                : <div className="row">
                    <div className="col-sm-3 text-right">
                        <label
                            for={`${props.definition.name}-key`}
                            className="form-control-static i18n-stream-key"/>
                    </div>
                    <div className="col-sm-9">
                        <input
                            style={{ width: "100%" }}
                            type="text"
                            id={`${props.definition.name}-key`}
                            className="form-control"/>
                    </div>
                </div>
        }
        <div style={{ marginTop: "1em" }} className="row">
            <div className="col-sm-12 text-right">
                <a href={props.definition.url} target="_blank" className="selectable">
                    {props.definition.url}
                </a>
            </div>
        </div>
    </div>;
}
