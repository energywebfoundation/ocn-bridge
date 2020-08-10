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
import { IOcpiParty } from "../services/push.service";
import { IChargeDetailRecord } from "./ocpi/cdrs";
import { IAsyncCommand, ICommandResult } from "./ocpi/commands";
import { IPaginationParams } from "./ocpi/common";
import { IConnector, IEvse, ILocation } from "./ocpi/locations";
import { ISession } from "./ocpi/sessions";
import { ITariff } from "./ocpi/tariffs";
import { IToken } from "./ocpi/tokens";

export interface IReserveNow {
    token: IToken
    expiry_date: string
    reservation_id: string
    location_id: string
    evse_uid?: string
    connector_id?: string
}

export interface IStartSession {
    token: IToken
    location_id: string
    evse_uid?: string
    connector_id?: string
}

export interface IPaginationResponse<T> {
    headers?: {[key: string]: string}
    data: T
}

export interface IPluggableAPI {
    commands?: {
        sender?: {
            asyncResult(command: string, uid: string, result: ICommandResult): Promise<void>
        },
        receiver?: {
            cancelReservation(reservationID: string, recipient: IOcpiParty): Promise<IAsyncCommand>
            reserveNow(request: IReserveNow, recipient: IOcpiParty): Promise<IAsyncCommand>
            startSession(request: IStartSession, recipient: IOcpiParty): Promise<IAsyncCommand>
            stopSession(sessionID: string, recipient: IOcpiParty): Promise<IAsyncCommand>
            unlockConnector(locationID: string, evseUID: string, connectorID: string, recipient: IOcpiParty): Promise<IAsyncCommand>
        }
    }
    locations?: {
        sender?: {
            getList(pagination?: IPaginationParams): Promise<IPaginationResponse<ILocation[]>>
            getObject(id: string): Promise<ILocation | undefined>
            getEvse(locationID: string, evseUID: string): Promise<IEvse | undefined>
            getConnector(locationID: string, evseUID: string, connectorID: string): Promise<IConnector | undefined>
        }
    }
    tariffs?: {
        sender?: {
            getList(IPaginationParams?: IPaginationParams): Promise<IPaginationResponse<ITariff[]>>
        }
    }
    sessions?: {
        receiver?: {
            update(session: ISession): Promise<void>
        }
        sender?: {
            getList(IPaginationParams?: IPaginationParams): Promise<IPaginationResponse<ISession[]>>
        }
    }
    cdrs?: {
        receiver?: {
            get(countryCode: string, partyId: string, id: string): Promise<IChargeDetailRecord | undefined>
            create(cdr: IChargeDetailRecord): Promise<void>
        }
        sender?: {
            getList(IPaginationParams?: IPaginationParams): Promise<IPaginationResponse<IChargeDetailRecord[]>>
        }
    }
}
