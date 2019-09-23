export enum CommandResponseType {
    NOT_SUPPORTED = "NOT_SUPPORTED",
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED",
    UNKNOWN_SESSION = "UNKNOWN_SESSION"
}

export enum CommandResultType {
    ACCEPTED = "ACCEPTED",
    CANCELED_RESERVATION = "CANCELED_RESERVATION",
    EVSE_OCCUPIED = "EVSE_OCCUPIED",
    EVSE_INOPERATIVE = "EVSE_INOPERATIVE",
    FAILED = "FAILED",
    NOT_SUPPORTED = "NOT_SUPPORTED",
    REJECTED = "REJECTED",
    TIMEOUT = "TIMEOUT",
    UNKNOWN_RESERVATION = "UNKNOWN_RESERVATION"
}

export interface ICommandResponse {
    result: CommandResponseType
    timeout: number
    message?: string
}

export interface ICommandResult {
    result: CommandResultType
    message?: string

}

export interface IAsyncCommand {
    commandResponse: ICommandResponse
    commandResult: () => Promise<ICommandResult>
}
