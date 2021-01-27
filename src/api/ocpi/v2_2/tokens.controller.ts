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
import { Router } from "express"
import { IModules } from "../../../models/bridgeConfigurationOptions"
import { OcpiResponse } from "../../../models/ocpi/common"
import { IPluggableAPI } from "../../../models/pluggableAPI"
import { formatPaginationParams } from "../../../tools"
import { CustomisableController } from "../advice/customisable"
import { SignerService } from "../../../services/signer.service"
import { ITokenType, IUnauthorizedToken } from "../../../models/ocpi/tokens"

export class TokensController extends CustomisableController {

    public static getRoutes(pluggableAPI: IPluggableAPI, modules: IModules, signer?: SignerService): Router {
        const router = Router()

        /**
         * SENDER interface
         */
        if (this.isIncluded("tokens", "SENDER", modules, pluggableAPI)) {

            /**
             * GET tokens list
             */
            router.get("/sender/2.2/tokens", async (req, res, next) => {
                try {
                    const params = formatPaginationParams(req.query)
                    const result = await pluggableAPI.tokens!.sender!.getList(params)
                    const body = OcpiResponse.withData(result.data)
                    body.ocn_signature = await signer?.getSignature({ headers: result.headers, body })
                    res.set(result.headers).send(body)
                } catch (err) {
                    next(err)
                }
            })

            /**
             * POST real-time authorization
             */
            router.post("/sender/2.2/tokens/:uid/authorize", async (req, res, next) => {
                try {
                    const type: ITokenType = req.query.type as ITokenType || "RFID"
                    const authorizationInfo = await pluggableAPI.tokens!.sender!.authorize(req.params.uid, type, req.body)
                    let body: OcpiResponse
                    if ((authorizationInfo as IUnauthorizedToken).unknownToken) {
                        body = OcpiResponse.withMessage(2004, "Unknown token")
                    } else if ((authorizationInfo as IUnauthorizedToken).notEnoughInformation) {
                        body = OcpiResponse.withMessage(2002, "Not enough information")
                    } else {
                        body = OcpiResponse.withData(authorizationInfo)
                    }
                    body.ocn_signature = await signer?.getSignature({ body })
                    res.send(body)
                } catch (err) {
                    next(err)
                }
            })

        }

        return router;
    }
}
