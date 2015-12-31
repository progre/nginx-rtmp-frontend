declare module "native-promisify" {
    export default function promisify(func: (...args: any[]) => void): (...args: any[]) => Promise<any>;
}
