import { IncomingHttpHeaders } from "http"
import * as uuid from "uuid"
import { IHeaders, IPaginationParams } from "../models/ocpi/common"

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
export const setResponseHeaders = (requestHeaders: IncomingHttpHeaders): IHeaders => {
    return {
        "X-Request-ID": uuid.v4(),
        "X-Correlation-ID": uuid.v4(),
        "OCPI-From-Country-Code": requestHeaders["ocpi-to-country-code"] as string,
        "OCPI-From-Party-Id": requestHeaders["ocpi-to-party-id"] as string,
        "OCPI-To-Country-Code": requestHeaders["ocpi-from-country-code"] as string,
        "OCPI-To-Party-Id": requestHeaders["ocpi-from-party-id"] as string
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
