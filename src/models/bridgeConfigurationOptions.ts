import { IPluggableRegistry } from "./ocn/pluggableRegistry";
import { IRole } from "./ocpi/credentials";
import { IPluggableAPI } from "./pluggableAPI";
import { IPluggableDB } from "./pluggableDB";

export interface IBridgeConfigurationOptions {
    publicBridgeURL: string
    ocnClientURL: string
    roles: IRole[]
    pluggableAPI: IPluggableAPI
    pluggableDB: IPluggableDB
    pluggableRegistry: IPluggableRegistry
    port?: number
    logger?: boolean
    dryRun?: boolean
}
