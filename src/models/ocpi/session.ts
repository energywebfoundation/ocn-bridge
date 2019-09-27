export interface ISession {
    country_code: string
    party_id: string
    id: string
    start_date_time: Date
    end_date_time?: Date
    kwh: number
    cdr_token: ICdrToken
    auth_method: string
    authorization_reference?: string
    location_id: string
    evse_uid: string
    connector_id: string
    meter_id?: string
    currency: string
    charging_periods?: IChargingPeriod[]
    total_cost?: IPrice
    status: string
    last_updated: Date
}

export interface ICdrToken {
    uid: string
    type: string
    contract_id: string
}

export interface IChargingPeriod {
    start_date_time: Date
    dimensions: Array<{
        type: string
        volume: number
    }>
    tariff_id: string
}

export interface IPrice {
    excl_vat: number
    incl_vat?: number
}
