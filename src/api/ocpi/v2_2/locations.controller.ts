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
import { Router } from "express"
import { IModules } from "../../../models/bridgeConfigurationOptions"
import { OcpiResponse } from "../../../models/ocpi/common"
import { IPluggableAPI } from "../../../models/pluggableAPI"
import { formatPaginationParams } from "../../../tools/tools"
import { CustomisableController } from "../advice/customisable"
import { SignerService } from "../../../services/signer.service"

/**
 * OCPI 2.2 commands module controller
 */
export class LocationsController extends CustomisableController {

    /**
     * Establish routes for the commands controller
     * @param pluggableAPI inject a pluggable API object to use in request handling
     */
    public static getRoutes(pluggableAPI: IPluggableAPI, modules: IModules, signer?: SignerService): Router {
        const router = Router()

        /**
         * SENDER interface
         */
        if (this.isIncluded("locations", "SENDER", modules, pluggableAPI)) {

            /**
             * GET location list
             */
            router.get("/sender/2.2/locations", async (req, res, next) => {
                try {
                    const params = formatPaginationParams(req.query)
                    const result = await pluggableAPI.locations!.sender!.getList(params)
                    const body = OcpiResponse.withData(result.data)
                    body.ocn_signature = await signer?.getSignature({ headers: result.headers, body })
                    res.set(result.headers).send(body)
                } catch (err) {
                    next(err)
                }
            })

            /**
             * Get location
             */
            router.get("/sender/2.2/locations/:id", async (req, res, next) => {
                try {
                    const location = await pluggableAPI.locations!.sender!.getObject(req.params.id)

                    let body: OcpiResponse
                    let statusCode: number

                    if (location) {
                        body = OcpiResponse.withData(location)
                        statusCode = 200
                    } else {
                        body = OcpiResponse.withMessage(2003, "Unknown location")
                        statusCode = 404
                    }

                    body.ocn_signature = await signer?.getSignature({ body })
                    res.status(statusCode).send(body)
                } catch (err) {
                    next(err)
                }
            })

            /**
             * Get EVSE
             */
            router.get("/sender/2.2/locations/:id/:evse", async (req, res, next) => {
                try {
                    const evse = await pluggableAPI.locations!.sender!.getEvse(req.params.id, req.params.evse)

                    let body: OcpiResponse
                    let statusCode: number

                    if (evse) {
                        body = OcpiResponse.withData(evse)
                        statusCode = 200
                    } else {
                        body = OcpiResponse.withMessage(2003, "Unknown EVSE")
                        statusCode = 404
                    }

                    body.ocn_signature = await signer?.getSignature({ body })
                    res.status(statusCode).send(body)
                } catch (err) {
                    next(err)
                }
            })

            /**
             * Get Connector
             */
            router.get("/sender/2.2/locations/:id/:evse/:connector", async (req, res, next) => {
                try {
                    const connector = await pluggableAPI.locations!.sender!.getConnector(
                        req.params.id,
                        req.params.evse,
                        req.params.connector
                    )

                    let body: OcpiResponse
                    let statusCode: number

                    if (connector) {
                        body = OcpiResponse.withData(connector)
                        statusCode = 200
                    } else {
                        body = OcpiResponse.withMessage(2003, "Unknown connector")
                        statusCode = 404
                    }

                    body.ocn_signature = await signer?.getSignature({ body })
                    res.status(statusCode).send(body)
                } catch (err) {
                    next(err)
                }
            })

        }

        return router
    }

}
