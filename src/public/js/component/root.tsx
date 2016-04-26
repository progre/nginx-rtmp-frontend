import * as React from "react";
import {ServiceConfig} from "../domain/domains";
import LocalSettings from "./localsettings";
import ServiceSettings from "./servicesettings";
import Footer from "./footer";

export interface Props {
    initialState: State;
    twitchIngests: { name: string; url: string; }[];
    onNginxPathSelectorLaunch: () => Promise<string>;
    onNginxPathChange: (path: string) => void;
    onFfmpegPathSelectorLaunch: () => Promise<string>;
    onFfmpegPathChange: (path: string) => void;
    onPortChange: (port: number) => void;
    onEnabledChange: (service: string, value: boolean) => void;
    onFMSChange: (service: string, value: string) => void;
    onStreamKeyChange: (service: string, value: string) => void;
    onRestart: Function;
}

export interface State {
    nginxPath?: string;
    ffmpegPath?: string;
    port?: number;
    needRestart?: boolean;
    serviceConfigs?: ServiceConfig[];
}

export default class Root extends React.Component<Props, State> {
    componentWillMount() {
        this.state = this.props.initialState;
    }

    render() {
        return <div className="container">
            <LocalSettings
                nginxPath={this.state.nginxPath}
                ffmpegPath={this.state.ffmpegPath}
                port={this.state.port}
                onNginxPathSelectorLaunch={this.props.onNginxPathSelectorLaunch}
                onNginxPathChange={path => {
                    this.setState({ needRestart: true });
                    this.props.onNginxPathChange(path);
                } }
                onFfmpegPathSelectorLaunch={this.props.onFfmpegPathSelectorLaunch}
                onFfmpegPathChange={path => {
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
                onEnabledChange={this.props.onEnabledChange}
                onFMSChange={this.props.onFMSChange}
                onStreamKeyChange={this.props.onStreamKeyChange}/>
            <hr/>
            <Footer
                needRestart={this.state.needRestart}
                onRestart={this.props.onRestart}/>
        </div>;
    }
}
