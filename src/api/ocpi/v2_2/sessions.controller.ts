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
import { formatPaginationParams } from "../../../tools"
import { CustomisableController } from "../advice/customisable"
import { SignerService } from "../../../services/signer.service"

export class SessionsController extends CustomisableController {

    public static getRoutes(pluggableAPI: IPluggableAPI, modules: IModules, signer?: SignerService): Router {
        const router = Router()

        /**
         * RECEIVER interface
         */
        if (this.isIncluded("sessions", "RECEIVER", modules, pluggableAPI)) {

            /**
             * PUT session
             */
            router.put("/receiver/2.2/sessions/:country_code/:party_id/:session_id", async (req, res, next) => {
                try {
                    pluggableAPI.sessions!.receiver!.update(req.body)
                    const body = OcpiResponse.basicSuccess()
                    body.ocn_signature = await signer?.getSignature({ body })
                    res.send(body )
                } catch (err) {
                    next(err)
                }
            })

        }
        if (this.isIncluded("sessions", "SENDER", modules, pluggableAPI)) {
            /**
             * GET cdrs list
             */
            router.get("/sender/2.2/sessions", async (req, res, next) => {
                try {
                    const params = formatPaginationParams(req.query)
                    const result = await pluggableAPI.sessions!.sender!.getList(params)
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
