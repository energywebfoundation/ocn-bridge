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
import { IncomingHttpHeaders } from "http"
import fetch from "node-fetch"
import uuid from "uuid"
import { IModules } from "../../../models/bridgeConfigurationOptions"
import { CommandResponseType, IAsyncCommand } from "../../../models/ocpi/commands"
import { OcpiResponse } from "../../../models/ocpi/common"
import { IPluggableAPI } from "../../../models/pluggableAPI"
import { IPluggableDB } from "../../../models/pluggableDB"
import { SignerService } from "../../../services/signer.service"
import { setResponseHeaders, toOcpiParty } from "../../../tools"
import { CustomisableController } from "../advice/customisable"

/**
 * OCPI 2.2 commands module controller
 */
export class CommandsController extends CustomisableController {

    /**
     * Establish routes for the commands controller
     * @param pluggableAPI inject a pluggable API object to use in request handling
     */
    public static getRoutes(pluggableAPI: IPluggableAPI, pluggableDB: IPluggableDB, modules: IModules, signer?: SignerService): Router {
        const router = Router()

        /**
         * SENDER interface
         */
        if (this.isIncluded("commands", "SENDER", modules, pluggableAPI)) {

            /**
             * Receive async command result from CPO
             */
            router.post("/sender/2.2/commands/:command/:uid", async (req, res, next) => {
                try {
                    pluggableAPI.commands!.sender!.asyncResult(req.params.command, req.params.uid, req.body)
                    const body = OcpiResponse.basicSuccess()
                    body.ocn_signature = await signer?.getSignature({body})
                    res.send(body)
                } catch (err) {
                    next(err)
                }
            })
        }

        /**
         * RECEIVER interface
         */
        if (this.isIncluded("commands", "RECEIVER", modules, pluggableAPI)) {

            /**
             * OCPI command: CANCEL_RESERVATION
             */
            router.post("/receiver/2.2/commands/CANCEL_RESERVATION", async (req, res, next) => {
                try {
                    // await initial response to cancel reservation request
                    const response = await pluggableAPI.commands!.receiver!.cancelReservation(
                        req.body.reservation_id,
                        toOcpiParty(req.headers)
                    )
                    const body = OcpiResponse.withData(response.commandResponse)
                    body.ocn_signature = await signer?.getSignature({body})
                    // send the initial response
                    res.send(body)
                    // send the async response from the charge point
                    await this.sendAsyncResult(req.body.response_url, req.headers, response, pluggableDB, signer)
                } catch (err) {
                    next(err)
                }
            })

            /**
             * OCPI command: RESERVE_NOW
             */
            router.post("/receiver/2.2/commands/RESERVE_NOW", async (req, res, next) => {
                try {
                    // separate response_url from rest of body
                    const { responseURL, out: reserveRequest } = this.extractResponseURL(req.body)
                    // await initial response to reserve location/evse/connector
                    const response = await pluggableAPI.commands!.receiver!.reserveNow(
                        reserveRequest,
                        toOcpiParty(req.headers)
                    )
                    const body = OcpiResponse.withData(response.commandResponse)
                    body.ocn_signature = await signer?.getSignature({body})
                    // send initial response
                    res.send(body)
                    // send the async response from the charge point
                    await this.sendAsyncResult(responseURL, req.headers, response, pluggableDB, signer)
                } catch (err) {
                    next(err)
                }
            })

            /**
             * OCPI command: START_SESSION
             */
            router.post("/receiver/2.2/commands/START_SESSION", async (req, res, next) => {
                try {
                    // separate response_url from rest of body
                    const { responseURL, out: startRequest } = this.extractResponseURL(req.body)
                    // await initial response from CPO
                    const response = await pluggableAPI.commands!.receiver!.startSession(
                        startRequest,
                        toOcpiParty(req.headers)
                    )
                    const body = OcpiResponse.withData(response.commandResponse)
                    body.ocn_signature = await signer?.getSignature({body})
                    // send the initial response
                    res.send(body)
                    // send the async response from the charge point
                    await this.sendAsyncResult(responseURL, req.headers, response, pluggableDB, signer)
                } catch (err) {
                    next(err)
                }
            })

            /**
             * OCPI command: STOP_SESSION
             */
            router.post("/receiver/2.2/commands/STOP_SESSION", async (req, res, next) => {
                try {
                    // await the initial repsonse to stop a session
                    const response = await pluggableAPI.commands!.receiver!.stopSession(
                        req.body.session_id, 
                        toOcpiParty(req.headers)
                    )
                    const body = OcpiResponse.withData(response.commandResponse)
                    body.ocn_signature = await signer?.getSignature({body})
                    // send the inital response
                    res.send(body)
                    // send the async response from the charge point
                    await this.sendAsyncResult(req.body.response_url, req.headers, response, pluggableDB, signer)
                } catch (err) {
                    next(err)
                }
            })

            /**
             * OCPI command: UNLOCK_CONNECTOR
             */
            router.post("/receiver/2.2/commands/UNLOCK_CONNECTOR", async (req, res, next) => {
                try {
                    // await the initial response to unlock the connector
                    const response = await pluggableAPI.commands!.receiver!.unlockConnector(
                        req.body.location_id,
                        req.body.evse_uid,
                        req.body.connector_id,
                        toOcpiParty(req.headers)
                    )
                    const body = OcpiResponse.withData(response.commandResponse)
                    body.ocn_signature = await signer?.getSignature({body})
                    // send the initial response
                    res.send(body)
                    // send the async response from the charge point
                    await this.sendAsyncResult(req.body.response_url, req.headers, response, pluggableDB, signer)
                } catch (err) {
                    next(err)
                }
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
    private static async sendAsyncResult(responseURL: string, reqHeaders: IncomingHttpHeaders, response: IAsyncCommand, pluggableDB: IPluggableDB, signer?: SignerService) {
        if (this.responseWasAccepted(response) && response.commandResult) {
            console.log("in updated command")
            // await the async response
            const asyncResult = await response.commandResult()
            // fetch token (TOKEN_C) for OCN node authorization
            const tokenC = await pluggableDB.getTokenC()
            // fire and forget request
            const signableHeaders = setResponseHeaders(reqHeaders)
            const signature = await signer?.getSignature({ headers: signableHeaders, body: asyncResult });
            const isValidSignature = signature && signature !== "undefined" && signature !== undefined;
            console.log(signature, "The signature")
            const baseHeaders = Object.assign({
                "authorization": `Token ${tokenC}`,
                "content-type": "application/json",
                "x-request-id": uuid.v4(),
                "test": "test1"
            }, signableHeaders)
            const headers = {
                ...baseHeaders,
                ...(isValidSignature &&  {"ocn-signature": signature})
            }
            await fetch(responseURL, {
                method: "POST",
                headers: headers as {[key: string]: any},
                body: JSON.stringify(asyncResult)
            })
        }
    }

}
