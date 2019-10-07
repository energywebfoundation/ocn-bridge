import { NextFunction, Request, Response } from "express"
import { OcpiResponse } from "../../../../models/ocpi/common"
import { IPluggableDB } from "../../../../models/pluggableDB"

/**
 * Express middleware to check for OCN client's TOKEN_C on incoming requests
 */
export const isAuthorized = (pluggableDB: IPluggableDB) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const tokenB = await pluggableDB.getTokenB()
        if (req.headers.authorization !== `Token ${tokenB}`) {
            return res.status(401).send(OcpiResponse.withMessage(4001, "Unauthorized"))
        }
        return next()
    }
}
