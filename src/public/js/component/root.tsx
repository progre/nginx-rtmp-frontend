import * as React from "react";
import { ServiceConfig } from "../domain/domains";
import LocalSettings from "./localsettings";
import ServiceSettings from "./servicesettings";
import Footer from "./footer";

export interface Props {
    initialState: State;
    twitchIngests: { name: string; url: string; }[];
    onNginxPathSelectorLaunch: () => void;
    onNginxPathChange: (path: string) => void;
    onPortChange: (port: number) => void;
    onEnabledChange: (service: string, value: boolean) => void;
    onFMSChange: (service: string, value: string) => void;
    onStreamKeyChange: (service: string, value: string) => void;
    onRestart: React.MouseEventHandler;
}

export interface State {
    nginxPath: string;
    port: number;
    needRestart: boolean;
    serviceConfigs: ServiceConfig[];
}

export default class Root extends React.Component<Props, State> {
    componentWillMount() {
        this.state = this.props.initialState;
    }

    render() {
        return <div className="container">
            <LocalSettings
                nginxPath={this.state.nginxPath}
                port={this.state.port}
                onNginxPathSelectorLaunch={this.props.onNginxPathSelectorLaunch}
                onNginxPathChange={path => {
                    this.setState({ needRestart: true } as any);
                    this.props.onNginxPathChange(path);
                } }
                onPortChange={port => {
                    this.setState({ needRestart: true } as any);
                    this.props.onPortChange(port);
                } } />
            <ServiceSettings
                serviceConfigs={this.state.serviceConfigs}
                twitchIngests={this.props.twitchIngests}
                onEnabledChange={this.props.onEnabledChange}
                onFMSChange={this.props.onFMSChange}
                onStreamKeyChange={this.props.onStreamKeyChange} />
            <hr />
            <Footer
                needRestart={this.state.needRestart}
                onRestart={this.props.onRestart} />
        </div>;
    }
}
