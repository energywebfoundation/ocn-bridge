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
