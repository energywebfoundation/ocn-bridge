import { Router } from "express"
import * as url from "url"
import { IModules } from "../../models/bridgeConfigurationOptions"
import { OcpiResponse } from "../../models/ocpi/common"
import { CustomisableController } from "./advice/customisable"

export class VersionsController extends CustomisableController {

    public static getRoutes(publicIP: string, modules: IModules): Router {
        const router = Router()

        const endpoints = this.getNeededEndpoints(publicIP, modules)

        router.get("/versions", async (_, res) => {
            res.send(OcpiResponse.withData({
                versions: [
                    {
                        version: "2.2",
                        url: url.resolve(publicIP, "/ocpi/versions/2.2")
                    }
                ]
            }))
        })

        router.get("/versions/2.2", async (_, res) => {
            res.send(OcpiResponse.withData({
                version: "2.2",
                endpoints
            }))
        })

        return router
    }

}
