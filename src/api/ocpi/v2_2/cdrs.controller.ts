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
import * as url from "url"
import { IModules } from "../../../models/bridgeConfigurationOptions"
import { OcpiResponse } from "../../../models/ocpi/common"
import { IPluggableAPI } from "../../../models/pluggableAPI"
import { formatPaginationParams } from "../../../tools/tools"
import { CustomisableController } from "../advice/customisable"
import { SignerService } from "../../../services/signer.service"

export class CdrsController extends CustomisableController {

    public static getRoutes(publicIP: string, pluggableAPI: IPluggableAPI, modules: IModules, signer?: SignerService): Router {
        const router = Router()

        /**
         * RECEIVER interface
         */
        if (this.isIncluded("cdrs", "RECEIVER", modules, pluggableAPI)) {

            /**
             * GET cdr
             */
            router.get("/receiver/2.2/cdrs/:country_code/:party_id/:id", async (req, res, next) => {
                try {
                    const cdr = await pluggableAPI.cdrs!.receiver!.get(
                        req.params.country_code,
                        req.params.party_id,    
                        req.params.id
                    )
                    let statusCode: number
                    let body: OcpiResponse
    
                    if (cdr) {
                        statusCode = 200
                        body = OcpiResponse.withData(cdr)
                    } else {
                        statusCode = 404
                        body = OcpiResponse.withMessage(2003, "cdr not found")
                    }
                    
                    body.ocn_signature = await signer?.getSignature({body})
                    res.status(statusCode).send(body)
                } catch (err) {
                    next(err)
                }
            })

            /**
             * POST cdr
             */
            router.post("/receiver/2.2/cdrs", async (req, res, next) => {
                try {
                    pluggableAPI.cdrs!.receiver!.create(req.body)
                    const location = url.resolve(publicIP, `/ocpi/receiver/2.2/cdrs/${req.body.id}`)
    
                    const body = OcpiResponse.basicSuccess()
                    body.ocn_signature = await signer?.getSignature({ headers: { "location": location }, body })
                    res.set("Location", location).send(body)
                } catch (err) {
                    next(err)
                }
            })

        }

        if (this.isIncluded("cdrs", "SENDER", modules, pluggableAPI)) {

            /**
             * GET cdrs list
             */
            router.get("/sender/2.2/cdrs", async (req, res, next) => {
                try {
                    const params = formatPaginationParams(req.query)
                    const result = await pluggableAPI.cdrs!.sender!.getList(params)
    
                    const body = OcpiResponse.withData(result.data)
                    body.ocn_signature = await signer?.getSignature({ headers: result.headers, body })
                    res.set(result.headers).send(body)
                } catch (err) {
                    next(err)
                }
            })
        }

        return router;
    }
}
