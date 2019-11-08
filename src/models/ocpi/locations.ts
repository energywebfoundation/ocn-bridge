import { IBusinessDetails, IDisplayText, IImage } from "./common";

export interface ILocation {
    country_code: string
    party_id: string
    id: string
    type: "ON_STREET" | "PARKING_GARAGE" | "UNDERGROUND_GARAGE" | "PARKING_LOT" | "OTHER" | "UNKNOWN"
    name?: string
    address: string
    city: string
    postal_code?: string
    state?: string
    country: string
    coordinates: IGeoLocation
    related_locations?: IAdditionalGeoLocation[]
    evses?: IEvse[]
    directions?: IDisplayText[]
    operator?: IBusinessDetails
    suboperator?: IBusinessDetails
    owner?: IBusinessDetails
    facilities?: string[]
    time_zone?: string
    opening_times?: IHours
    charging_when_closed?: boolean
    images?: IImage[]
    energy_mix?: IEnergyMix
    last_updated: string
}

export interface IGeoLocation {
    latitude: string
    longitude: string
}

export interface IAdditionalGeoLocation {
    latitude: string
    longitude: string
    name?: string
}

export interface IEvse {
    uid: string
    evse_id?: string
    status: evseStatus
    status_schedule?: Array<{
        period_begin: string
        period_end: string
        status: evseStatus
    }>
    capabilities?: string[]
    connectors: IConnector[]
    floor_level?: string
    coordinates?: IGeoLocation
    physical_reference?: string
    directions?: IDisplayText[]
    parking_restrictions?: string[]
    images?: IImage[]
    last_updated: string
}

export type evseStatus =
    "AVAILABLE" |
    "BLOCKED" |
    "CHARGING" |
    "INOPERATIVE" |
    "OUTOFORDER" |
    "PLANNED" |
    "REMOVED" |
    "RESERVED" |
    "UNKNOWN"

export interface IConnector {
    id: string
    standard: connectorStandard
    format: connectorFormat
    power_type: connectorPowerType
    max_voltage: number
    max_amperage: number
    max_electric_power?: number
    tariff_ids?: string[]
    terms_and_conditions?: string
    last_updated: string
}

export type connectorFormat = "SOCKET" | "CABLE"

export type connectorStandard =
    "CHADEMO" |
    "DOMESTIC_A" |
    "DOMESTIC_B" |
    "DOMESTIC_C" |
    "DOMESTIC_D" |
    "DOMESTIC_E" |
    "DOMESTIC_F" |
    "DOMESTIC_G" |
    "DOMESTIC_H" |
    "DOMESTIC_I" |
    "DOMESTIC_J" |
    "DOMESTIC_K" |
    "DOMESTIC_L" |
    "IEC_60309_2_single_16" |
    "IEC_60309_2_three_16" |
    "IEC_60309_2_three_32" |
    "IEC_60309_2_three_64" |
    "IEC_62196_T1" |
    "IEC_62196_T1_COMBO" |
    "IEC_62196_T2" |
    "IEC_62196_T2_COMBO" |
    "IEC_62196_T3A" |
    "IEC_62196_T3C" |
    "PANTOGRAPH_BOTTOM_UP" |
    "PANTOGRAPH_TOP_DOWN" |
    "TESLA_R" |
    "TESLA_S"

export type connectorPowerType = "AC_1_PHASE" | "AC_3_PHASE" | "DC"

export interface IEnergyMix {
    is_green_energy: boolean
    energy_sources?: Array<{
        source: string;
        percentage: number;
    }>;
    environ_impact?: Array<{
        category: string;
        amount: number;
    }>;
    supplier_name?: string
    energy_product_name?: string
}

export interface IHours {
    twentyfourseven: boolean
    regular_hours?: Array<{
        weekday: number
        period_begin: string
        period_end: string
    }>
    expectional_openings?: Array<{
        period_begin: string
        period_end: string
    }>
    expectional_closings?: Array<{
        period_begin: string
        period_end: string
    }>
}
