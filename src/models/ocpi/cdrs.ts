import { ICdrToken, IChargingPeriod, IPrice } from "./session";
import { ITariff } from "./tarifffs";

export interface IChargeDetailRecord {
    country_code: string
    party_id: string
    id: string
    start_date_time: Date
    end_date_time: Date
    session_id?: string
    cdr_token: ICdrToken
    auth_method: string
    authorization_reference?: string
    cdr_location: ICdrLocation
    meter_id?: string
    currency: string
    tariffs?: ITariff[]
    charging_periods: IChargingPeriod[]
    signed_data?: ISignedData
    total_cost: IPrice
    total_fixed_cost?: IPrice
    total_energy: number
    total_energy_cost?: IPrice
    total_time: number
    total_time_cost?: IPrice
    total_parking_time?: number
    total_parking_cost?: IPrice
    total_reservation_cost?: IPrice
    remark?: string
    invoice_reference_id?: string
    credit?: boolean
    credit_reference_id?: string
    last_updated: Date
}

export interface ISignedData {
    encoding_method: string
    encoding_method_version?: number
    public_key?: string
    signed_values: Array<{
        nature: string
        plain_data: string
        signed_data: string
    }>
    url: string
}

export interface IGeoLocation {
    latitude: string
    longitude: string
}

export interface ICdrLocation {
    id: string
    name?: string
    address: string
    city: string
    postal_code: string
    country: string
    coordinates: IGeoLocation
    evse_uid: string
    evse_id: string
    connector_id: string
    connector_standard: string
    connector_format: string
    connector_power_type: string
}
