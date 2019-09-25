export interface IPluggableRegistry {
    getClientURL(countryCode: string, partyID: string): Promise<string>
    getClientAddress(countryCode: string, partyID: string): Promise<string>
    register(countryCode: string, partyID: string, clientURL: string, clientAddress: string, signerKey: string, spenderKey: string): Promise<boolean>
    update(countryCode: string, partyID: string, clientURL: string, clientAddress: string, signerKey: string, spenderKey: string): Promise<boolean>
}
