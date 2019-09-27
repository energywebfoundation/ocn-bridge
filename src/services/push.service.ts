import { IncomingHttpHeaders } from "http";
import fetch from "node-fetch";
import { IChargeDetailRecord } from "../models/ocpi/cdrs";
import { IResponse } from "../models/ocpi/common";
import { ISession } from "../models/ocpi/session";
import { IPluggableDB } from "../models/pluggableDB";
import { setResponseHeaders } from "../tools/tools";

export type sendSessionFunc = (session: ISession) => Promise<IResponse<any>>
export type sendCdrFunc = (cdr: IChargeDetailRecord) => Promise<IResponse<any>>

export class PushService {

    constructor(private db: IPluggableDB) {}

    /**
     * Prepare push updates for a particular session
     * @param headers incoming request headers used for response routing
     * @returns anonymous function which sends the session to the request's sender
     */
    public prepareSessionUpdate(headers: IncomingHttpHeaders): sendSessionFunc {
        return async (session) => {
            const endpoint = await this.db.getEndpoint("sessions", "RECEIVER")
            const path = `/${headers["ocpi-to-country-code"]}/${headers["ocpi-to-party-id"]}/${session.id}`
            const token = await this.db.getTokenC()

            const response = await fetch(endpoint + path, {
                method: "PUT",
                headers: Object.assign({
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                }, setResponseHeaders(headers)),
                body: JSON.stringify(session)
            })
            return response.json()
        }
    }

    /**
     * Prepare a push charge detail record request for a particular session
     * @param headers incoming request headers used for response routing
     * @returns anonymous function which sends the cdr to the request's sender
     */
    public prepareCDR(headers: IncomingHttpHeaders): sendCdrFunc {
        return async (cdr) => {
            const endpoint = await this.db.getEndpoint("cdrs", "RECEIVER")
            const token = await this.db.getTokenC()
            const response = await fetch(endpoint, {
                method: "POST",
                headers: Object.assign({
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                }, setResponseHeaders(headers)),
                body: JSON.stringify(cdr)
            })
            return response.json()
        }
    }
}
