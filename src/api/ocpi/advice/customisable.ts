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
import * as url from "url";
import { IModules, ModuleImplementation } from "../../../models/bridgeConfigurationOptions";
import { identifier, IEndpoint, role } from "../../../models/ocpi/common";
import { IPluggableAPI } from "../../../models/pluggableAPI";

interface INeededModules {
    SENDER: identifier[]
    RECEIVER: identifier[]
}

/**
 * OCPI Module Customisation Advice for OCPI controllers
 */
export class CustomisableController {

    /**
     * Gets endpoints for the VersionController (version detail endpoint) based on user preference
     * @param publicIP user-defined public-facing IP that the bridge uses
     * @param modules user-defined OCPI modules and interfaces which should be implemented by bridge
     */
    public static getNeededEndpoints(publicIP: string, modules: IModules): IEndpoint[] {
        const endpoints = []
        const needed = this.getNeededModules(modules)

        for (const [moduleRole, moduleIdentifiers] of Object.entries(needed)) {
            for (const moduleIdentifier of moduleIdentifiers) {
                endpoints.push({
                    identifier: moduleIdentifier,
                    role: moduleRole,
                    url: url.resolve(publicIP, `/ocpi/${moduleRole.toLowerCase()}/2.2/${moduleIdentifier}`)
                })
            }
        }
        return endpoints
    }

    /**
     * Tells the caller (controller) whether a given module ID and interface combination can be included in the app's routes
     * @param includableID desired OCPI module ID
     * @param includableRole desired OCPI module Role
     * @param modules user-defined OCPI modules to be implemented by bridge
     * @param api user-defined pluggable API which implements the modules given
     */
    public static isIncluded(includableID: identifier, includableRole: role, modules: IModules, api: IPluggableAPI): boolean {
        const needed = this.getNeededModules(modules)
        const canBeIncluded = needed[includableRole].includes(includableID)
        const implementation = api[includableID]
        if (implementation && Object.keys(implementation).includes(includableRole.toLowerCase())) {
            return canBeIncluded
        }
        if (canBeIncluded) {
            throw Error(`Expected ${includableRole} ${includableID} implementation, found none`)
        }
        return false
    }

    /**
     * Extracts needed OCPI modules and interfaces based on IModules object
     * @param modules user-defined modules to be included
     */
    private static getNeededModules(modules: IModules): INeededModules {
        const needed: INeededModules = { SENDER: [], RECEIVER: [] }

        switch (modules.implementation) {
            case ModuleImplementation.ALL:
                needed.SENDER = ["commands", "locations", "tariffs", "cdrs", "sessions"],
                needed.RECEIVER = ["commands", "sessions", "cdrs"]
                break
            case ModuleImplementation.CPO:
                needed.SENDER = ["locations", "tariffs", "cdrs", "sessions"],
                needed.RECEIVER = ["commands"]
                break
            case ModuleImplementation.MSP:
                needed.SENDER = ["commands"],
                needed.RECEIVER = ["sessions", "cdrs"]
                break
            case ModuleImplementation.CUSTOM:
                if (!modules.sender || !modules.receiver) {
                    throw Error("Module implementation is \"CUSTOM\" but sender and receiver interfaces not provided")
                }
                needed.SENDER = modules.sender,
                needed.RECEIVER = modules.receiver
        }

        return needed
    }
}
