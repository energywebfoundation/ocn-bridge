import { assert } from "chai"
import { EventEmitter } from "events"
import { Request } from "express"
import { Server } from "http"
import "mocha"
import request from "supertest"
import { startServer, stopServer } from "../../../../src/api/index"
import { testRoles, testToken } from "../../../data/test-data"
import { startOCNClient } from "../../../mock/ocn-client"
import { PluggableAPIStub } from "../../../stubs/pluggableAPI.stub"
import { PluggableDBStub } from "../../../stubs/pluggableDB.stub"
import { PluggableRegistryStub } from "../../../stubs/pluggableRegistry.stub"

describe("OCPI Commands Controller", () => {

    let events: EventEmitter

    let app: Server

    let ocnClient: Server

    beforeEach(async () => {
        const db = new PluggableDBStub()
        db.setTokenB("token-b")
        db.setTokenC("token-c")

        events = new EventEmitter()

        app = await startServer({
            publicBridgeURL: "http://localhost:3000",
            ocnClientURL: "http://localhost:3001",
            roles: testRoles,
            pluggableAPI: new PluggableAPIStub(),
            pluggableDB: db,
            pluggableRegistry: new PluggableRegistryStub(),
            dryRun: true
        })

        ocnClient = await startOCNClient(3001, events)
    })

    afterEach(async () => {
        await stopServer(app)
        await stopServer(ocnClient)
    })

    context("Receiver interface", () => {

        it("should return CommandResponse and send async CommandResult on START_SESSION", (done) => {

            request(app)
                .post("/ocpi/receiver/2.2/commands/START_SESSION")
                .set("Authorization", "Token token-b")
                .set("X-Request-ID", "123")
                .set("X-Correlation-ID", "456")
                .set("OCPI-From-Country-Code", "DE")
                .set("OCPI-From-Party-Id", "MSP")
                .set("OCPI-To-Country-Code", "DE")
                .set("OCPI-To-Party-Id", "CPO")
                .send({
                    response_url: "http://localhost:3001/commands/START_SESSION/5",
                    token: testToken,
                    location_id: "LOC1"
                })
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        return done(err)
                    }

                    assert.equal(result.body.status_code, 1000)
                    assert.equal(result.body.data.result, "ACCEPTED")
                    assert.equal(result.body.data.timeout, 10)

                    events.once("START_SESSION", (req: Request) => {

                        assert.isString(req.headers["x-request-id"])
                        assert.isString(req.headers["x-correlation-id"])

                        assert.equal(req.headers["ocpi-from-country-code"], "DE")
                        assert.equal(req.headers["ocpi-from-party-id"], "CPO")
                        assert.equal(req.headers["ocpi-to-country-code"], "DE")
                        assert.equal(req.headers["ocpi-to-party-id"], "MSP")

                        assert.equal(req.body.result, "ACCEPTED")
                        done()
                    })

                    events.once("error", done)
                })
        })

        it("should return CommandResponse and send async CommandResult on STOP_SESSION", (done) => {

            request(app)
                .post("/ocpi/receiver/2.2/commands/STOP_SESSION")
                .set("Authorization", "Token token-b")
                .set("X-Request-ID", "123")
                .set("X-Correlation-ID", "456")
                .set("OCPI-From-Country-Code", "DE")
                .set("OCPI-From-Party-Id", "MSP")
                .set("OCPI-To-Country-Code", "DE")
                .set("OCPI-To-Party-Id", "CPO")
                .send({
                    response_url: "http://localhost:3001/commands/STOP_SESSION/6",
                    session_id: "0102030400506"
                })
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        return done(err)
                    }

                    assert.equal(result.body.status_code, 1000)
                    assert.equal(result.body.data.result, "ACCEPTED")
                    assert.equal(result.body.data.timeout, 10)

                    events.once("STOP_SESSION", (req: Request) => {

                        assert.isString(req.headers["x-request-id"])
                        assert.isString(req.headers["x-correlation-id"])

                        assert.equal(req.headers["ocpi-from-country-code"], "DE")
                        assert.equal(req.headers["ocpi-from-party-id"], "CPO")
                        assert.equal(req.headers["ocpi-to-country-code"], "DE")
                        assert.equal(req.headers["ocpi-to-party-id"], "MSP")

                        assert.equal(req.body.result, "ACCEPTED")

                        done()
                    })

                    events.once("error", done)
                })
        })

        it("should return NOT_SUPPORTED on CANCEL_RESERVATION", (done) => {

            request(app)
                .post("/ocpi/receiver/2.2/commands/CANCEL_RESERVATION")
                .set("Authorization", "Token token-b")
                .send({
                    response_url: "http://localhost:3001/commands/CANCEL_RESERVATION/7",
                    session_id: "0102030400506"
                })
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        return done(err)
                    }

                    assert.equal(result.body.status_code, 1000)
                    assert.equal(result.body.data.result, "NOT_SUPPORTED")
                    assert.equal(result.body.data.timeout, 0)
                    assert.isString(result.body.timestamp)
                    done()
                })

        })

        it("should return NOT_SUPPORTED on RESERVE_NOW", (done) => {

            request(app)
                .post("/ocpi/receiver/2.2/commands/RESERVE_NOW")
                .set("Authorization", "Token token-b")
                .send({
                    response_url: "http://localhost:3001/commands/RESERVE_NOW/8",
                    token: testToken,
                    expiry_date: new Date(),
                    location_id: "LOC1",
                    evse_uid: "1234"
                })
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        return done(err)
                    }

                    assert.equal(result.body.status_code, 1000)
                    assert.equal(result.body.data.result, "NOT_SUPPORTED")
                    assert.equal(result.body.data.timeout, 0)
                    assert.isString(result.body.timestamp)
                    done()
                })
        })

        it("should return NOT_SUPPORTED on UNLOCK_CONNECTOR", (done) => {

            request(app)
                .post("/ocpi/receiver/2.2/commands/UNLOCK_CONNECTOR")
                .set("Authorization", "Token token-b")
                .send({
                    response_url: "http://localhost:3001/commands/UNLOCK_CONNECTOR/9",
                    location_id: "LOC1",
                    evse_uid: "1234"
                })
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        return done(err)
                    }

                    assert.equal(result.body.status_code, 1000)
                    assert.equal(result.body.data.result, "NOT_SUPPORTED")
                    assert.equal(result.body.data.timeout, 0)
                    assert.isString(result.body.timestamp)
                    done()
                })
        })

    })

})
