import * as uuid from "uuid";
import { IChargeDetailRecord } from "../models/ocpi/cdrs";
import { ISession } from "../models/ocpi/session";
import { IPluggableDB } from "../models/pluggableDB";

export interface IOcpiParty {
    country_code: string
    party_id: string
}

export interface IOcpiResponse {
    status_code: string
    status_message?: string
    data?: any
    timestamp: string
}

export class PushService {

    constructor(private db: IPluggableDB, private from: IOcpiParty) {}

    /**
     * Prepare push updates for a particular session
     * @param headers incoming request headers used for response routing
     * @returns anonymous function which sends the session to the request's sender
     */
    public async sendSession(recipient: IOcpiParty, session: ISession): Promise<IOcpiResponse> {
        const endpoint = await this.db.getEndpoint("sessions", "RECEIVER")
        const path = `/${recipient.country_code}/${recipient.party_id}/${session.id}`
        const url = endpoint + path
        const headers = await this.getHeaders(recipient)
        const response = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(session)
        })
        return response.json()
    }

    /**
     * Prepare a push charge detail record request for a particular session
     * @param headers incoming request headers used for response routing
     * @returns anonymous function which sends the cdr to the request's sender
     */
    public async sendCdr(recipient: IOcpiParty, cdr: IChargeDetailRecord): Promise<IOcpiResponse> {
        const url = await this.db.getEndpoint("cdrs", "RECEIVER")
        const headers = await this.getHeaders(recipient)
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(cdr)
        })
        return response.json()
    }

    private async getHeaders(recipient: IOcpiParty): Promise<{[key: string]: string}> {
        return {
            "Content-Type": "application/json",
            "Authorization": await this.db.getTokenC(),
            "X-Request-ID": uuid.v4(),
            "X-Correlation-ID": uuid.v4(),
            "OCPI-From-Country-Code": this.from.country_code,
            "OCPI-From-Party-Id": this.from.party_id,
            "OCPI-To-Country-Code": recipient.country_code,
            "OCPI-To-Party-Id": recipient.party_id
        }
    }
}
