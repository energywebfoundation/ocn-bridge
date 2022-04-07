/*
    Copyright 2019-2020 eMobilify GmbH

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import fetch from "node-fetch";
import * as uuid from "uuid";
import { IChargeDetailRecord } from "../models/ocpi/cdrs";
import { ISession } from "../models/ocpi/sessions";
import {IStartSession, IStopSession} from "../models/pluggableAPI"
import { IPluggableDB } from "../models/pluggableDB";
import { SignerService } from "./signer.service";
import { ILocation, IToken } from "../models";

export interface IOcpiParty {
    country_code: string
    party_id: string
}

export interface IOcpiResponse<T> {
    status_code: string
    status_message?: string
    data?: T
    timestamp: string
}

/**
 * WIP push/pull service instantiated by the bridge.
 * Contains common PUSH methods used in OCPI.
 */
export class RequestService {

    constructor(private db: IPluggableDB, private from: IOcpiParty, private signer?: SignerService) {}

    /**
     * Send a request to obtain location data (i.e. GET sender interface)
     * @param recipient party the request should be sent to
     */
    public async getLocations(recipient: IOcpiParty): Promise<IOcpiResponse<ILocation[]>> {
        const endpoint = await this.db.getEndpoint("locations", "SENDER")
        const headers = await this.getHeaders(recipient)
        const response = await fetch(endpoint, { headers })
        return response.json()
    }

    /**
     * Send a request to obtain token data (i.e. GET sender interface)
     * @param recipient party the request should be sent to
     */
    public async getTokens(recipient: IOcpiParty): Promise<IOcpiResponse<IToken[]>> {
        const endpoint = await this.db.getEndpoint("tokens", "SENDER")
        const headers = await this.getHeaders(recipient)
        const response = await fetch(endpoint, { headers })
        return response.json()
    }

    /**
     * Send session data (i.e. PUT receiver interface)
     * @param headers incoming request headers used for response routing
     */
    public async sendSession(recipient: IOcpiParty, session: ISession): Promise<IOcpiResponse<undefined>> {
        const endpoint = await this.db.getEndpoint("sessions", "RECEIVER")
        const path = `/${recipient.country_code}/${recipient.party_id}/${session.id}`
        const url = endpoint + path
        const headers = await this.getHeaders(recipient, session)
        const response = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(session)
        })
        return response.json()
    }

    /**
     * Start charging session 
     * @param headers incoming request headers used for response routing
     */
    public async startSession(recipient: IOcpiParty, startRequest: IStartSession): Promise<IOcpiResponse<undefined>> {
        const endpoint = await this.db.getEndpoint("commands", "RECEIVER")
        const path = "/START_SESSION"
        const url = endpoint + path
        const headers = await this.getHeaders(recipient, startRequest)
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(startRequest)
        })
        return response.json()
    }

    /**
     * Stop charging session 
     * @param headers incoming request headers used for response routing
     */
    public async stopSession(recipient: IOcpiParty, stopRequest: IStopSession): Promise<IOcpiResponse<undefined>> {
        const endpoint = await this.db.getEndpoint("commands", "RECEIVER")
        const path = "/STOP_SESSION"
        const url = endpoint + path
        const headers = await this.getHeaders(recipient, stopRequest)
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(stopRequest)
        })
        return response.json()
    }

    /**
     * Sends a charge detail record for a particular session (i.e. POST receiver interface)
     * @param headers incoming request headers used for response routing
     */
    public async sendCdr(recipient: IOcpiParty, cdr: IChargeDetailRecord): Promise<IOcpiResponse<undefined>> {
        const url = await this.db.getEndpoint("cdrs", "RECEIVER")
        const headers = await this.getHeaders(recipient, cdr)
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(cdr)
        })
        return response.json()
    }

    private async getHeaders(recipient: IOcpiParty, body?: any): Promise<{[key: string]: string}> {
        const correlationId = uuid.v4()
        const headers: {[key: string]: string} = {
            "Authorization": await this.db.getTokenC(),
            "X-Request-ID": uuid.v4(),
            "X-Correlation-ID": correlationId,
            "OCPI-From-Country-Code": this.from.country_code,
            "OCPI-From-Party-Id": this.from.party_id,
            "OCPI-To-Country-Code": recipient.country_code,
            "OCPI-To-Party-Id": recipient.party_id
        }

        if (body) {
            headers["Content-Type"] = "application/json"
        }

        if (!this.signer) {
            return headers
        }

        const signable = {
            "x-correlation-id": correlationId,
            "ocpi-from-country-code": this.from.country_code,
            "ocpi-from-party-id": this.from.party_id,
            "ocpi-to-country-code": recipient.country_code,
            "ocpi-to-party-id": recipient.party_id
        }
        const signature = { "OCN-Signature": await this.signer.getSignature({ headers: signable, body }) }
        return Object.assign(signature, headers)
    }
}
