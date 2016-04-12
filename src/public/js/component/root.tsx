import * as React from "react";

import LocalSettings from "./localsettings";
import ServiceSettings from "./servicesettings";
import Footer from "./footer";

export default class Root extends React.Component<{}, { needRestart: boolean }> {
    constructor() {
        super();
        this.state = { needRestart: false };
    }

    setNeedRestart(value: boolean) {
        this.setState({ needRestart: value });
    }

    render() {
        return <div id="root" style={{ display: "none" }} className="container">
            <p>
                <LocalSettings/>
                <ServiceSettings/>
            </p>
            <hr/>
            <Footer needRestart={this.state.needRestart}/>
        </div>;
    }
}
