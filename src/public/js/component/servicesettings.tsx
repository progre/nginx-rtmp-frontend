import * as React from "react";

export default function ServiceSettings() {
    let services = [
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
            icon: null,
            label: "Other"
        }
    ];
    return <fieldset>
        <legend className="i18n-service-settings"></legend>
        <div className="row">
            <Menu services={services}/>
            <ContentsWrapper/>
        </div>
    </fieldset>;
}

function Menu(props: { services: { name: string; icon: string; label: string; }[] }) {
    return <div className="col-sm-4 btn-group-vertical">
        {
            props.services.map(service =>
                <MenuItem
                    name={service.name}
                    icon={service.icon}
                    label={service.label}/>)
        }
    </div>;
}

function MenuItem(
    props: { name: string; icon: string; label: string; }
) {
    return <button id={`${props.name}-button`} className="btn btn-secondary text-left">
        <span style={{ width: 16, height: 16 }} className="pull-left">
            <img src={props.icon} width="16" height="16" onerror="this.style.display = 'none';"/>
        </span>
        <span style={{ marginLeft: "0.5em" }} className="pull-left">Other</span>
        <span className="pull-right"><i id={`${props.name}-check`} className="fa fa-check"/></span>
    </button>;
}

function ContentsWrapper(
    props: { services: { name: string; url: string; }[] }
) {
    return <div>
        {
            props.services.map(service =>
                <Contents name={service.name} url={service.url}/>)
        }
    </div>;
}

function Contents(props: { name: string, url: string }) {
    return <div style={{ display: "none" }} id={`${props.name}-option`} className="col-sm-8">
        <div className="row">
            <div className="col-sm-push-3 col-sm-9">
                <div className="checkbox">
                    <label>
                        <input type="checkbox" id={`${props.name}-enabled`}/>
                        <span className="i18n-enable"/>
                    </label>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-3 text-right">
                <label for={`${props.name}-fms`} className="form-control-static">
                    FMS URL:
                </label>
            </div>
            <div className="col-sm-9">
                {
                    props.name === "twitch"
                        ? <select style={{ height: 40 }} id="twitch-fms" className="form-control"/>
                        : <input style={{ width: "100%" }} type="text" id={`${props.name}-fms`} className="form-control"/>
                }
            </div>
        </div>
        <div className="row">
            <div className="col-sm-3 text-right">
                <label for={`${props.name}-key`} className="form-control-static i18n-stream-key"/>
            </div>
            <div className="col-sm-9">
                <input style={{ width: "100%" }} type="text" id={`${props.name}-key`} className="form-control"/>
            </div>
        </div>
        <div style={{ marginTop: "1em" }} className="row">
            <div className="col-sm-12 text-right">
                <a href={props.url} target="_blank" className="selectable">{props.url}</a>
            </div>
        </div>
    </div>;
}
