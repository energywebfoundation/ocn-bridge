import { assert } from "chai"
import fastify from "fastify"
import "mocha"
import fetch from "node-fetch"
import { startServer, stopServer } from "../../src/api/index"

describe("API context", () => {

    let app: fastify.FastifyInstance

    beforeEach(async () => {
        app = await startServer()
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
