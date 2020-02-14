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

export class CdrsController extends CustomisableController {

    public static getRoutes(publicIP: string, pluggableAPI: IPluggableAPI, modules: IModules): Router {
        const router = Router()

        /**
         * RECEIVER interface
         */
        if (this.isIncluded("cdrs", "RECEIVER", modules, pluggableAPI)) {

            /**
             * GET cdr
             */
            router.get("/receiver/2.2/cdrs/:id", async (req, res) => {
                const cdr = await pluggableAPI.cdrs!.receiver!.get(req.params.id)
                if (cdr) {
                    res.send(OcpiResponse.withData(cdr))
                } else {
                    res.status(404).send(OcpiResponse.withMessage(2003, "cdr not found"))
                }
            })

            /**
             * POST cdr
             */
            router.post("/receiver/2.2/cdrs", async (req, res) => {
                pluggableAPI.cdrs!.receiver!.create(req.body)
                const location = url.resolve(publicIP, `/ocpi/receiver/2.2/cdrs/${req.body.id}`)
                res.set("Location", location).send(OcpiResponse.basicSuccess())
            })

        }

        if (this.isIncluded("cdrs", "SENDER", modules, pluggableAPI)) {

            /**
             * GET cdrs list
             */
            router.get("/sender/2.2/cdrs", async (req, res) => {
                const params = formatPaginationParams(req.query)
                const cdrs = await pluggableAPI.cdrs!.sender!.getList(params)
                res.send(OcpiResponse.withData(cdrs))
            })
        }

        return router;
    }
}
