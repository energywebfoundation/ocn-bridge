import * as bodyParser from "body-parser"
import express, { Router } from "express"
import { Server } from "http"
import morgan from "morgan"
import { IBridgeConfigurationOptions } from "../models/bridgeConfigurationOptions"
import { PushService } from "../services/push.service"
import { RegistrationService } from "../services/registration.service"
import { stripVersions } from "../tools/tools"
// import controllers
import { CommandsController } from "./ocpi/v2_2/commands.controller"
import { LocationsController } from "./ocpi/v2_2/locations.controller"
import { VersionsController } from "./ocpi/versions.controller"

// set basic home route
const homeController = Router()
homeController.get("/", async (_, res) => {
    res.send("OCN Bridge v0.1.0")
})

/**
 * Bootstrap a new OCN Bridge server with OCPI interface. Will attempt to register on start.
 * @param options an object of configuration options
 *      - logger {boolean} - sets whether to log to stdout using morgan
 *      - pluggableAPI {IPluggableAPI} - a class to handle incoming OCPI requests
 * @returns a promise resolving with the newly created http.Server
 */
export const startServer = async (options: IBridgeConfigurationOptions): Promise<Server> => {

    const app = express()
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    if (options.logger) {
        app.use(morgan("dev"))
    }

    app.use(homeController)

    const pushService = new PushService(options.pluggableDB)

    app.use("/ocpi/versions", VersionsController.getRoutes(options.publicBridgeURL, options.pluggableDB))
    app.use("/ocpi/receiver/2.2/commands", CommandsController.getRoutes(options.pluggableAPI, options.pluggableDB, pushService))
    app.use("/ocpi/sender/2.2/locations", LocationsController.getRoutes(options.pluggableAPI, options.pluggableDB))

    return new Promise(async (resolve, reject) => {
        const server = app.listen(options.port || 3000, async (err?: Error) => {

            if (!options.dryRun) {
                const registrationService = new RegistrationService(options.pluggableRegistry, options.pluggableDB)

                await registrationService.register(
                    options.publicBridgeURL,
                    stripVersions(options.ocnClientURL),
                    options.roles
                )
            }

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
