import { Server } from "http"
import "mocha"
import request from "supertest"
import { startServer, stopServer } from "../../../../src/api/index"
import { testRoles } from "../../../data/test-data"
import { PluggableAPIStub } from "../../../stubs/pluggableAPI.stub"
import { PluggableDBStub } from "../../../stubs/pluggableDB.stub"
import { PluggableRegistryStub } from "../../../stubs/pluggableRegistry.stub"

describe("OCPI Versions Controller", () => {

    let app: Server

    beforeEach(async () => {
        const db = new PluggableDBStub()
        db.setTokenB("token-b")
        db.setTokenC("token-c")

        app = await startServer({
            publicBridgeURL: "http://localhost:3000/",
            ocnClientURL: "http::/localhost:3001",
            roles: testRoles,
            pluggableAPI: new PluggableAPIStub(),
            pluggableDB: db,
            pluggableRegistry: new PluggableRegistryStub(),
            dryRun: true
        })
    })

    afterEach(async () => {
        await stopServer(app)
    })

    it("should return list of versions", (done) => {
        request(app)
            .get("/ocpi/versions")
            .set("Authorization", "Token token-b")
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
            .set("Authorization", "Token token-b")
            .expect(200, {
                version: "2.2",
                endpoints: []
            }, done)
    })

})
