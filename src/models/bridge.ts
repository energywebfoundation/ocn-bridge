import { Server } from "http";
import { PushService } from "../services";

export interface IBridge {
    server: Server,
    pushService: PushService
}