import { assert } from "chai"
import { Server } from "http"
import request from "supertest"
import { startBridge, stopBridge } from "../../../../src/api/index"
import { ModuleImplementation } from "../../../../src/models/bridgeConfigurationOptions"
import { testLocations, testRoles } from "../../../data/test-data"
import { startNode, stopNode } from "../../../mock/ocn-node"
import { PluggableAPIStub } from "../../../stubs/pluggableAPI.stub"
import { PluggableDBStub } from "../../../stubs/pluggableDB.stub"
import { PluggableRegistryStub } from "../../../stubs/pluggableRegistry.stub"
import { IBridge } from "../../../../src/models"

describe("OCPI Locations Controller", () => {

    let bridge: IBridge
    let ocnNode: Server

    beforeEach(async () => {
        const db = new PluggableDBStub()
        db.setTokenB("token-b")
        db.setTokenC("token-c")

        bridge = await startBridge({
            publicBridgeURL: "http://localhost:3000",
            ocnNodeURL: "http://localhost:3001",
            roles: testRoles,
            modules: {
                implementation: ModuleImplementation.CUSTOM,
                sender: ["locations"],
                receiver: []
            },
            pluggableAPI: new PluggableAPIStub(),
            pluggableDB: db,
            pluggableRegistry: new PluggableRegistryStub(),
        })

        ocnNode = await startNode(3001)
    })

    afterEach(async () => {
        await stopBridge(bridge)
        await stopNode(ocnNode)
    })

    context("Sender interface", () => {

        it("should return list of locations", (done) => {

            request(bridge.server)
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

            request(bridge.server)
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

            request(bridge.server)
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

            request(bridge.server)
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
