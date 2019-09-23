import { Server } from "http"
import "mocha"
import request from "supertest"
import {startServer, stopServer} from "../../../../src/api/index"
import { PluggableAPIStub } from "../../../stubs/pluggableAPI.stub"

describe("OCPI Versions Controller", () => {

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
