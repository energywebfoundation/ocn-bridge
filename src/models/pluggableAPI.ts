import { IAsyncCommand } from "./ocpi/commands";
import { IToken } from "./ocpi/tokens";

export interface IPluggableAPI {
    commands: {
        cancelReservation(reservationID: string): Promise<IAsyncCommand>
        reserveNow(token: IToken, expiryDate: string, reservationID: string, locationID: string, evseUID?: string, connectorID?: string): Promise<IAsyncCommand>
        startSession(token: IToken, locationID: string, evseUID?: string, connectorID?: string): Promise<IAsyncCommand>
        stopSession(sessionID: string): Promise<IAsyncCommand>
        unlockConnector(locationID: string, evseUID: string, connectorID: string): Promise<IAsyncCommand>
    }
}
