export interface IPluggableRegistry {
    getNodeURL(countryCode: string, partyID: string): Promise<string>
    getNodeAddress(countryCode: string, partyID: string): Promise<string>
    register(countryCode: string, partyID: string, nodeURL: string, nodeAddress: string, signerKey: string, spenderKey: string): Promise<boolean>
    update(countryCode: string, partyID: string, nodeURL: string, nodeAddress: string, signerKey: string, spenderKey: string): Promise<boolean>
}
