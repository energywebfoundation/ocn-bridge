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
import { ISession } from "../models/ocpi/session";
import { IPluggableDB } from "../models/pluggableDB";
import { SignerService } from "./signer.service";

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

    constructor(private db: IPluggableDB, private from: IOcpiParty, private signer?: SignerService) {}

    /**
     * Prepare push updates for a particular session
     * @param headers incoming request headers used for response routing
     * @returns anonymous function which sends the session to the request's sender
     */
    public async sendSession(recipient: IOcpiParty, session: ISession): Promise<IOcpiResponse> {
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
     * Prepare a push charge detail record request for a particular session
     * @param headers incoming request headers used for response routing
     * @returns anonymous function which sends the cdr to the request's sender
     */
    public async sendCdr(recipient: IOcpiParty, cdr: IChargeDetailRecord): Promise<IOcpiResponse> {
        const url = await this.db.getEndpoint("cdrs", "RECEIVER")
        const headers = await this.getHeaders(recipient, cdr)
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(cdr)
        })
        return response.json()
    }

    private async getHeaders(recipient: IOcpiParty, body: any): Promise<{[key: string]: string}> {
        const correlationId = uuid.v4()
        const headers = {
            "Content-Type": "application/json",
            "Authorization": await this.db.getTokenC(),
            "X-Request-ID": uuid.v4(),
            "X-Correlation-ID": correlationId,
            "OCPI-From-Country-Code": this.from.country_code,
            "OCPI-From-Party-Id": this.from.party_id,
            "OCPI-To-Country-Code": recipient.country_code,
            "OCPI-To-Party-Id": recipient.party_id
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
