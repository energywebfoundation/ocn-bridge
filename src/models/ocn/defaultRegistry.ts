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

import { Registry, Permissions } from "@shareandcharge/ocn-registry"
import { Role } from "@shareandcharge/ocn-registry/dist/lib/types";
import { IPluggableRegistry } from "./pluggableRegistry";

export class DefaultRegistry implements IPluggableRegistry {

    public registry: Registry
    public permissions: Permissions

    constructor(environment: string, private signer?: string, private spender?: string) {
        if (environment === "docker") {
            const overrides = require(`${process.cwd()}/networks.json`)
            this.registry = new Registry("local", this.spender || this.signer, overrides)
            this.permissions = new Permissions("local", this.spender || this.signer, overrides)
        } else {
            this.registry = new Registry(environment, this.spender || this.signer)
            this.permissions = new Permissions(environment, this.spender || this.signer)
        }
    }

    public async getNode(countryCode: string, partyID: string): Promise<{ operator: string; url: string; }> {
        const party = await this.registry.getPartyByOcpi(countryCode, partyID)
        return party ? party.node : { operator: "0x0000000000000000000000000000000000000000", url: "" }
    }

    public async setParty(countryCode: string, partyID: string, roles: Role[], operator: string): Promise<boolean> {
        if (!this.signer) {
            throw Error("DefaultRegistry has no signer. Unable to set party in Registry.")
        }
        if (this.spender) {
            await this.registry.setPartyRaw(countryCode, partyID, roles, operator, this.signer)
        } else {
            await this.registry.setParty(countryCode, partyID, roles, operator)
        }
        return true
    }

}
