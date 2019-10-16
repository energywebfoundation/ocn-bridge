import { Router } from "express"
import * as url from "url"
import { IModules } from "../../../models/bridgeConfigurationOptions"
import { OcpiResponse } from "../../../models/ocpi/common"
import { IPluggableAPI } from "../../../models/pluggableAPI"
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

        return router;
    }
}
