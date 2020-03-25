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
import { formatPaginationParams, wrapApiMethod } from "../../../tools/tools"
import { CustomisableController } from "../advice/customisable"

export class SessionsController extends CustomisableController {

    public static getRoutes(pluggableAPI: IPluggableAPI, modules: IModules): Router {
        const router = Router()

        /**
         * RECEIVER interface
         */
        if (this.isIncluded("sessions", "RECEIVER", modules, pluggableAPI)) {

            /**
             * PUT session
             */
            router.put("/receiver/2.2/sessions/:country_code/:party_id/:session_id", async (req, res) => {
                pluggableAPI.sessions!.receiver!.update(req.body)
                res.send(OcpiResponse.basicSuccess())
            })

        }

        if (this.isIncluded("sessions", "SENDER", modules, pluggableAPI)) {
            /**
             * GET cdrs list
             */
            router.get("/sender/2.2/sessions", async (req, res) => {
                await wrapApiMethod(async () => {
                    const params = formatPaginationParams(req.query)
                    const result = await pluggableAPI.sessions!.sender!.getList(params)
                    return res.set(result.headers).send(OcpiResponse.withData(result.data))
                }, res)
            })
        }

        return router;
    }
}
