import { ICredentials, IRole } from "../../src/models/ocpi/credentials"
import { IToken } from "../../src/models/ocpi/tokens";

export const testRoles: IRole[] = [
    {
        role: "CPO",
        business_details: {
            name: "test CPO"
        },
        party_id: "CPO",
        country_code: "MSP"
    }
]

export const testToken: IToken = {
    country_code: "DE",
    party_id: "MSP",
    uid: "0102030405",
    type: "AD_HOC_USER",
    contract_id: "DE-123-XX",
    issuer: "test MSP",
    valid: true,
    whitelist: "ALWAYS",
    last_updated: (new Date()).toISOString()
}

export const testCredentials: ICredentials = {
    token: "token-b",
    url: "http://localhost:3000/ocpi/versions",
    roles: testRoles
}
