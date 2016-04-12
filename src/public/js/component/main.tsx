import * as React from "react";
import LocalSettings from "./localsettings";
import ServiceSettings from "./servicesettings";
import Footer from "./footer";

function Main() {
    return <div id="root" style="display: none;" class="container">
        <p>
            <LocalSettings/>
            <ServiceSettings/>
        </p>
        <hr/>
        <Footer/>
    </div>;
}
