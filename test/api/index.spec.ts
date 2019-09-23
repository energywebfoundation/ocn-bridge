import { assert } from "chai"
import { Server } from "http"
import "mocha"
import fetch from "node-fetch"
import { startServer, stopServer } from "../../src/api/index"
import { PluggableAPIStub } from "../stubs/pluggableAPI.stub"

describe("API context", () => {

    let app: Server

    beforeEach(async () => {
        app = await startServer({
            logger: false,
            pluggableAPI: new PluggableAPIStub()
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
