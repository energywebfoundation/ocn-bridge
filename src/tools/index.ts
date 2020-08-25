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
import { IncomingHttpHeaders } from "http"
import * as uuid from "uuid"
import { IPaginationParams } from "../models/ocpi/common"
import { IOcpiParty } from "../services/request.service"
import { ISignableHeaders } from "@shareandcharge/ocn-notary/dist/ocpi-request.interface"

export const stripVersions = (url: string): string => {
    if (url.endsWith("/ocpi/versions")) {
        return url.replace("/ocpi/versions", "")
    }
    return url
}

/**
 * Creates OCPI headers with new request/correlation IDs and reversed OCPI-From/To values
 * @param req express request object
 * @returns IHeaders object
 */
export const setResponseHeaders = (requestHeaders: IncomingHttpHeaders): ISignableHeaders => {
    return {
        "x-correlation-id": uuid.v4(),
        "ocpi-from-country-code": requestHeaders["ocpi-to-country-code"] as string,
        "ocpi-from-party-id": requestHeaders["ocpi-to-party-id"] as string,
        "ocpi-to-country-code": requestHeaders["ocpi-from-country-code"] as string,
        "ocpi-to-party-id": requestHeaders["ocpi-from-party-id"] as string
    }
}

/**
 * Format pagination url encoded params
 */
export const formatPaginationParams = (params: any): IPaginationParams => {
    const pagination: { [key: string]: any } = {}
    if (params.date_from) {
        pagination.date_from = params.date_from
    }
    if (params.date_to) {
        pagination.date_to = params.date_to
    }
    if (params.offset) {
        pagination.offset = parseInt(params.offset, 10)
    }
    if (params.limit) {
        pagination.limit = parseInt(params.limit, 10)
    }
    return pagination
}

export const toOcpiParty = (headers: IncomingHttpHeaders): IOcpiParty => {
    return {
        country_code: headers["ocpi-from-country-code"] as string,
        party_id: headers["ocpi-from-party-id"] as string,
    }
}