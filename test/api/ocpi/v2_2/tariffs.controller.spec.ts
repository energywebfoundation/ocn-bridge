import { assert } from "chai"
import { Server } from "http"
import request from "supertest"
import { startBridge, stopBridge } from "../../../../src/api/index"
import { ModuleImplementation } from "../../../../src/models/bridgeConfigurationOptions"
import { testRoles, testTariffs } from "../../../data/test-data"
import { startNode, stopNode } from "../../../mock/ocn-node"
import { PluggableAPIStub } from "../../../stubs/pluggableAPI.stub"
import { PluggableDBStub } from "../../../stubs/pluggableDB.stub"
import { PluggableRegistryStub } from "../../../stubs/pluggableRegistry.stub"
import { IBridge } from "../../../../src/models"

describe("OCPI Tariffs Controller", () => {

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
                sender: ["tariffs"],
                receiver: []
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

    context("Sender interface", () => {

        it("should return list of tariffs", (done) => {

            request(bridge.server)
                .get("/ocpi/sender/2.2/tariffs")
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
                    assert.deepEqual(result.body.data, testTariffs)
                    done()
                })
        })
    })
})
