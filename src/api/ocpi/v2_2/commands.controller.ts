import { Router } from "express"
import { IncomingHttpHeaders } from "http"
import fetch from "node-fetch"
import { IModules } from "../../../models/bridgeConfigurationOptions"
import { CommandResponseType, IAsyncCommand } from "../../../models/ocpi/commands"
import { OcpiResponse } from "../../../models/ocpi/common"
import { IPluggableAPI } from "../../../models/pluggableAPI"
import { IPluggableDB } from "../../../models/pluggableDB"
import { PushService } from "../../../services/push.service"
import { setResponseHeaders } from "../../../tools/tools"
import { CustomisableController } from "../advice/customisable"

/**
 * OCPI 2.2 commands module controller
 */
export class CommandsController extends CustomisableController {

    /**
     * Establish routes for the commands controller
     * @param pluggableAPI inject a pluggable API object to use in request handling
     */
    public static getRoutes(pluggableAPI: IPluggableAPI, pluggableDB: IPluggableDB, modules: IModules, pushService: PushService): Router {
        const router = Router()

        /**
         * SENDER interface
         */
        if (this.isIncluded("commands", "SENDER", modules, pluggableAPI)) {

            /**
             * Receive async command result from CPO
             */
            router.post("/sender/2.2/commands/:command/:uid", async (req, res) => {
                pluggableAPI.commands!.sender!.asyncResult(req.params.command, req.params.uid, req.body)
                res.send(OcpiResponse.basicSuccess())
            })
        }

        /**
         * RECEIVER interface
         */
        if (this.isIncluded("commands", "RECEIVER", modules, pluggableAPI)) {

            /**
             * OCPI command: CANCEL_RESERVATION
             */
            router.post("/receiver/2.2/commands/CANCEL_RESERVATION", async (req, res) => {
                // await initial response to cancel reservation request
                const response = await pluggableAPI.commands!.receiver!.cancelReservation(req.body.reservation_id)
                // send the initial response
                res.send(OcpiResponse.withData(response.commandResponse))
                // send the async response from the charge point
                await this.sendAsyncResult(req.body.response_url, req.headers, response, pluggableDB)
            })

            /**
             * OCPI command: RESERVE_NOW
             */
            router.post("/receiver/2.2/commands/RESERVE_NOW", async (req, res) => {
                // separate response_url from rest of body
                const { responseURL, out: reserveRequest } = this.extractResponseURL(req.body)
                // await initial response to reserve location/evse/connector
                const response = await pluggableAPI.commands!.receiver!.reserveNow(reserveRequest)
                // send initial response
                res.send(OcpiResponse.withData(response.commandResponse))
                // send the async response from the charge point
                await this.sendAsyncResult(responseURL, req.headers, response, pluggableDB)
            })

            /**
             * OCPI command: START_SESSION
             */
            router.post("/receiver/2.2/commands/START_SESSION", async (req, res) => {
                // separate response_url from rest of body
                const { responseURL, out: startRequest } = this.extractResponseURL(req.body)
                // prepare push functions
                const sendSessionFunc = pushService.prepareSessionUpdate(req.headers)
                const sendCdrFunc = pushService.prepareCDR(req.headers)
                // await initial response from CPO
                const response = await pluggableAPI.commands!.receiver!.startSession(
                    startRequest,
                    sendSessionFunc,
                    sendCdrFunc
                )
                // send the initial response
                res.send(OcpiResponse.withData(response.commandResponse))
                // send the async response from the charge point
                await this.sendAsyncResult(responseURL, req.headers, response, pluggableDB)
            })

            /**
             * OCPI command: STOP_SESSION
             */
            router.post("/receiver/2.2/commands/STOP_SESSION", async (req, res) => {
                // await the initial repsonse to stop a session
                const response = await pluggableAPI.commands!.receiver!.stopSession(req.body.session_id)
                // send the inital response
                res.send(OcpiResponse.withData(response.commandResponse))
                // send the async response from the charge point
                await this.sendAsyncResult(req.body.response_url, req.headers, response, pluggableDB)
            })

            /**
             * OCPI command: UNLOCK_CONNECTOR
             */
            router.post("/receiver/2.2/commands/UNLOCK_CONNECTOR", async (req, res) => {
                // await the initial response to unlock the connector
                const response = await pluggableAPI.commands!.receiver!.unlockConnector(
                    req.body.location_id,
                    req.body.evse_uid,
                    req.body.connector_id
                )
                // send the initial response
                res.send(OcpiResponse.withData(response.commandResponse))
                // send the async response from the charge point
                await this.sendAsyncResult(req.body.response_url, req.headers, response, pluggableDB)
            })

        }

        return router
    }

    /**
     * Extract the response_url from a request body
     * @param body OCPI request body (i.e. StartSession, ReserveNow)
     * @returns the separated response_url and body
     */
    private static extractResponseURL(body: any): { responseURL: string, out: any } {
        const responseURL = body.response_url
        delete body.response_url
        return {
            responseURL,
            out: body
        }
    }

    /**
     * Check that a command was initially successful
     * @param response CommandResponse object containing result property (CommandResponseType)
     * @returns true if ACCEPTED
     */
    private static responseWasAccepted(response: IAsyncCommand): boolean {
        return response.commandResponse.result === CommandResponseType.ACCEPTED
    }

    /**
     * Send the CommandResult received asynchronously from the charge point to the command sender
     * @param responseURL the response_url contained in the initial command request
     * @param response the full IAsyncResult object containing CommandResponse and CommandResult
     */
    private static async sendAsyncResult(responseURL: string, reqHeaders: IncomingHttpHeaders, response: IAsyncCommand, pluggableDB: IPluggableDB) {
        if (this.responseWasAccepted(response) && response.commandResult) {
            // await the async response
            const asyncResult = await response.commandResult()
            // fetch token (TOKEN_C) for OCN client authorization
            const tokenC = await pluggableDB.getTokenC()
            // fire and forget request
            await fetch(responseURL, {
                method: "POST",
                headers: Object.assign({
                    "Authorization": `Token ${tokenC}`,
                    "Content-Type": "application/json",
                }, setResponseHeaders(reqHeaders)),
                body: JSON.stringify(asyncResult)
            })
        }
    }

}
