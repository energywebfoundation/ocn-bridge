import { assert } from "chai"
import { Server } from "http"
import request from "supertest"
import { startBridge, stopBridge } from "../../../../src/api/index"
import { ModuleImplementation } from "../../../../src/models/bridgeConfigurationOptions"
import { testCdr, testCdrList, testRoles } from "../../../data/test-data"
import { startNode, stopNode } from "../../../mock/ocn-node"
import { PluggableAPIStub } from "../../../stubs/pluggableAPI.stub"
import { PluggableDBStub } from "../../../stubs/pluggableDB.stub"
import { PluggableRegistryStub } from "../../../stubs/pluggableRegistry.stub"
import { IBridge } from "../../../../src/models"

describe("OCPI Cdrs Controller", () => {

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
                sender: ["cdrs"],
                receiver: ["cdrs"]
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

    context("Receiver interface", () => {

        it("should return stored cdr on GET cdrs", (done) => {

            request(bridge.server)
                .get("/ocpi/receiver/2.2/cdrs/DE/CPO/55")
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

            request(bridge.server)
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

    context("Sender interface", () => {

        it("should return cdrs list", (done) => {

            request(bridge.server)
                .get("/ocpi/sender/2.2/cdrs")
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
                    assert.deepEqual(result.body.data, testCdrList)
                    done()
                })
        })
    })

})
