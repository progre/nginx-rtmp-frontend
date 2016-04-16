export interface ServiceDefinition {
    name: string;
    icon: string;
    url: string;
    label: string;
}

export interface ServiceConfig {
    name: string;
    enabled: boolean;
    fms: string;
    key: string;
}
