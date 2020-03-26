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
import { SignerService } from "../../../services/signer.service"
import { ISignableHeaders, IValuesToSign } from "@shareandcharge/ocn-notary/dist/ocpi-request.interface"

export const handleOcpiErrors = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    return res.send(OcpiResponse.withMessage(3000, err.message))
}

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

export const hasValidSignature = (signerService?: SignerService) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (signerService) {
            if (!req.headers["OCN-Signature"]) {
                return res.status(400).send(OcpiResponse.withMessage(2001, "Missing required OCN-Signature header"))
            }
            try {
                const values: IValuesToSign = {
                    headers: extractHeaders(req.headers),
                    params: req.params,
                    body: req.body
                }
                await signerService.validate(req.headers["OCN-Signature"] as string, values)
            } catch (err) {
                return res.status(400).send(OcpiResponse.withMessage(2001, err.message))
            }
        }
        return next()
    }
}

function extractHeaders(headers: any): ISignableHeaders {
    return {
        "x-correlation-id": headers["x-correlation-id"],
        "ocpi-from-country-code": headers["ocpi-from-country-code"],
        "ocpi-from-party-id": headers["ocpi-from-party-id"],
        "ocpi-to-country-code": headers["ocpi-to-country-code"],
        "ocpi-to-party-id": headers["ocpi-to-party-id"]
    }
}
