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
