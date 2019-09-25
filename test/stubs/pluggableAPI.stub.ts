import { CommandResponseType, CommandResultType, IAsyncCommand, ICommandResult } from "../../src/models/ocpi/commands";
import { IPluggableAPI } from "../../src/models/pluggableAPI";

const asyncCommandNotSupported = {
    commandResponse: {
        result: CommandResponseType.NOT_SUPPORTED,
        timeout: 0
    }
}

const asyncCommandAccepted = {
    commandResponse: {
        result: CommandResponseType.ACCEPTED,
        timeout: 10
    },
    commandResult: (): Promise<ICommandResult> => {
        return new Promise((resolve, _reject) => {
            setTimeout(() => {
                resolve({
                    result: CommandResultType.ACCEPTED
                })
            }, 20)
        })
    }
}

/**
 * Stub PluggableAPI class for testing the OCN Bridge
 */
export class PluggableAPIStub implements IPluggableAPI {
    public commands = {
        async cancelReservation(): Promise<IAsyncCommand> {
            return asyncCommandNotSupported
        },
        async reserveNow(): Promise<IAsyncCommand> {
            return asyncCommandNotSupported
        },
        async startSession(): Promise<IAsyncCommand> {
            return asyncCommandAccepted
        },
        async stopSession(): Promise<IAsyncCommand> {
            return asyncCommandAccepted
        },
        async unlockConnector(): Promise<IAsyncCommand> {
            return asyncCommandNotSupported
        }
    }
}
