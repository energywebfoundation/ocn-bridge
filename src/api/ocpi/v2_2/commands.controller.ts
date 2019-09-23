import { Router } from "express"
import fetch from "node-fetch"
import { CommandResponseType, ICommandResponse, ICommandResult } from "../../../models/ocpi/commands"
import { IPluggableAPI } from "../../../models/pluggableAPI"

/**
 * OCPI 2.2 commands module controller
 */
export class CommandsController {

    /**
     * Establish routes for the commands controller
     * @param pluggableAPI inject a pluggable API object to use in request handling
     */
    public static getRoutes(pluggableAPI: IPluggableAPI): Router {
        const router = Router()

        /**
         * OCPI command: START_SESSION
         * body: StartSession
         * response: CommandResponse
         * async result: CommandResult
         */
        router.post("/START_SESSION", async (req, res) => {
            // TODO: token authorization middleware

            // TODO: handle token? e.g. only accept AD_HOC or APP_USER

            const response = await pluggableAPI.commands.startSession(req.body.location_id)
            res.send(response.commandResponse)

            if (this.responseWasAccepted(response.commandResponse)) {
                const asyncResult = await response.commandResult()
                await this.sendAsyncResult(req.body.response_url, asyncResult)
            }
        })

        return router
    }

    /**
     * Check that a command was initially successful
     * @param response CommandResponse object containing result property (CommandResponseType)
     * @returns true if ACCEPTED
     */
    private static responseWasAccepted(response: ICommandResponse): boolean {
        return response.result === CommandResponseType.ACCEPTED
    }

    /**
     * Send the CommandResult received asynchronously from the charge point to the command sender
     * @param responseURL the response_url contained in the initial command request
     * @param result the asynchronous CommandResult received from the charge point
     */
    private static async sendAsyncResult(responseURL: string, result: ICommandResult) {
        await fetch(responseURL, {
            method: "POST",
            headers: {
                // TODO: include authorization header
                "Content-Type": "application/json"
            },
            body: JSON.stringify(result)
        })
    }

}
