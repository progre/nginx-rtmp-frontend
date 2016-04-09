declare module "native-promisify" {
    const promisify: (func: (...args: any[]) => void) => (...args: any[]) => Promise<any>;
    export = promisify;
}
