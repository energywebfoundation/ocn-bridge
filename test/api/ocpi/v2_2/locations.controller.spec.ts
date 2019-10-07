import { assert } from "chai"
import { Server } from "http"
import "mocha"
import request from "supertest"
import { startServer, stopServer } from "../../../../src/api/index"
import { testLocations, testRoles } from "../../../data/test-data"
import { startOCNClient } from "../../../mock/ocn-client"
import { PluggableAPIStub } from "../../../stubs/pluggableAPI.stub"
import { PluggableDBStub } from "../../../stubs/pluggableDB.stub"
import { PluggableRegistryStub } from "../../../stubs/pluggableRegistry.stub"

describe("OCPI Locations Controller", () => {

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

    context("Sender interface", () => {

        it("should return list of locations", (done) => {

            request(app)
                .get("/ocpi/sender/2.2/locations")
                .query({
                    date_from: new Date(),
                    offset: 25
                })
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
                    assert.deepEqual(result.body.data, testLocations)
                    done()
                })
        })

        it("should return single location", (done) => {

            request(app)
            .get("/ocpi/sender/2.2/locations/LOC1")
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
                assert.deepEqual(result.body.data, testLocations[0])
                done()
            })
        })

        it("should return single evse", (done) => {

            request(app)
            .get("/ocpi/sender/2.2/locations/LOC1/1234")
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
                if (testLocations[0].evses && testLocations[0].evses[0]) {
                    assert.deepEqual(result.body.data, testLocations[0].evses[0])
                } else {
                    done(new Error("test location doesn't have an EVSE"))
                }
                done()
            })
        })

        it("should return single connector", (done) => {

            request(app)
            .get("/ocpi/sender/2.2/locations/LOC1/1234/1")
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
                if (testLocations[0].evses && testLocations[0].evses[0]) {
                    assert.deepEqual(result.body.data, testLocations[0].evses[0].connectors[0])
                } else {
                    done(new Error("test location doesn't have an EVSE"))
                }
                done()
            })
        })

    })

})
