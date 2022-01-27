import { Permissions, Registry } from "@shareandcharge/ocn-registry";
import { IPluggableRegistry } from "../../src/models/ocn/pluggableRegistry";

export class PluggableRegistryStub implements IPluggableRegistry {

    public registry = new Registry('local');
    public permissions = new Permissions('local');

    constructor(private nodeURL: string = "", private nodeAddress: string = "0x0000000000000000000000000000000000000000") {}

    public async getNode(): Promise<{ operator: string, url: string }> {
        return { operator: this.nodeAddress, url: this.nodeURL }
    }

    public async setParty(): Promise<boolean> {
        return true
    }
}
