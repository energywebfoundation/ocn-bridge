import { assert } from "chai"
import { Server } from "http"
import "mocha"
import request from "supertest"
import { startServer, stopServer } from "../../../../src/api/index"
import { ModuleImplementation } from "../../../../src/models/bridgeConfigurationOptions"
import { testCdr, testRoles } from "../../../data/test-data"
import { startOCNClient } from "../../../mock/ocn-client"
import { PluggableAPIStub } from "../../../stubs/pluggableAPI.stub"
import { PluggableDBStub } from "../../../stubs/pluggableDB.stub"
import { PluggableRegistryStub } from "../../../stubs/pluggableRegistry.stub"

describe("OCPI Cdrs Controller", () => {

    let app: Server

    let ocnClient: Server

    beforeEach(async () => {
        const db = new PluggableDBStub()
        db.setTokenB("token-b")
        db.setTokenC("token-c")

        app = await startServer({
            publicBridgeURL: "http://localhost:3000",
            ocnClientURL: "http://localhost:3001",
            roles: testRoles,
            modules: {
                implementation: ModuleImplementation.CUSTOM,
                sender: [],
                receiver: ["cdrs"]
            },
            pluggableAPI: new PluggableAPIStub(),
            pluggableDB: db,
            pluggableRegistry: new PluggableRegistryStub(),
            dryRun: true
        })

        ocnClient = await startOCNClient(3001)
    })

    afterEach(async () => {
        await stopServer(app)
        await stopServer(ocnClient)
    })

    context("Receiver interface", () => {

        it("should return stored cdr on GET cdrs", (done) => {

            request(app)
            .get("/ocpi/receiver/2.2/cdrs/55")
            .set("Authorization", "Token token-b")
            .set("X-Request-ID", "123")
            .set("X-Correlation-ID", "456")
            .set("OCPI-From-Country-Code", "DE")
            .set("OCPI-From-Party-Id", "MSP")
            .set("OCPI-To-Country-Code", "DE")
            .set("OCPI-To-Party-Id", "CPO")
            .send()
            .expect(200)
            .end((err, result) => {
                if (err) {
                    return done(err)
                }

                assert.equal(result.body.status_code, 1000)
                assert.deepEqual(result.body.data, testCdr)
                done()
            })
        })

        it("should return 1000 status and location header on POST cdrs", (done) => {

            request(app)
                .post("/ocpi/receiver/2.2/cdrs")
                .set("Authorization", "Token token-b")
                .set("X-Request-ID", "123")
                .set("X-Correlation-ID", "456")
                .set("OCPI-From-Country-Code", "DE")
                .set("OCPI-From-Party-Id", "MSP")
                .set("OCPI-To-Country-Code", "DE")
                .set("OCPI-To-Party-Id", "CPO")
                .send(testCdr)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        return done(err)
                    }

                    assert.equal(result.body.status_code, 1000)
                    assert.equal(result.header["location"], "http://localhost:3000/ocpi/receiver/2.2/cdrs/55")
                    done()
                })
        })

    })

})
