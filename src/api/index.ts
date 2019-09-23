import * as bodyParser from "body-parser"
import express from "express"
import {  Router } from "express"
import { Server } from "http"
import morgan from "morgan"

import { IBridgeConfigurationOptions } from "../models/bridgeConfigurationOptions"

// import controllers
import { CommandsController } from "./ocpi/v2_2/commands.controller"
import { versionsController } from "./ocpi/v2_2/versions.controller"

// set basic home route
const homeController = Router()
homeController.get("/", async (_, res) => {
    res.send("OCN Bridge v0.1.0")
})

/**
 * Bootstrap a new OCN Bridge server with OCPI interface
 * @param options an object of configuration options
 *      - logger {boolean} - sets whether to log to stdout using morgan
 *      - pluggableAPI {IPluggableAPI} - a class to handle incoming OCPI requests
 * @returns a promise resolving with the newly created http.Server
 */
export const startServer = async (options: IBridgeConfigurationOptions): Promise<Server> => {

    /**
     * startServer should take options object. Possible values:
     *      - Public IP of the bridge
     *      - Credentials of bridge/party
     *      - OCN client credentials: public IP/token_A? OR the admin key?
     *      - API class which implements PluggableAPI interface
     *      - Registry class which implements Registry interface
     *      - Enum value describing OCPI interface(s) to use
     *              - Enum: SENDER, RECEIVER, BOTH
     *      - Array of OCPI modules to implement (could be in pluggable API)
     *      - Logger (boolean)
     *
     * Check registration status on start. Ensure that:
     *      - Party is registered on network
     *      - Party is connected to OCN client
     *
     *      - if not, register/connect automatically
     */

    const app = express()
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    app.use(homeController)
    app.use("/ocpi/versions", versionsController)
    app.use("/ocpi/receiver/2.2/commands", CommandsController.getRoutes(options.pluggableAPI))

    if (options.logger) {
        app.use(morgan("dev"))
    }

    return new Promise((resolve, reject) => {
        const server = app.listen(3000, (err?: Error) => {
            err ? reject(err) : resolve(server)
        })
    })
}

/**
 * Stop a http.Server
 * @param app the http.Server created during bootstrapping
 */
export const stopServer = async (app: Server) => {
    return new Promise((resolve, reject) => {
        app.close((err?: Error) => {
            err ? reject(err) : resolve()
        })
    })
}
