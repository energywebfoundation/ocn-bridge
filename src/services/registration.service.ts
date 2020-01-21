import { utils } from "ethers"
import fetch from "node-fetch";
import * as url from "url";
import * as uuid from "uuid";
import { IPluggableRegistry } from "../models/ocn/pluggableRegistry";
import { INodeInfo, registryListing } from "../models/ocn/registry";
import { IResponse } from "../models/ocpi/common";
import { ICredentials, IRole } from "../models/ocpi/credentials";
import { IVersionDetail, IVersions } from "../models/ocpi/versions";
import { IPluggableDB } from "../models/pluggableDB";

export class RegistrationService {

    constructor(private registry: IPluggableRegistry, private db: IPluggableDB) { }

    public async register(publicIP: string, nodeURL: string, roles: IRole[]): Promise<void> {
        const nodeInfo = await this.getNodeInfo(nodeURL)
        for (const role of roles) {
            const listing = await this.isListedInRegistry(role.country_code, role.party_id, nodeInfo)
            switch (listing) {
                case registryListing.OK:
                    break
                case registryListing.REGISTER_REQUIRED:
                    const regKeys = this.getKeys("register")
                    await this.listInRegistry(role.country_code, role.party_id, nodeInfo.url, nodeInfo.address, regKeys.signer, regKeys.spender)
                    break
                case registryListing.UPDATE_REQUIRED:
                    const updateKeys = this.getKeys("update")
                    await this.updateInRegistry(role.country_code, role.party_id, nodeInfo.url, nodeInfo.address, updateKeys.signer, updateKeys.spender)
                    break
            }
        }
        const isConnected = await this.isConnectedToNode()
        if (isConnected) {
            return
        }
        if (!process.env.TOKEN_A) {
            throw Error("need TOKEN_A to complete registration process with OCN node")
        }
        await this.getNodeEndpoints(url.resolve(nodeURL, "/ocpi/versions"), process.env.TOKEN_A)
        await this.connectToNode({
            token: uuid.v4(),
            url: url.resolve(publicIP, "/ocpi/versions"),
            roles
        }, process.env.TOKEN_A)
    }

    public async getNodeInfo(nodeURL: string): Promise<INodeInfo> {
        const res = await fetch(url.resolve(nodeURL, "/ocn/registry/node-info"))
        return res.json()
    }

    public async isListedInRegistry(countryCode: string, partyID: string, expectedNodeInfo: INodeInfo): Promise<registryListing> {
        const nodeURL = await this.registry.getNodeURL(countryCode, partyID)
        const nodeAddress = await this.registry.getNodeAddress(countryCode, partyID)

        if ((nodeURL === expectedNodeInfo.url) && (utils.getAddress(nodeAddress) === utils.getAddress(expectedNodeInfo.address))) {
            return registryListing.OK
        } else if ((nodeURL === "") && (nodeAddress === "0x0000000000000000000000000000000000000000")) {
            return registryListing.REGISTER_REQUIRED
        } else {
            return registryListing.UPDATE_REQUIRED
        }
    }

    public async listInRegistry(countryCode: string, partyID: string, nodeURL: string, nodeAddress: string, signerKey: string, spenderKey: string): Promise<boolean> {
        return this.registry.register(countryCode, partyID, nodeURL, nodeAddress, signerKey, spenderKey)
    }

    public async updateInRegistry(countryCode: string, partyID: string, nodeURL: string, nodeAddress: string, signerKey: string, spenderKey: string): Promise<boolean> {
        return this.registry.update(countryCode, partyID, nodeURL, nodeAddress, signerKey, spenderKey)
    }

    public async isConnectedToNode(): Promise<boolean> {
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

    public async getNodeEndpoints(nodeVersionsURL: string, tokenA: string) {
        const headers = {
            "Authorization": `Token ${tokenA}`
        }
        const availableVersionsRes = await fetch(nodeVersionsURL, { headers })
        const availableVersions: IResponse<IVersions> = await availableVersionsRes.json()
        if (availableVersions.data) {
            const foundVersion = availableVersions.data.find((v) => v.version === "2.2")
            if (!foundVersion) {
                throw Error("Could not find 2.2 in OCN node's available OCPI versions")
            }
            const versionDetailRes = await fetch(foundVersion.url, { headers })
            const versionDetail: IResponse<IVersionDetail> = await versionDetailRes.json()
            if (!versionDetail.data) {
                throw Error("Unable to request OCN node's 2.2 version details")
            }
            await this.db.saveEndpoints(versionDetail.data)
        } else {
            throw Error("Unable to request OCN node's OCPI versions")
        }
    }

    public async connectToNode(credentials: ICredentials, tokenA: string) {
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
        const nodeCredentials: IResponse<ICredentials> = await credentialsRes.json()
        if (!nodeCredentials.data) {
            throw Error("Did not receive CREDENTIALS_TOKEN_C from OCN node")
        }
        await this.db.setTokenC(nodeCredentials.data.token)
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
