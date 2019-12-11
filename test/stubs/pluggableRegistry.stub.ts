import { IPluggableRegistry } from "../../src/models/ocn/pluggableRegistry";

export class PluggableRegistryStub implements IPluggableRegistry {

    constructor(private nodeURL: string = "", private nodeAddress: string = "0x0000000000000000000000000000000000000000") {}

    public async getNodeURL(): Promise<string> {
        return this.nodeURL
    }
    public async getNodeAddress(): Promise<string> {
        return this.nodeAddress
    }

    public async register(): Promise<boolean> {
        return true
    }

    public async update(): Promise<boolean> {
        return true
    }
}
