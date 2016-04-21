import * as os from "os";
const dialog: Electron.Dialog = require("dialog");
import Repository, {Config} from "./repository";

export default class Browser {
    constructor(private repo: Repository, public restart: () => void) {
    }

    getConfig() {
        return this.repo.getConfig();
    }

    setConfig(value: Config) {
        this.repo.setConfig(value);
    }

    showOpenDialog() {
        return new Promise<string>((resolve, reject) => {
            let filters = os.platform() === "win32"
                ? [{ name: "nginx.exe", extensions: ["exe"] }]
                : [];
            dialog.showOpenDialog(
                { filters },
                fileNames => resolve(fileNames == null ? null : fileNames[0]));
        });
    }
}
