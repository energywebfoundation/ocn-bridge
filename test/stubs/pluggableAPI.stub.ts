import { IChargeDetailRecord } from "../../src/models/ocpi/cdrs";
import { CommandResponseType, CommandResultType, IAsyncCommand, ICommandResult } from "../../src/models/ocpi/commands";
import { IConnector, IEvse, ILocation } from "../../src/models/ocpi/locations";
import { ISession } from "../../src/models/ocpi/session";
import { ITariff } from "../../src/models/ocpi/tariffs";
import { IPaginationResponse, IPluggableAPI } from "../../src/models/pluggableAPI";
import { testCdr, testCdrList, testLocations, testSessionList, testTariffs } from "../data/test-data";

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
        sender: {
            asyncResult(): void {
                return
            }
        },
        receiver: {
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
    public locations = {
        sender: {
            async getList(): Promise<IPaginationResponse<ILocation[]>> {
                return {data: testLocations}
            },
            async getObject(): Promise<ILocation | undefined> {
                return testLocations[0]
            },
            async getEvse(): Promise<IEvse | undefined> {
                return testLocations[0].evses && testLocations[0].evses[0]
            },
            async getConnector(): Promise<IConnector | undefined> {
                if (testLocations[0].evses && testLocations[0].evses[0]) {
                    return testLocations[0].evses[0].connectors[0]
                }
                return
            }
        }
    }
    public tariffs = {
        sender: {
            async getList(): Promise<IPaginationResponse<ITariff[]>> {
                return {data: testTariffs}
            }
        }
    }
    public sessions = {
        receiver: {
            update(): void {
                return
            }
        },
        sender: {
            async getList(): Promise<IPaginationResponse<ISession[]>> {
                return {data: testSessionList}
            }
        }
    }
    public cdrs = {
        receiver: {
            async get(): Promise<IChargeDetailRecord> {
                return testCdr
            },
            create(): void {
                return
            }
        },
        sender: {
            async getList(): Promise<IPaginationResponse<IChargeDetailRecord[]>> {
                return {data: testCdrList}
            }
        }
    }
}
