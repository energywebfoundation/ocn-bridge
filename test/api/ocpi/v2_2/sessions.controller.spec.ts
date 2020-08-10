import { assert } from "chai"
import { Server } from "http"
import request from "supertest"
import { startBridge, stopBridge } from "../../../../src/api/index"
import { ModuleImplementation } from "../../../../src/models/bridgeConfigurationOptions"
import { testRoles, testSession, testSessionList } from "../../../data/test-data"
import { startNode, stopNode } from "../../../mock/ocn-node"
import { PluggableAPIStub } from "../../../stubs/pluggableAPI.stub"
import { PluggableDBStub } from "../../../stubs/pluggableDB.stub"
import { PluggableRegistryStub } from "../../../stubs/pluggableRegistry.stub"
import { IBridge } from "../../../../src/models"

describe("OCPI Sessions Controller", () => {

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
                sender: ["sessions"],
                receiver: ["sessions"]
            },
            pluggableAPI: new PluggableAPIStub(),
            pluggableDB: db,
            pluggableRegistry: new PluggableRegistryStub(),
            dryRun: true
        })

        ocnNode = await startNode(3001)
    })

    afterEach(async () => {
        await stopBridge(bridge)
        await stopNode(ocnNode)
    })

    context("Receiver interface", () => {

        it("should return 1000 on PUT session", (done) => {

            request(bridge.server)
                .put("/ocpi/receiver/2.2/sessions/DE/CPO/1234")
                .set("Authorization", "Token token-b")
                .set("X-Request-ID", "123")
                .set("X-Correlation-ID", "456")
                .set("OCPI-From-Country-Code", "DE")
                .set("OCPI-From-Party-Id", "MSP")
                .set("OCPI-To-Country-Code", "DE")
                .set("OCPI-To-Party-Id", "CPO")
                .send(testSession)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        return done(err)
                    }

                    assert.equal(result.body.status_code, 1000)
                    done()
                })
        })

    })

    context("Sender interface", () => {

        it("should return 1000 on Get session", (done) => {

            request(bridge.server)
                .get("/ocpi/sender/2.2/sessions?date_from=2019-12-06T12:50:57.394Z")
                .set("Authorization", "Token token-b")
                .set("X-Request-ID", "123")
                .set("X-Correlation-ID", "456")
                .set("OCPI-From-Country-Code", "DE")
                .set("OCPI-From-Party-Id", "MSP")
                .set("OCPI-To-Country-Code", "DE")
                .set("OCPI-To-Party-Id", "CPO")
                .send(testSessionList)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        return done(err)
                    }

                    assert.equal(result.body.status_code, 1000)
                    done()
                })
        })

    })

})
