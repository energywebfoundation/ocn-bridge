import { Server } from "http";
import { PushService } from "../services";
import { DefaultRegistry } from "./ocn";

export interface IBridge {
    server: Server,
    pushService: PushService
}