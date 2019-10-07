import { Router } from "express"
import { OcpiResponse } from "../../../models/ocpi/common"
import { IPluggableAPI } from "../../../models/pluggableAPI"
import { IPluggableDB } from "../../../models/pluggableDB"
import { formatPaginationParams } from "../../../tools/tools"
import { isAuthorized } from "./middleware/middleware"

/**
 * OCPI 2.2 commands module controller
 */
export class LocationsController {

    /**
     * Establish routes for the commands controller
     * @param pluggableAPI inject a pluggable API object to use in request handling
     */
    public static getRoutes(pluggableAPI: IPluggableAPI, pluggableDB: IPluggableDB): Router {
        const router = Router()

        /**
         * GET location list
         */
        router.get("/", isAuthorized(pluggableDB), async (req, res) => {
            const params = formatPaginationParams(req.query)
            const locations = await pluggableAPI.locations.getList(params)
            res.send(OcpiResponse.withData(locations))
        })

        /**
         * Get location
         */
        router.get("/:id", isAuthorized(pluggableDB), async (req, res) => {
            const location = await pluggableAPI.locations.getObject(req.params.id)
            if (location) {
                res.send(OcpiResponse.withData(location))
            } else {
                res.send(OcpiResponse.withMessage(2003, "Unknown location"))
            }
        })

        /**
         * Get EVSE
         */
        router.get("/:id/:evse", isAuthorized(pluggableDB), async (req, res) => {
            const evse = await pluggableAPI.locations.getEvse(req.params.id, req.params.evse)
            if (evse) {
                res.send(OcpiResponse.withData(evse))
            } else {
                res.send(OcpiResponse.withMessage(2003, "Unknown EVSE"))
            }
        })

        /**
         * Get Connector
         */
        router.get("/:id/:evse/:connector", isAuthorized(pluggableDB), async (req, res) => {
            const connector = await pluggableAPI.locations.getConnector(
                req.params.id,
                req.params.evse,
                req.params.connectors
            )
            if (connector) {
                res.send(OcpiResponse.withData(connector))
            } else {
                res.send(OcpiResponse.withMessage(2003, "Unknown connector"))
            }
        })

        return router
    }

}
