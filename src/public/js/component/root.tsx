import * as React from "react";

import LocalSettings from "./localsettings";
import ServiceSettings, {ServiceConfig} from "./servicesettings";
import Footer from "./footer";

export interface Props {
    initialState: State;
    twitchIngests: { name: string; url: string; }[];
    onNginxPathSelectorLaunch: () => void;
    onNginxPathChange: (path: string) => void;
    onPortChange: (port: number) => void;
    onEnabledChange: (service: string, enabled: boolean) => void;
    onRestart: Function;
}

export interface State {
    nginxPath?: string;
    port?: number;
    needRestart?: boolean;
    serviceConfigs?: ServiceConfig[]
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
                    this.setState({ needRestart: true });
                    this.props.onNginxPathChange(path);
                } }
                onPortChange={port => {
                    this.setState({ needRestart: true });
                    this.props.onPortChange(port);
                } }/>
            <ServiceSettings
                serviceConfigs={this.state.serviceConfigs}
                twitchIngests={this.props.twitchIngests}
                onEnabledChange={this.props.onEnabledChange}/>
            <hr/>
            <Footer
                needRestart={this.state.needRestart}
                onRestart={this.props.onRestart}/>
        </div>;
    }
}
