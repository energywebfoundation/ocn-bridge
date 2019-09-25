import { IVersionDetail } from "../../src/models/ocpi/versions";
import { IPluggableDB } from "../../src/models/pluggableDB";

export class PluggableDBStub implements IPluggableDB {

    private endpoints: Array<{
        identifier: string,
        role: string,
        url: string
    }> = []

    private tokenB: string = ""
    private tokenC: string = ""

    public async getTokenB(): Promise<string> {
        return this.tokenB
    }

    public async setTokenB(tokenB: string) {
        this.tokenB = tokenB
    }

    public async getTokenC(): Promise<string> {
        return this.tokenC
    }

    public async setTokenC(tokenC: string) {
        this.tokenC = tokenC
    }

    public async saveEndpoints(versionDetail: IVersionDetail) {
        this.endpoints = versionDetail.endpoints
        return
    }

    public async getEndpoint(identifier: string, role: string): Promise<string> {
        const endpoint = this.endpoints.find((e) => (e.identifier === identifier) && (e.role === role))
        if (!endpoint) {
            throw Error("No endpoint found")
        }
        return endpoint.url
    }

}
