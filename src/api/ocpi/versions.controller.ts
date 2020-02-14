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
import * as url from "url"
import { IModules } from "../../models/bridgeConfigurationOptions"
import { OcpiResponse } from "../../models/ocpi/common"
import { CustomisableController } from "./advice/customisable"

export class VersionsController extends CustomisableController {

    public static getRoutes(publicIP: string, modules: IModules): Router {
        const router = Router()

        const endpoints = this.getNeededEndpoints(publicIP, modules)

        router.get("/versions", async (_, res) => {
            res.send(OcpiResponse.withData([
                {
                    version: "2.2",
                    url: url.resolve(publicIP, "/ocpi/versions/2.2")
                }
            ]))
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
