/*
    Copyright 2019-2020 eMobilify GmbH

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
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
    ocnNodeURL: string
    roles: IRole[]
    modules: IModules
    pluggableAPI: IPluggableAPI
    pluggableDB: IPluggableDB
    pluggableRegistry: IPluggableRegistry
    port?: number
    logger?: boolean
    dryRun?: boolean
    signatures?: boolean
}
