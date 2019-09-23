import { CommandResponseType, CommandResultType, IAsyncCommand } from "../../src/models/ocpi/commands";
import { IPluggableAPI } from "../../src/models/pluggableAPI";

/**
 * Stub PluggableAPI class for testing the OCN Bridge
 */
export class PluggableAPIStub implements IPluggableAPI {
    public commands = {
        async startSession(_: string): Promise<IAsyncCommand> {
            return {
                commandResponse: {
                    result: CommandResponseType.ACCEPTED,
                    timeout: 10
                },
                commandResult: () => {
                    return new Promise((resolve, _reject) => {
                        setTimeout(() => {
                            resolve({
                                result: CommandResultType.ACCEPTED
                            })
                        }, 20)
                    })
                }
            }
        }
    }
}
