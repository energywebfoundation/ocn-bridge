import * as bodyParser from "body-parser"
import { EventEmitter } from "events"
import express, { NextFunction, Request, Response } from "express"
import { Server } from "http"
import { OcpiResponse } from "../../src/models/ocpi/common"

const myCredentials = {
    token: "token-c",
    url: "http://localhost:3001/ocpi/versions",
    roles: [
        {
            role: "HUB",
            business_details: {
                name: "OCN client"
            },
            party_id: "OCN",
            country_code: "DE"
        }
    ]
}

export const startOCNClient = async (port: number, events: EventEmitter = new EventEmitter()): Promise<Server> => {
    // need to mock the OCN client to ensure that the async CommandResult is correctly sent after
    // the initial CommandResponse
    const mockOCNClient = express()
    mockOCNClient.use(bodyParser.json())

    const authorizationMiddleware = (token: string) => {
        return (req: Request, res: Response, next: NextFunction) => {
            if (req.headers.authorization !== `Token ${token}`) {
                events.emit("error", new Error(`OCN client expected authorization header "Token token-b", got "${req.headers.authorization}"`))
                return res.status(401).send(OcpiResponse.withMessage(4001, "Unauthorized"))
            }
            return next()
        }
    }

    mockOCNClient.get("/ocn/registry/client-info", async (_, res) => {
        res.send({
            url: `http://localhost:${port}`,
            address: "0x63937aBd9308ad672Df9A2a1dcb1b38961f29C11"
        })
    })

    mockOCNClient.get("/ocpi/versions", authorizationMiddleware("token-a"), async (_, res) => {
        res.send(OcpiResponse.withData(1000, {
            versions: [
                {
                    version: "2.2",
                    url: "http://localhost:3001/ocpi/versions/2.2"
                }
            ]
        }))
    })

    mockOCNClient.get("/ocpi/versions/2.2", authorizationMiddleware("token-a"), async (_, res) => {
        res.send(OcpiResponse.withData(1000, {
            version: "2.2",
            endpoints: [
                {
                    identifier: "commands",
                    role: "SENDER",
                    url: "http://localhost:3001/ocpi/sender/2.2/commands"
                }
            ]
        }))
    })

    mockOCNClient.get("/ocpi/2.2/credentials", authorizationMiddleware("token-c"), async (_, res) => {
        res.send(OcpiResponse.withData(1000, myCredentials))
    })

    mockOCNClient.post("/ocpi/2.2/credentials", authorizationMiddleware("token-a"), async (req, res) => {
        events.emit("CREDENTIALS_POST", req.body)
        res.send(OcpiResponse.withData(1000, myCredentials))
    })

    mockOCNClient.post("/commands/START_SESSION/5", authorizationMiddleware("token-c"), async (req, res) => {
        events.emit("START_SESSION", req.body)
        res.end()
    })

    mockOCNClient.post("/commands/STOP_SESSION/6", authorizationMiddleware("token-c"), async (req, res) => {
        events.emit("STOP_SESSION", req.body)
        res.end()
    })

    return new Promise((resolve, _) => {
        const server = mockOCNClient.listen(port, () => resolve(server))
    })
}
