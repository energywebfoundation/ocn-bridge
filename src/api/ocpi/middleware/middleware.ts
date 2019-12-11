import { NextFunction, Request, Response } from "express"
import { OcpiResponse } from "../../../models/ocpi/common"
import { IPluggableDB } from "../../../models/pluggableDB"

/**
 * Express middleware to check for OCN node's TOKEN_C on incoming requests
 */
export const isAuthorized = (pluggableDB: IPluggableDB) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const storedToken = await pluggableDB.getTokenB()
        if (req.headers.authorization !== `Token ${storedToken}`) {
            return res.status(401).send(OcpiResponse.withMessage(4001, "Unauthorized"))
        }
        return next()
    }
}
