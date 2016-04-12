import * as React from "react";

import LocalSettings from "./localsettings";
import ServiceSettings from "./servicesettings";
import Footer from "./footer";

export default function Root() {
    return <div id="root" style={{ display: "none" }} className="container">
        <p>
            <LocalSettings/>
            <ServiceSettings/>
        </p>
        <hr/>
        <Footer/>
    </div>;
}
