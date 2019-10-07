import { sendCdrFunc, sendSessionFunc } from "../services/push.service";
import { IAsyncCommand } from "./ocpi/commands";
import { IPaginationParams } from "./ocpi/common";
import { IConnector, IEvse, ILocation } from "./ocpi/locations";
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

export interface IPluggableAPI {
    commands: {
        cancelReservation(reservationID: string): Promise<IAsyncCommand>
        reserveNow(request: IReserveNow): Promise<IAsyncCommand>
        startSession(request: IStartSession, sendSession: sendSessionFunc, sendCdr: sendCdrFunc): Promise<IAsyncCommand>
        stopSession(sessionID: string): Promise<IAsyncCommand>
        unlockConnector(locationID: string, evseUID: string, connectorID: string): Promise<IAsyncCommand>
    }
    locations: {
        getList(pagination?: IPaginationParams): Promise<ILocation[]>
        getObject(id: string): Promise<ILocation | undefined>
        getEvse(locationID: string, evseUID: string): Promise<IEvse | undefined>
        getConnector(locationID: string, evseUID: string, connectorID: string): Promise<IConnector | undefined>
    }
}