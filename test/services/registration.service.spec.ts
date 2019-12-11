import { assert } from "chai"
import { ethers } from "ethers"
import { EventEmitter } from "events"
import "mocha"
import { stopServer } from "../../src/api/index"
import { IPluggableRegistry } from "../../src/models/ocn/pluggableRegistry"
import { registryListing } from "../../src/models/ocn/registry"
import { IPluggableDB } from "../../src/models/pluggableDB"
import { RegistrationService } from "../../src/services/registration.service"
import { testCredentials } from "../data/test-data"
import { startNode } from "../mock/ocn-node"
import { PluggableDBStub } from "../stubs/pluggableDB.stub"
import { PluggableRegistryStub } from "../stubs/pluggableRegistry.stub"

interface IIsListedTestCase {
    name: string
    registry: IPluggableRegistry
    want: registryListing
}

describe("Registration Service", () => {

    let registry: IPluggableRegistry
    let db: IPluggableDB
    let registrationService: RegistrationService

    beforeEach(() => {
        registry = new PluggableRegistryStub()
        db = new PluggableDBStub()
        db.setTokenB("token-b")
        db.setTokenC("token-c")
        registrationService = new RegistrationService(registry, db)
    })

    it("getNodeInfo", async () => {
        const ocnNode = await startNode(3001)

        const got = await registrationService.getNodeInfo("http://localhost:3001")
        const want = {
            url: "http://localhost:3001",
            address: "0x63937aBd9308ad672Df9A2a1dcb1b38961f29C11"
        }

        assert.deepEqual(got, want)

        await stopServer(ocnNode)
    })

    context("isListedInRegistry", () => {

        const testCases: IIsListedTestCase[] = [
            {
                name: "already registered",
                registry: new PluggableRegistryStub("http://localhost:3001", "0x63937aBd9308ad672Df9A2a1dcb1b38961f29C11"),
                want: registryListing.OK
            },
            {
                name: "needs registering",
                registry: new PluggableRegistryStub("", "0x0000000000000000000000000000000000000000"),
                want: registryListing.REGISTER_REQUIRED
            },
            {
                name: "needs updating 1",
                registry: new PluggableRegistryStub("http://localhost:3002", "0x63937aBd9308ad672Df9A2a1dcb1b38961f29C11"),
                want: registryListing.UPDATE_REQUIRED
            },
            {
                name: "needs updating 2",
                registry: new PluggableRegistryStub("http://localhost:3001", "0x0ccAF8cB1C92aef64dD36ce1f3882D195180AD5C"),
                want: registryListing.UPDATE_REQUIRED
            }
        ]

        for (const test of testCases) {

            it(test.name, async () => {
                const modifiedRegistrationService = new RegistrationService(test.registry, db)
                const got = await modifiedRegistrationService.isListedInRegistry("DE", "MSP", {
                    url: "http://localhost:3001",
                    address: "0x63937aBd9308ad672Df9A2a1dcb1b38961f29C11"
                })
                assert.equal(got, test.want)
            })

        }

    })

    it("listInRegistry", async () => {
        const signer = ethers.Wallet.createRandom().privateKey
        const got = await registrationService.listInRegistry("DE", "MSP", "http://localhost:3001", "0x63937aBd9308ad672Df9A2a1dcb1b38961f29C11", signer, signer)
        assert.equal(got, true)
    })

    it("updateInRegistry", async () => {
        const signer = ethers.Wallet.createRandom().privateKey
        const got = await registrationService.updateInRegistry("DE", "MSP", "http://localhost:3002", "0x0ccAF8cB1C92aef64dD36ce1f3882D195180AD5C", signer, signer)
        assert.equal(got, true)
    })

    it("isConnectedToNode", async () => {
        const modifiedDB = new PluggableDBStub()
        modifiedDB.saveEndpoints({
            version: "2.2",
            endpoints: [{
                identifier: "credentials",
                role: "SENDER",
                url: "http://localhost:3001/ocpi/2.2/credentials"
            }]
        })
        modifiedDB.setTokenC("token-c")

        const modifiedRegistrationService = new RegistrationService(registry, modifiedDB)

        const ocnNode = await startNode(3001)

        const got = await modifiedRegistrationService.isConnectedToNode()

        await stopServer(ocnNode)

        assert.equal(got, true)
    })

    it("getNodeEndpoints", async () => {
        const ocnNode = await startNode(3001)
        await registrationService.getNodeEndpoints("http://localhost:3001/ocpi/versions", "token-a")
        await stopServer(ocnNode)
        const got = await db.getEndpoint("commands", "SENDER")
        assert.equal(got, "http://localhost:3001/ocpi/sender/2.2/commands")
    })

    it("connectToNode", async () => {

        const modifiedDB = new PluggableDBStub()
        modifiedDB.saveEndpoints({
            version: "2.2",
            endpoints: [{
                identifier: "credentials",
                role: "SENDER",
                url: "http://localhost:3001/ocpi/2.2/credentials"
            }]
        })

        const modifiedRegistrationService = new RegistrationService(registry, modifiedDB)

        const events = new EventEmitter()

        return new Promise(async (resolve, reject) => {

            const ocnNode = await startNode(3001, events)

            events.once("CREDENTIALS_POST", async (body) => {
                if (body.token !== "token-b") {
                    reject(Error(`Expected "token-b", got ${body.token}`))
                }
            })

            await modifiedRegistrationService.connectToNode(testCredentials, "token-a")

            await stopServer(ocnNode)

            const tokenB = await modifiedDB.getTokenB()
            const tokenC = await modifiedDB.getTokenC()

            if (tokenB !== "token-b") {
                reject(Error(`Expected "token-b", got ${tokenB}`))
            }

            if (tokenC !== "token-c") {
                reject(Error(`Expected "token-c", got ${tokenC}`))
            }

            resolve()
        })

    })

})
