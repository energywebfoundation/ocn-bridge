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
                name: "OCN node"
            },
            party_id: "OCN",
            country_code: "DE"
        }
    ]
}

export const startNode = async (port: number, events: EventEmitter = new EventEmitter()): Promise<Server> => {
    // need to mock the OCN node to ensure that the async CommandResult is correctly sent after
    // the initial CommandResponse
    const node = express()
    node.use(bodyParser.json())

    const authorizationMiddleware = (token: string) => {
        return (req: Request, res: Response, next: NextFunction) => {
            if (req.headers.authorization !== `Token ${token}`) {
                events.emit("error", new Error(`OCN node expected authorization header "Token token-b", got "${req.headers.authorization}"`))
                return res.status(401).send(OcpiResponse.withMessage(4001, "Unauthorized"))
            }
            return next()
        }
    }

    node.get("/ocn/registry/node-info", async (_, res) => {
        res.send({
            url: `http://localhost:${port}`,
            address: "0x63937aBd9308ad672Df9A2a1dcb1b38961f29C11"
        })
    })

    node.get("/ocpi/versions", authorizationMiddleware("token-a"), async (_, res) => {
        res.send(OcpiResponse.withData({
            versions: [
                {
                    version: "2.2",
                    url: "http://localhost:3001/ocpi/versions/2.2"
                }
            ]
        }))
    })

    node.get("/ocpi/versions/2.2", authorizationMiddleware("token-a"), async (_, res) => {
        res.send(OcpiResponse.withData({
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

    node.get("/ocpi/2.2/credentials", authorizationMiddleware("token-c"), async (_, res) => {
        res.send(OcpiResponse.withData(myCredentials))
    })

    node.post("/ocpi/2.2/credentials", authorizationMiddleware("token-a"), async (req, res) => {
        events.emit("CREDENTIALS_POST", req.body)
        res.send(OcpiResponse.withData(myCredentials))
    })

    node.post("/commands/START_SESSION/5", authorizationMiddleware("token-c"), async (req, res) => {
        events.emit("START_SESSION", req)
        res.end()
    })

    node.post("/commands/STOP_SESSION/6", authorizationMiddleware("token-c"), async (req, res) => {
        events.emit("STOP_SESSION", req)
        res.end()
    })

    return new Promise((resolve, _) => {
        const server = node.listen(port, () => resolve(server))
    })
}
