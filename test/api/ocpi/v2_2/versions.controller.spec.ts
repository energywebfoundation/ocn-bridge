// import { assert } from "chai"
import { Server } from "http"
import "mocha"
import request from "supertest"
import {startServer, stopServer} from "../../../../src/api/index"

describe("OCPI Versions Controller", () => {

    let app: Server

    beforeEach(async () => {
        app = await startServer()
    })

    afterEach(async () => {
        await stopServer(app)
    })

    it("should return list of versions", (done) => {
        request(app)
            .get("/ocpi/versions")
            .expect(200, {
                versions: [
                    {
                        version: "2.2",
                        url: "http://localhost:3000/ocpi/versions/2.2"
                    }
                ]
            }, done)
    })

    it("should return 2.2 endpoints", (done) => {
        request(app)
            .get("/ocpi/versions/2.2")
            .expect(200, {
                version: "2.2",
                endpoints: []
            }, done)
    })

})
