import { assert } from "chai"
import { Server } from "http"
import "mocha"
import fetch from "node-fetch"
import { startServer, stopServer } from "../../src/api/index"
import { testRoles } from "../data/test-data"
import { PluggableAPIStub } from "../stubs/pluggableAPI.stub"
import { PluggableDBStub } from "../stubs/pluggableDB.stub"
import { PluggableRegistryStub } from "../stubs/pluggableRegistry.stub"

describe("API context", () => {

    let app: Server

    beforeEach(async () => {
        app = await startServer({
            publicBridgeURL: "http://localhost:3000",
            ocnClientURL: "http://localhost:3001",
            roles: testRoles,
            pluggableAPI: new PluggableAPIStub(),
            pluggableDB: new PluggableDBStub(),
            pluggableRegistry: new PluggableRegistryStub(),
            dryRun: true
        })
    })

    afterEach(async () => {
        await stopServer(app)
    })

    it("should load", async () => {
        const result = await fetch("http://localhost:3000")

        const got = await result.text()
        const want = "OCN Bridge v0.1.0"

        assert.equal(got, want)
    })

})
