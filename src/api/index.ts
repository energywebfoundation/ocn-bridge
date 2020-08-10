/*
    Copyright 2019-2020 eMobilify GmbH

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import * as bodyParser from "body-parser"
import express, { Router } from "express"
import morgan from "morgan"
import { IBridgeConfigurationOptions } from "../models/bridgeConfigurationOptions"
import { RegistrationService } from "../services/registration.service"
import { SignerService } from "../services/signer.service"
import { stripVersions } from "../tools"
import { hasValidSignature, isAuthorized, handleOcpiErrors } from "./ocpi/middleware/middleware"
// import controllers
import { CdrsController } from "./ocpi/v2_2/cdrs.controller"
import { CommandsController } from "./ocpi/v2_2/commands.controller"
import { LocationsController } from "./ocpi/v2_2/locations.controller"
import { SessionsController } from "./ocpi/v2_2/sessions.controller"
import { TariffsController } from "./ocpi/v2_2/tariffs.controller"
import { VersionsController } from "./ocpi/versions.controller"
import { IBridge } from "../models"
import { RequestService } from "../services"

// set basic home route
const homeController = Router()
homeController.get("/", async (_, res) => {
    res.send("OCN Bridge v0.1.0")
})

/**
 * Bootstrap a new OCN Bridge server with OCPI interface. Will attempt to register on start.
 * @param options an object of configuration options (must implement IBridgeConfigurationOptions)
 * @returns a promise resolving with the newly created http.Server
 */
export const startBridge = async (options: IBridgeConfigurationOptions): Promise<IBridge> => {

    let signerService: SignerService | undefined
    if (options.signatures) {
        signerService = new SignerService(options.signer)
    }

    const app = express()
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    if (options.logger) {
        app.use(morgan("dev"))
    }

    app.use(homeController)

    app.use(
        "/ocpi/",
        isAuthorized(options.pluggableDB, signerService),
        hasValidSignature(signerService),
        VersionsController.getRoutes(options.publicBridgeURL, options.modules),
        CommandsController.getRoutes(options.pluggableAPI, options.pluggableDB, options.modules, signerService),
        LocationsController.getRoutes(options.pluggableAPI, options.modules, signerService),
        TariffsController.getRoutes(options.pluggableAPI, options.modules, signerService),
        SessionsController.getRoutes(options.pluggableAPI, options.modules, signerService),
        CdrsController.getRoutes(options.publicBridgeURL, options.pluggableAPI, options.modules, signerService),
        handleOcpiErrors(signerService)
    )

    return new Promise(async (resolve, reject) => {
        const server = app.listen(options.port || 3000, async (err?: Error) => {

            if (!options.dryRun) {
                const registrationService = new RegistrationService(options.pluggableDB, options.pluggableRegistry, options.tokenA)

                await registrationService.register(
                    options.publicBridgeURL,
                    stripVersions(options.ocnNodeURL),
                    options.roles
                )
            }

            err ? reject(err) : resolve({
                server,
                requests: new RequestService(options.pluggableDB, options.roles[0], signerService)
            })
        })
    })
}

/**
 * Stop a http.Server
 * @param app the http.Server created during bootstrapping
 */
export const stopBridge = async (bridge: IBridge) => {
    return new Promise((resolve, reject) => {
        bridge.server.close((err?: Error) => {
            err ? reject(err) : resolve()
        })
    })
}
