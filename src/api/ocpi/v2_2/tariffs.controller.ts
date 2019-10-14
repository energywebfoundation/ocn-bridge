import { Router } from "express"
import { OcpiResponse } from "../../../models/ocpi/common"
import { IPluggableAPI } from "../../../models/pluggableAPI"
import { IPluggableDB } from "../../../models/pluggableDB"
import { formatPaginationParams } from "../../../tools/tools"
import { isAuthorized } from "./middleware/middleware"

export class TariffsController {
    public static getRoutes(pluggableAPI: IPluggableAPI, pluggableDB: IPluggableDB): Router {
        const router = Router()

        /**
         * GET tariffs list
         */
        router.get("/", isAuthorized(pluggableDB), async (req, res) => {
            const params = formatPaginationParams(req.query)
            const tariffs = await pluggableAPI.tariffs.getList(params)
            res.send(OcpiResponse.withData(tariffs))
        })

        return router;
    }
}
