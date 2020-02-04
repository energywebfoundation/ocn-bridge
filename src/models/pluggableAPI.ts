import { IOcpiParty } from "../services/push.service";
import { IChargeDetailRecord } from "./ocpi/cdrs";
import { IAsyncCommand, ICommandResult } from "./ocpi/commands";
import { IPaginationParams } from "./ocpi/common";
import { IConnector, IEvse, ILocation } from "./ocpi/locations";
import { ISession } from "./ocpi/session";
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
            asyncResult(command: string, uid: string, result: ICommandResult): void
        },
        receiver?: {
            cancelReservation(reservationID: string): Promise<IAsyncCommand>
            reserveNow(request: IReserveNow): Promise<IAsyncCommand>
            startSession(request: IStartSession, recipient: IOcpiParty): Promise<IAsyncCommand>
            stopSession(sessionID: string, recipient: IOcpiParty): Promise<IAsyncCommand>
            unlockConnector(locationID: string, evseUID: string, connectorID: string): Promise<IAsyncCommand>
        }
    }
    locations?: {
        sender?: {
            // TODO: needs to return Pair<ILocation[], Headers>
            getList(pagination?: IPaginationParams): Promise<IPaginationResponse<ILocation[]>>
            getObject(id: string): Promise<ILocation | undefined>
            getEvse(locationID: string, evseUID: string): Promise<IEvse | undefined>
            getConnector(locationID: string, evseUID: string, connectorID: string): Promise<IConnector | undefined>
        }
    }
    tariffs?: {
        sender?: {
            // TODO: needs to return Pair<ILocation[], Headers>
            getList(IPaginationParams?: IPaginationParams): Promise<IPaginationResponse<ITariff[]>>
        }
    }
    sessions?: {
        receiver?: {
            update(session: ISession): void
        }
        sender?: {
            // TODO: needs to return Pair<ILocation[], Headers>
            getList(IPaginationParams?: IPaginationParams): Promise<IPaginationResponse<ISession[]>>
        }
    }
    cdrs?: {
        receiver?: {
            get(id: string): Promise<IChargeDetailRecord | undefined>
            create(cdr: IChargeDetailRecord): void
        }
        sender?: {
            // TODO: needs to return Pair<ILocation[], Headers>
            getList(IPaginationParams?: IPaginationParams): Promise<IPaginationResponse<IChargeDetailRecord[]>>
        }
    }
}
