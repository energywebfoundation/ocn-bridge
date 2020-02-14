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
    commandResult?: () => Promise<ICommandResult>
}
