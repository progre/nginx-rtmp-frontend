import * as fs from 'fs';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
import promisify from 'native-promisify';
const NginxConfFile = require('nginx-conf').NginxConfFile;
const create = promisify(NginxConfFile.create);

const exists = (path: string) =>
    new Promise((resolve, reject) => fs.exists(path, resolve));

export default class NginxConfig {
    private enabledServices: EnabledServices;
    private disabledServices: DisabledServices;

    static async new(configPath: string, configTemplatePath: string) {
        if (!(await exists(configPath))) {
            await new Promise((resolve, reject) =>
                fs.createReadStream(configTemplatePath)
                    .pipe(fs.createWriteStream(configPath))
                    .once('error', reject)
                    .once('close', resolve));
        }
        return new this(await create(configPath));
    }

    constructor(private conf: any) {
        this.enabledServices = new EnabledServices(conf.nginx.rtmp.server.application);
        this.disabledServices = new DisabledServices(conf.nginx.rtmp._comments);
    }

    get port() {
        return <number>this.server.listen._value;
    }

    set port(value: number) {
        this.server.listen._value = value;
    }

    fms(service: string) {
        let e = this.enabledServices.get(service);
        if (e != null) {
            return e.fms;
        }
        let d = this.disabledServices.get(service);
        if (d != null) {
            return d.fms;
        }
        return null;
    }

    setFms(service: string, fms: string) {
        let e = this.enabledServices.get(service);
        if (e != null) {
            this.enabledServices.update(e, { fms });
            return;
        }
        let d = this.disabledServices.get(service);
        if (d != null) {
            this.disabledServices.update(d, { fms });
            return;
        }
        this.disabledServices.add({ service, fms, key: '' });
    }

    key(service: string) {
        let e = this.enabledServices.get(service);
        if (e != null) {
            return e.key;
        }
        let d = this.disabledServices.get(service);
        if (d != null) {
            return d.key;
        }
        return null;
    }

    setKey(service: string, key: string) {
        let e = this.enabledServices.get(service);
        if (e != null) {
            this.enabledServices.update(e, { key });
            return;
        }
        let d = this.disabledServices.get(service);
        if (d != null) {
            this.disabledServices.update(d, { key });
            return;
        }
        this.disabledServices.add({ service, fms: '', key });
    }

    enabled(service: string) {
        return this.enabledServices.get(service) != null;
    }

    enable(service: string) {
        let item = this.disabledServices.get(service);
        if (item != null) {
            this.disabledServices.remove(item);
            this.enabledServices.add(item);
        } else {
            this.enabledServices.add({ service, fms: '', key: '' });
        }
    }

    disable(service: string) {
        let item = this.enabledServices.get(service);
        if (item == null) {
            return;
        }
        this.enabledServices.remove(item);
        this.disabledServices.add(item);
    }

    save() {
        this.conf.flush();
    }

    private get application() {
        return this.server.application;
    }

    private get server() {
        return this.conf.nginx.rtmp.server;
    }
}

interface Service {
    index: number;
    service: string;
    fms: string;
    key: string;
}

class EnabledServices {
    constructor(private container: any) {
    }

    get(service: string) {
        let items = this.items()
            .filter(x => x.service === service);
        if (items.length <= 0) {
            return null;
        }
        return items[0];
    }

    update(item: Service, data: { fms?: string, key?: string }) {
        let i = this.getPushList()[item.index];
        let [fms, key] = i._value.split(' ');
        key = key.replace(/^playpath=/, '');
        if (data.fms != null) {
            fms = data.fms;
        }
        if (data.key != null) {
            key = data.key;
        }
        i._value = `${fms} playpath=${key}`;
    }

    add(item: { service: string, fms: string, key: string }) {
        this.container._add('push', `${item.fms} playpath=${item.key}`);
        let list = this.getPushList();
        list[list.length - 1]._comments.push(item.service);
    }

    remove(item: Service) {
        this.container._remove('push', item.index);
    }

    private items() {
        return this.getPushList()
            .map((x, index) => {
                let [fms, key] = (<string>x._value).split(' ');
                return <Service>{
                    index,
                    service: x._comments[0],
                    fms,
                    key: key.replace(/^playpath=/, '')
                };
            });
    }

    private getPushList() {
        let push = this.container.push;
        if (push == null) {
            return [];
        }
        if (!(push instanceof Array)) {
            return [push];
        }
        return <any[]>push;
    }
}

class DisabledServices {
    constructor(private container: string[]) {
    }

    get(service: string) {
        let items = this.items()
            .filter(x => x.service === service);
        if (items.length <= 0) {
            return null;
        }
        return items[0];
    }

    update(item: Service, data: { fms?: string, key?: string }) {
        let [service, fms, key] = this.container[item.index].split(' ');
        key = key.replace(/^playpath=/, '');
        if (data.fms != null) {
            fms = data.fms;
        }
        if (data.key != null) {
            key = data.key;
        }
        this.container[item.index] = `${service} ${fms} ${key}`;
    }

    add(item: { service: string, fms: string, key: string }) {
        this.container.push(`${item.service} ${item.fms} ${item.key}`);
    }

    remove(item: Service) {
        this.container.splice(item.index, 1);
    }

    private items() {
        return this.container
            .map((x, index) => {
                let [service, fms, key] = x.split(' ');
                return <Service>{
                    index,
                    service,
                    fms,
                    key: key.replace(/^playpath=/, '')
                };
            });
    }
}
