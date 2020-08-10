import { Server } from "http";
import { RequestService } from "../services";

export interface IBridge {
    server: Server,
    requests: RequestService
}