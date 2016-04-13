import * as React from "react";

import LocalSettings from "./localsettings";
import ServiceSettings from "./servicesettings";
import Footer from "./footer";

export interface Props {
    onNginxPathSelectorLaunch: () => void;
    onNginxPathChange: (path: string) => void;
    onPortChange: (port: number) => void;
    onRestart: Function;
}

export interface State {
    nginxPath?: string;
    port?: number;
    needRestart?: boolean;
}

export default class Root extends React.Component<Props, State> {
    constructor() {
        super();
        this.state = {
            nginxPath: "",
            port: 1935,
            needRestart: false
        };
    }

    render() {
        return <div className="container">
            <LocalSettings
                ref="local-settings"
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
            <ServiceSettings/>
            <hr/>
            <Footer
                needRestart={this.state.needRestart}
                onRestart={this.props.onRestart}/>
        </div>;
    }
}
