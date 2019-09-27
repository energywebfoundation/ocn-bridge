import { utils } from "ethers"
import fetch from "node-fetch";
import * as url from "url";
import * as uuid from "uuid";
import { IPluggableRegistry } from "../models/ocn/pluggableRegistry";
import { IClientInfo, registryListing } from "../models/ocn/registry";
import { IResponse } from "../models/ocpi/common";
import { ICredentials, IRole } from "../models/ocpi/credentials";
import { IVersionDetail, IVersions } from "../models/ocpi/versions";
import { IPluggableDB } from "../models/pluggableDB";

export class RegistrationService {

    constructor(private registry: IPluggableRegistry, private db: IPluggableDB) { }

    public async register(publicIP: string, clientURL: string, roles: IRole[]): Promise<void> {
        const clientInfo = await this.getClientInfo(clientURL)
        for (const role of roles) {
            const listing = await this.isListedInRegistry(role.country_code, role.party_id, clientInfo)
            switch (listing) {
                case registryListing.OK:
                    break
                case registryListing.REGISTER_REQUIRED:
                    const regKeys = this.getKeys("register")
                    await this.listInRegistry(role.country_code, role.party_id, clientInfo.url, clientInfo.address, regKeys.signer, regKeys.spender)
                    break
                case registryListing.UPDATE_REQUIRED:
                    const updateKeys = this.getKeys("update")
                    await this.updateInRegistry(role.country_code, role.party_id, clientInfo.url, clientInfo.address, updateKeys.signer, updateKeys.spender)
                    break
            }
        }
        const isConnected = await this.isConnectedToClient()
        if (isConnected) {
            return
        }
        if (!process.env.TOKEN_A) {
            throw Error("need TOKEN_A to complete registration process with OCN client")
        }
        await this.getClientEndpoints(url.resolve(clientURL, "/ocpi/versions"), process.env.TOKEN_A)
        await this.connectToClient({
            token: uuid.v4(),
            url: url.resolve(publicIP, "/ocpi/versions"),
            roles
        }, process.env.TOKEN_A)
    }

    public async getClientInfo(clientURL: string): Promise<IClientInfo> {
        const res = await fetch(url.resolve(clientURL, "/ocn/registry/client-info"))
        return res.json()
    }

    public async isListedInRegistry(countryCode: string, partyID: string, expectedClientInfo: IClientInfo): Promise<registryListing> {
        const clientURL = await this.registry.getClientURL(countryCode, partyID)
        const clientAddress = await this.registry.getClientAddress(countryCode, partyID)

        if ((clientURL === expectedClientInfo.url) && (utils.getAddress(clientAddress) === utils.getAddress(expectedClientInfo.address))) {
            return registryListing.OK
        } else if ((clientURL === "") && (clientAddress === "0x0000000000000000000000000000000000000000")) {
            return registryListing.REGISTER_REQUIRED
        } else {
            return registryListing.UPDATE_REQUIRED
        }
    }

    public async listInRegistry(countryCode: string, partyID: string, clientURL: string, clientAddress: string, signerKey: string, spenderKey: string): Promise<boolean> {
        return this.registry.register(countryCode, partyID, clientURL, clientAddress, signerKey, spenderKey)
    }

    public async updateInRegistry(countryCode: string, partyID: string, clientURL: string, clientAddress: string, signerKey: string, spenderKey: string): Promise<boolean> {
        return this.registry.update(countryCode, partyID, clientURL, clientAddress, signerKey, spenderKey)
    }

    public async isConnectedToClient(): Promise<boolean> {
        const tokenC = await this.db.getTokenC()
        if (tokenC === "") {
            return false
        }
        const credentialsEndpoint = await this.db.getEndpoint("credentials", "SENDER")
        const res = await fetch(credentialsEndpoint, {
            headers: {
                "Authorization": `Token ${tokenC}`
            }
        })
        const resBody: IResponse<any> = await res.json()
        return resBody.status_code === 1000
    }

    public async getClientEndpoints(clientVersionsURL: string, tokenA: string) {
        const headers = {
            "Authorization": `Token ${tokenA}`
        }
        const availableVersionsRes = await fetch(clientVersionsURL, { headers })
        const availableVersions: IResponse<IVersions> = await availableVersionsRes.json()
        if (availableVersions.data) {
            const foundVersion = availableVersions.data.versions.find((v) => v.version === "2.2")
            if (!foundVersion) {
                throw Error("Could not find 2.2 in OCN client's available OCPI versions")
            }
            const versionDetailRes = await fetch(foundVersion.url, { headers })
            const versionDetail: IResponse<IVersionDetail> = await versionDetailRes.json()
            if (!versionDetail.data) {
                throw Error("Unable to request OCN client's 2.2 version details")
            }
            await this.db.saveEndpoints(versionDetail.data)
        } else {
            throw Error("Unable to request OCN client's OCPI versions")
        }
    }

    public async connectToClient(credentials: ICredentials, tokenA: string) {
        await this.db.setTokenB(credentials.token)
        const credentialsEndpoint = await this.db.getEndpoint("credentials", "SENDER")
        const credentialsRes = await fetch(credentialsEndpoint, {
            method: "POST",
            headers: {
                "Authorization": `Token ${tokenA}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        })
        const clientCredentials: IResponse<ICredentials> = await credentialsRes.json()
        if (!clientCredentials.data) {
            throw Error("Did not receive CREDENTIALS_TOKEN_C from OCN client")
        }
        await this.db.setTokenC(clientCredentials.data.token)
    }

    private getKeys(mode: string): { signer: string, spender: string } {
        let signer: string
        let spender: string

        if (!process.env.SIGNER_KEY) {
            throw Error(`No SIGNER_KEY provided. Unable to ${mode} listing in OCN Registry`)
        }
        signer = process.env.SIGNER_KEY

        spender = process.env.SPENDER_KEY ? process.env.SPENDER_KEY : signer

        return {
            signer,
            spender
        }
    }

}
