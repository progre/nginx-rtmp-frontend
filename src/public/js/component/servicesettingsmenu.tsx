import * as React from "react";
import { ServiceDefinition, ServiceConfig } from "../domain/domains";

export default function ServiceSettingsMenu(props: {
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
                    let definition = props.serviceDefinitions.find(x => x.name === name) !;
                    let config = props.serviceConfigs.find(x => x.name === name) !;
                    return <MenuItem
                        key={definition.name}
                        primary={name === props.selectedService}
                        serviceDefinition={definition}
                        serviceConfig={config}
                        onClick={() => props.onMenuClick(name)} />;
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
        className={"btn text-left " + (props.primary ? "btn-primary" : "btn-secondary")}
        onClick={props.onClick}>
        <span style={{ width: 16, height: 16 }} className="pull-left">
            <img
                src={props.serviceDefinition.icon!}
                width="16"
                height="16"
                onerror="this.style.display = 'none';" />
        </span>
        <span style={{ marginLeft: "0.5em" }} className="pull-left">
            {props.serviceDefinition.label}
        </span>
        <span className="pull-right">
            <i id={`${props.serviceDefinition.name}-check`}
                className="fa fa-check"
                style={{ display: props.serviceConfig.enabled ? "initial" : "none" }} />
        </span>
    </button>;
}
