import { IVersionDetail } from "./ocpi/versions";

export interface IPluggableDB {
    getTokenB(): Promise<string>
    getTokenC(): Promise<string>
    setTokenB(tokenB: string): Promise<void>
    setTokenC(tokenC: string): Promise<void>
    saveEndpoints(versionDetail: IVersionDetail): Promise<void>
    getEndpoint(identifier: string, role: "SENDER" | "RECEIVER"): Promise<string>
}
