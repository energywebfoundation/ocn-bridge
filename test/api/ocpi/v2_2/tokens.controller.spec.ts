import { assert } from "chai"
import { Server } from "http"
import "mocha"
import request from "supertest"
import { startBridge, stopBridge } from "../../../../src/api/index"
import { ModuleImplementation } from "../../../../src/models/bridgeConfigurationOptions"
import { testRoles, testTokens, testAuthorizationInfo } from "../../../data/test-data"
import { startNode, stopNode } from "../../../mock/ocn-node"
import { PluggableAPIStub } from "../../../stubs/pluggableAPI.stub"
import { PluggableDBStub } from "../../../stubs/pluggableDB.stub"
import { PluggableRegistryStub } from "../../../stubs/pluggableRegistry.stub"
import { IBridge } from "../../../../src/models"

describe("OCPI Tokens Controller", () => {

    let app: IBridge

    let ocnNode: Server

    beforeEach(async () => {
        const db = new PluggableDBStub()
        db.setTokenB("token-b")
        db.setTokenC("token-c")

        app = await startBridge({
            publicBridgeURL: "http://localhost:3000",
            ocnNodeURL: "http://localhost:3001",
            roles: testRoles,
            modules: {
                implementation: ModuleImplementation.CUSTOM,
                sender: ["tokens"],
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
        await stopBridge(app)
        await stopNode(ocnNode)
    })

    context("Sender interface", () => {

        it("should return list of tokens", (done) => {

            request(app.server)
                .get("/ocpi/sender/2.2/tokens")
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
                    assert.deepEqual(result.body.data, testTokens)
                    done()
                })
        })
    })

    it("should return real-time authorization info", (done) => {

        request(app.server)
            .post("/ocpi/sender/2.2/tokens/666/authorize")
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
                assert.deepEqual(result.body.data, testAuthorizationInfo)
                done()
            })

    })
})
