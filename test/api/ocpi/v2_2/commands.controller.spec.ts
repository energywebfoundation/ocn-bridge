import bodyParser from "body-parser"
import { assert } from "chai"
import { EventEmitter } from "events"
import express from "express"
import { Server } from "http"
import "mocha"
import request from "supertest"
import {startServer, stopServer} from "../../../../src/api/index"
import { PluggableAPIStub } from "../../../stubs/pluggableAPI.stub"

describe("OCPI Commands Controller", () => {

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

    context("Receiver interface", () => {

        it("should return CommandResponse and send async CommandResult on START_SESSION", (done) => {

            const asyncResult = new EventEmitter()

            // need to mock the OCN client to ensure that the async CommandResult is correctly sent after
            // the initial CommandResponse
            const mockOCNClient = express()
            mockOCNClient.use(bodyParser.json())

            mockOCNClient.post("/response/5", async (req, res) => {
                try {
                    assert.equal(req.body.result, "ACCEPTED")
                    asyncResult.emit("complete", true)
                    res.send({
                        status_code: 1000,
                        timestamp: new Date()
                    })
                } catch (err) {
                    res.end()
                    mockOCNCLientServer.close(() => done(err))
                }

            })

            const mockOCNCLientServer = mockOCNClient.listen(3001, () => {

                request(app)
                    .post("/ocpi/receiver/2.2/commands/START_SESSION")
                    .send({
                        response_url: "http://localhost:3001/response/5",
                        token: {
                            country_code: "DE",
                            party_id: "MSP",
                            uid: "0102030405",
                            type: "AD_HOC_USER",
                            contract_id: "DE-123-XX",
                            issuer: "test MSP",
                            valid: true,
                            whitelist: "ALWAYS",
                            last_updated: new Date()
                        },
                        location_id: "LOC1"
                    })
                    .expect(200)
                    .end((err, result) => {
                        if (err) {
                            return done(err)
                        }
                        assert.equal(result.body.result, "ACCEPTED")
                        assert.equal(result.body.timeout, 10)

                        asyncResult.once("complete", () => {
                            mockOCNCLientServer.close(done)
                        })
                    })
            })
        })
    })

})
