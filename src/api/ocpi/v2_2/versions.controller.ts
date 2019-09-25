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
            res.send({
                versions: [
                    {
                        version: "2.2",
                        // TODO: configurable public IP
                        url: url.resolve(publicIP, "/ocpi/versions/2.2")
                    }
                ]
            })
        })

        router.get("/2.2", isAuthorized, async (_, res) => {
            res.send({
                version: "2.2",
                endpoints: [
                    // TODO: add implemented endpoints
                ]
            })
        })
        return router
    }

}
