import { Server } from "http";
import { RegistrationService, RequestService } from "../services";

export interface IBridge {
    server: Server,
    requests: RequestService,
    registry: RegistrationService,
}
