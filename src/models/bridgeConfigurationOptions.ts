import { IPluggableRegistry } from "./ocn/pluggableRegistry";
import { identifier } from "./ocpi/common";
import { IRole } from "./ocpi/credentials";
import { IPluggableAPI } from "./pluggableAPI";
import { IPluggableDB } from "./pluggableDB";

export enum ModuleImplementation {
    ALL,
    CPO,
    MSP,
    CUSTOM
}

export interface IModules {
    implementation: ModuleImplementation
    sender?: identifier[]
    receiver?: identifier[]
}

export interface IBridgeConfigurationOptions {
    publicBridgeURL: string
    ocnClientURL: string
    roles: IRole[]
    modules: IModules
    pluggableAPI: IPluggableAPI
    pluggableDB: IPluggableDB
    pluggableRegistry: IPluggableRegistry
    port?: number
    logger?: boolean
    dryRun?: boolean
}
