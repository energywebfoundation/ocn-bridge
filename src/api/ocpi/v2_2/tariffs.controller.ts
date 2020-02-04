import { Router } from "express"
import { IModules } from "../../../models/bridgeConfigurationOptions"
import { OcpiResponse } from "../../../models/ocpi/common"
import { IPluggableAPI } from "../../../models/pluggableAPI"
import { formatPaginationParams } from "../../../tools/tools"
import { CustomisableController } from "../advice/customisable"

export class TariffsController extends CustomisableController {

    public static getRoutes(pluggableAPI: IPluggableAPI, modules: IModules): Router {
        const router = Router()

        /**
         * SENDER interface
         */
        if (this.isIncluded("tariffs", "SENDER", modules, pluggableAPI)) {

            /**
             * GET tariffs list
             */
            router.get("/sender/2.2/tariffs", async (req, res) => {
                const params = formatPaginationParams(req.query)
                const result = await pluggableAPI.tariffs!.sender!.getList(params)
                res.set(result.headers).send(OcpiResponse.withData(result.data))
            })

        }

        return router;
    }
}
