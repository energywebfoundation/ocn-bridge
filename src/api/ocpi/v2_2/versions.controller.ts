import { NextFunction, Request, Response, Router } from "express"
import * as url from "url"
import { OcpiResponse } from "../../../models/ocpi/common"
import { IPluggableDB } from "../../../models/pluggableDB"

export class VersionsController {

    public static getRoutes(publicIP: string, pluggableDB: IPluggableDB): Router {
        const router = Router()

        const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
            const tokenB = await pluggableDB.getTokenB()
            if (req.headers.authorization !== `Token ${tokenB}`) {
                return res.status(401).send(OcpiResponse.withMessage(2001, "Unauthorized"))
            }
            return next()
        }

        router.get("/", isAuthorized, async (_, res) => {
            res.send(OcpiResponse.withData(1000, {
                versions: [
                    {
                        version: "2.2",
                        url: url.resolve(publicIP, "/ocpi/versions/2.2")
                    }
                ]
            }))
        })

        router.get("/2.2", isAuthorized, async (_, res) => {
            res.send(OcpiResponse.withData(1000, {
                version: "2.2",
                endpoints: [
                    {
                        identifier: "commands",
                        role: "RECEIVER",
                        url: url.resolve(publicIP, "/ocpi/receiver/2.2/commands")
                    }
                ]
            }))
        })
        return router
    }

}
