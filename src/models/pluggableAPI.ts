import { IAsyncCommand } from "./ocpi/commands";

export interface IPluggableAPI {
    commands: {
        startSession(locationID: string, evseUID?: string, connectorID?: string): Promise<IAsyncCommand>
    }
}
