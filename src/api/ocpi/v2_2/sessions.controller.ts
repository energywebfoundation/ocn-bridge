import { Router } from "express"
import { IModules } from "../../../models/bridgeConfigurationOptions"
import { OcpiResponse } from "../../../models/ocpi/common"
import { IPluggableAPI } from "../../../models/pluggableAPI"
import { formatPaginationParams } from "../../../tools/tools"
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
                const params = formatPaginationParams(req.query)
                const cdrs = await pluggableAPI.sessions!.sender!.getList(params)
                res.send(OcpiResponse.withData(cdrs))
            })
        }

        return router;
    }
}