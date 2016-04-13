import * as React from "react";
import * as ReactDOM from "react-dom";
import * as uuid from "node-uuid";

export default class LocalSettings extends React.Component<{}, { fmsURL: string }> {
    render() {
        return <fieldset>
            <legend className="i18n-local-settings"/>
            <div className="row">
                <div className="col-sm-3 text-right">
                    <label for="nginx-path" className="form-control-static i18n-path-to-nginx"/>
                </div>
                <div className="col-sm-9">
                    <div className="input-group">
                        <input id="nginx-path" type="text" style={{ width: "100%" }} className="form-control"/>
                        <span className="input-group-btn">
                            <button id="select-button" type="button" className="btn btn-secondary i18n-select"/>
                        </span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-3 text-right">
                    <label for="port" className="form-control-static i18n-port"/>
                </div>
                <div className="col-sm-2">
                    <input id="port" placeholder="1935" type="number" min="1" max="65535" className="form-control"/>
                </div>
            </div>
            <hr/>
            <FMSURL value={this.state.fmsURL}/>
            <div className="row">
                <div className="col-sm-push-3 col-sm-9 i18n-notification-for-fms-url"/>
            </div>
        </fieldset>;
    }
}

class FMSURL extends React.Component<{ value: string }, void> {
    render() {
        let id = uuid.v4();
        return <div className="row">
            <div className="col-sm-3 text-right">
                <label for={id} className="form-control-static">FMS URL: </label>
            </div>
            <div className="col-sm-6">
                <div className="input-group">
                    <input ref="input" type="text" readOnly style={{ width: "100%" }} id={id} className="form-control"/>
                    <span className="input-group-btn">
                        <button type="button" className="btn btn-secondary" onClick={() => this.copy() }>
                            <i className="fa fa-files-o"/>
                            <span style={{ marginLeft: "0.5em" }} className="i18n-copy"/>
                        </button>
                    </span>
                </div>
            </div>
        </div>;
    }

    private copy() {
        let input = ReactDOM.findDOMNode(this.refs["input"]) as HTMLInputElement;
        input.focus();
        input.select();
        document.execCommand("copy");
    }
}
