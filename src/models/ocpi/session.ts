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
import { ITokenType } from "./tokens";

export interface ISession {
    country_code: string
    party_id: string
    id: string
    start_date_time: string
    end_date_time?: string
    kwh: number
    cdr_token: ICdrToken
    auth_method: authMethod
    authorization_reference?: string
    location_id: string
    evse_uid: string
    connector_id: string
    meter_id?: string
    currency: string
    charging_periods?: IChargingPeriod[]
    total_cost?: IPrice
    status: sessionStatus
    last_updated: string
}

export type sessionStatus = "ACTIVE" | "COMPLETED" | "INVALID" | "PENDING" | "RESERVATION"

export type authMethod = "AUTH_REQUEST" | "COMMAND" | "WHITELIST"

export interface ICdrToken {
    uid: string
    type: ITokenType
    contract_id: string
}

export interface IChargingPeriod {
    start_date_time: string
    dimensions: Array<{
        type:
            "CURRENT" |
            "ENERGY" |
            "ENERGY_EXPORT" |
            "ENERGY_IMPORT" |
            "MAX_CURRENT" |
            "MIN_CURRENT" |
            "MAX_POWER" |
            "MIN_POWER" |
            "PARKING_TIME" |
            "POWER" |
            "RESERVATION_TIME" |
            "STATE_OF_CHARGE" |
            "TIME"
        volume: number
    }>
    tariff_id?: string
}

export interface IPrice {
    excl_vat: number
    incl_vat?: number
}
