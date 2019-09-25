import { IPluggableRegistry } from "../../src/models/ocn/pluggableRegistry";

export class PluggableRegistryStub implements IPluggableRegistry {

    constructor(private clientURL: string = "", private clientAddress: string = "0x0000000000000000000000000000000000000000") {}

    public async getClientURL(): Promise<string> {
        return this.clientURL
    }
    public async getClientAddress(): Promise<string> {
        return this.clientAddress
    }

    public async register(): Promise<boolean> {
        return true
    }

    public async update(): Promise<boolean> {
        return true
    }
}
