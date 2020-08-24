import { assert } from "chai"
import "mocha"
import fetch from "node-fetch"
import { startBridge, stopBridge } from "../../src/api/index"
import { ModuleImplementation } from "../../src/models/bridgeConfigurationOptions"
import { testRoles } from "../data/test-data"
import { PluggableAPIStub } from "../stubs/pluggableAPI.stub"
import { PluggableDBStub } from "../stubs/pluggableDB.stub"
import { PluggableRegistryStub } from "../stubs/pluggableRegistry.stub"
import { IBridge } from "../../src/models"

describe("API context", () => {

    let bridge: IBridge

    beforeEach(async () => {
        bridge = await startBridge({
            publicBridgeURL: "http://localhost:3000",
            ocnNodeURL: "http://localhost:3001",
            roles: testRoles,
            modules: {
                implementation: ModuleImplementation.ALL
            },
            pluggableAPI: new PluggableAPIStub(),
            pluggableDB: new PluggableDBStub(),
            pluggableRegistry: new PluggableRegistryStub(),
            dryRun: true
        })
    })

    afterEach(async () => {
        await stopBridge(bridge)
    })

    it("should load", async () => {
        const result = await fetch("http://localhost:3000")

        const got = await result.text()
        const want = "OCN Bridge v1.1.0"

        assert.equal(got, want)
    })

})
